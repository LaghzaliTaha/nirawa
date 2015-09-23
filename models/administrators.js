var mongoose = require('mongoose');
var administratorSchema = new mongoose.Schema({
  email_or_phone: String,
  password: String,
  first_name: String,
  last_name: String
});
mongoose.model('Administrator', administratorSchema);
