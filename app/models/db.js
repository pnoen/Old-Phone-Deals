var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://lalemany:xZ8YtOEII8Hs0YLI@l05g05.un2muoq.mongodb.net/oldPhoneDeals', { useNewUrlParser: true }, function () {
  console.log('mongodb connected')
});

module.exports = mongoose;