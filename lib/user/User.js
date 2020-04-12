const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: {
    type: String, trim: true, index: {
      unique: true,
      partialFilterExpression: {email: {$type: 'string'}}
    }
  },
  password: String,
  phone: {
    type: String, trim: true
  },
  fullName: String,
  resetPassword: {token: String, createdDate: Date}
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
