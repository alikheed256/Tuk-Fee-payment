const mongoose = require('mongoose')
const { type, required } = require('./validation')


const studentSchema = new mongoose.Schema({
    admissionNumber: { type: String, required: true, unique: true },
    studentName: String,
    course: String,
    currentYear: String,
    feeBalance: Number,
})
const StudentModel = mongoose.model("students_record", studentSchema);

module.exports = StudentModel;
