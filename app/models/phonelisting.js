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

var Phonelisting = mongoose.model('Phonelisting', phonelistingSchema, 'phonelisting');

module.exports = Phonelisting;