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
        'title': { $regex: filteredSearch, $options: "i" },
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

phonelistingSchema.statics.getHighestPrice = function (callback) {
    return this.find({'disabled': { $exists: false }})
        .sort({ 'price': -1 })
        .limit(1)
        .exec(callback)
}

phonelistingSchema.statics.getListOfBrands = function (callback) {
  return this.distinct('brand').exec(callback);
}

phonelistingSchema.statics.buyPhone = function (title, seller, quantity, callback) {
    this.updateOne(
        {
        'title': title,
        'seller': seller},
        {$inc: {'stock': -quantity}}).exec(callback);
}

phonelistingSchema.statics.setHiddenReviewByTitleAndSeller = function (title, seller, reviewIndex, callback) {
    let reviewField = "reviews." + reviewIndex + ".hidden";
    return this.updateOne(
        {
            "title": title,
            "seller": seller
        },
        { $set: { [reviewField]: "" } })
        .exec(callback);
}

phonelistingSchema.statics.unsetHiddenReviewByTitleAndSeller = function (title, seller, reviewIndex, callback) {
    let reviewField = "reviews." + reviewIndex + ".hidden";
    return this.updateOne(
        {
            "title": title,
            "seller": seller
        },
        { $unset: { [reviewField]: "" } })
        .exec(callback);
}


// Adds the new phone listing
phonelistingSchema.statics.addNewListing = function (title, brand, image, stock, seller, price, reviews) {
  return this.create({
    title: title,
    brand: brand,
    image: image,
    stock: stock,
    seller: seller,
    price: price,
    reviews: reviews
  });
}


// Gets the listings for the current user
phonelistingSchema.statics.getListingsByUser = function (id, callback) {
  return this.find({seller: id}).exec(callback);
}


// Gets the comments for this user
phonelistingSchema.statics.getUsersComments = function (id, callback) {
  return this.find({seller: id}).exec(callback);
}


// Disables this listing
phonelistingSchema.statics.disableListing = function (id, callback) {
  return this.updateOne(
    {_id: id},
    { $set: {"disabled": ""} }
  ).exec(callback);
}


// Enables this listing
phonelistingSchema.statics.enableListing = function (id, callback) {
  return this.updateOne(
    {_id: id},
    { $unset: {"disabled": 1} }
  ).exec(callback);
}


// Removes this listing
phonelistingSchema.statics.removeListing = function (id, callback) {
  return this.deleteOne(
    {_id: id}
  ).exec(callback);
}

phonelistingSchema.statics.addReview = function (id, reviewer, rating, comment, callback) {
  return this.updateOne(
    { _id: id },
    { $push: {
      "reviews": {
        "reviewer": reviewer,
        "rating": rating,
        "comment": comment
      }}})
    .exec(callback);
}


var Phonelisting = mongoose.model('Phonelisting', phonelistingSchema, 'phonelisting');

module.exports = Phonelisting;
