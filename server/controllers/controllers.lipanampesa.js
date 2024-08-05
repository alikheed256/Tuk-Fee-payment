const axios = require('axios');
const { getTimestamp } = require('../Utils/utils.timestamp.js');
const Transaction = require('../models/Transaction');

const initiateSTKPush = async (req, res) => {
    try {
        const phone = req.body.phone.substring(1); 
        const amount = req.body.amount;
        const admissionNumber = req.body.admissionNumber;

        getTimestamp();

        const shortcode = process.env.BUSINESS_SHORT_CODE;
        const passkey = process.env.PASS_KEY;

        if (!shortcode || !passkey) {
            throw new Error("MPESA credentials are not set in environment variables.");
        }

        const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

        const requestData = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: `254${phone}`,
            PartyB: shortcode,
            PhoneNumber: `254${phone}`,
            CallBackURL: process.env.CALLBACK_URL, 
            AccountReference: `254${phone}`,
            TransactionDesc: "School Fees Payment",
        };

        console.log('Request Data:', requestData);

        const response = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${req.safaricom_access_token}`,
                    'Content-Type': 'application/json'
                },
            }
        );

        console.log('Response Data:', response.data);

        // Save transaction to the database
        // const newTransaction = new Transaction({
        //     transactionId: response.data.CheckoutRequestID,
        //     PhoneNumber: `254${phone}`,
        //     Amount: amount,
        //     Timestamp: timestamp,
        //     MpesaReceiptNumber: response.data.CheckoutRequestID,
        //     Status: "Pending",
        //     AdmissionNumber: admissionNumber
        // });
       

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).send({
            message: "Error initiating STK push",
            error: error.message
        });
    }
};

const stkPushCallback = async (req, res) => {
    try {
        const callbackData = req.body;
        console.log("Callback data received:", JSON.stringify(callbackData, null, 2));

        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata
        } = callbackData.Body.stkCallback;

        if (CallbackMetadata) {
            const meta = CallbackMetadata.Item.reduce((acc, item) => {
                acc[item.Name] = item.Value;
                return acc;
            }, {});

            console.log("Extracted metadata:", meta);

            const PhoneNumber = meta.PhoneNumber.toString();
            const Amount = meta.Amount.toString();
            const MpesaReceiptNumber = meta.MpesaReceiptNumber.toString();
            const TransactionDate = meta.TransactionDate.toString();

            if (ResultCode === 0) { // Success
                await Transaction.findOneAndUpdate(
                    { transactionId: CheckoutRequestID },
                    { Status: "Completed", MpesaReceiptNumber: MpesaReceiptNumber },
                    { new: true }
                );
            } else { // Failed
                await Transaction.findOneAndUpdate(
                    { transactionId: CheckoutRequestID },
                    { Status: "Failed" },
                    { new: true }
                );
            }
        }

        res.json(true);
    } catch (e) {
        console.error("Error while processing the callback:", e);
        res.status(503).send({
            message: "Something went wrong with the callback",
            error: e.message
        });
     }
};

module.exports = {
    initiateSTKPush,
    stkPushCallback,
};
