const express = require('express');
const router = express.Router();
const { createPaymentForFee } = require('../controllers/controllers.payment');


router.post('/create', createPaymentForFee);

module.exports = router;
