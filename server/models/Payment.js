
const mongoose  = require('mongoose');


const feeSchema = new mongoose.Schema({
    admissionNumber: { type: String, required: true, unique: true },
    date: String,
    description: String,
    amount: Number,
    balance: Number,
    paymentDate:{type: Date, default: Date.now},
    feeIds:{ type: mongoose.Schema.Types.ObjectId, ref: 'Fee' }
})
const paymentModel = mongoose.model("payment", feeSchema);

module.exports = paymentModel;