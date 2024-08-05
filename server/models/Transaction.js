const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    PhoneNumber: { type: String, required: true },
    Amount: { type: Number, required: true },
    Timestamp: { type: String, required: true },
    Status: { type: String, required: true, default: "Pending" },
    AdmissionNumber: { type: mongoose.Schema.Types.ObjectId, ref:'students_record' }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
