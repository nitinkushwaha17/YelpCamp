const mongoose = require('mongoose');
const PassportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User', userSchema);