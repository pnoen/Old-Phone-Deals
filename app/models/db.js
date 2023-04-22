var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/oldPhoneDeals', { useNewUrlParser: true }, function () {
  console.log('mongodb connected')
});

module.exports = mongoose;