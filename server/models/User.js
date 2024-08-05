
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email :String,
    picture: String,
    Credentials:{ type: mongoose.Schema.Types.ObjectId, ref: 'Credentials' },



});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
