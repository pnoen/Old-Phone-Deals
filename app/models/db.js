var mongoose = require('mongoose');

// Replace with mongodb link
mongoose.connect('dbLink', { useNewUrlParser: true }, function () {
  console.log('mongodb connected')
});

module.exports = mongoose;
