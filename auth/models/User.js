var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name : String,
  email : String,
  password : String,
  staffid : String,  // staff id of user
  scopes : [String] //scopes of the user 
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');