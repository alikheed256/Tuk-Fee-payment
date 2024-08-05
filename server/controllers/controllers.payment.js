const Payment = require('../models/Payment');
const Fee = require('../models/Fee');
const Student = require('../models/StudentRecords'); 

async function createPaymentForFee(req, res) {
  try {
    const { feeId, amount, method } = req.body;
    console.log(req.body);

    const validMethods = ['Mpesa', 'Bank'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    const admissionNumber = fee.admissionNumber;
    const student = await Student.findOne({ admissionNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const payment = new Payment({
      admissionNumber,
      amount,
      method,
      feeIds: [feeId]
    });

    const savedPayment = await payment.save();

    
    await Fee.findByIdAndUpdate(
      feeId,
      { $push: { payments: savedPayment._id }, $set: { status: 'paid' } },
      { new: true }
    );

    res.status(201).json(savedPayment);
  } catch (error) {
    console.error('Failed to create payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
}

module.exports = {
  createPaymentForFee,
};
