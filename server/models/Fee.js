
const { number } = require('joi')
const mongoose = require('mongoose')


const feeSchema = new mongoose.Schema({
    admissionNumber:{ type: mongoose.Schema.Types.ObjectId, required:true, ref: 'students_record' },
    feeType:{type: String , required: true},
    amount:{type: Number, required: true},
    genarateDate:{ type:Date , default:Date.now},
    status:{type:String ,enum:['paid','unpaid','upcomming'],default:'upcomming'},
    paidAmount:{type:Number, default:0},
    payments:[{ type: mongoose.Schema.Types.ObjectId, required:true, ref: 'payment' }]

})

const FeeModel = mongoose.model("Fee", feeSchema);

module.exports = FeeModel;