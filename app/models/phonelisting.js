var mongoose = require('./db');

var phonelistingSchema = new mongoose.Schema({
    title: String,
    brand: String,
    image: String,
    stock: Number,
    seller: String,
    price: Number,
    reviews: [
        {
            reviewer: String,
            rating: Number,
            comment: String,
            hidden: String
        }
    ],
    disabled: String
})

phonelistingSchema.statics.find5LeastQuantityAvaliable = function (callback) {
    return this.find({
        'stock': { $gte: 1 },
        'disabled': { $exists: false }})
        .sort({ stock: 1 })
        .limit(5)
        .exec(callback)
}

phonelistingSchema.statics.find5HighestAverageRating = function (callback) {
    return this.aggregate([
        {
            $match: {
                'disabled': { $exists: false },
                $expr: { $gte: [{ $size: "$reviews" }, 2] }
            }
        },
        { $addFields: { avgRating: { $avg: "$reviews.rating" } } }])
        .sort({ avgRating: -1 })
        .limit(5)
        .exec(callback)
}

phonelistingSchema.statics.findPhone = function (title, seller, callback) {
    return this.find({
        'title': title,
        'seller': seller})
        .limit(1)
        .exec(callback)
}

phonelistingSchema.statics.getPhones = function (searchTerm, brand, maxPrice, callback) {
    // https://stackoverflow.com/a/30851002
    filteredSearch = searchTerm.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');

    params = {
        'title': { $regex: filteredSearch },
        'disabled': { $exists: false }
    }

    if (brand) {
        params['brand'] = brand;
    }
    if (maxPrice) {
        params['price'] = { $lte: maxPrice };
    }

    return this.find(params)
        .exec(callback)
}

phonelistingSchema.statics.getListOfBrands = function (callback) {
  return this.distinct('brand').exec(callback);
}

var Phonelisting = mongoose.model('Phonelisting', phonelistingSchema, 'phonelisting');

module.exports = Phonelisting;
