const mongoose = require('mongoose');

const credentialsSchema = new mongoose.Schema({
    admissionNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
    StudentModel: { type: mongoose.Schema.Types.ObjectId, ref: 'students_record' },
});


credentialsSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({email, _id: {$ne: excludeUserId}});
    return !! user;
    
}

const Credentials = mongoose.model('Credentials', credentialsSchema);

module.exports = Credentials;
