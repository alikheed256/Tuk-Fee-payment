const express = require('express');
const router = express.Router();
const {
    initiateSTKPush,
    stkPushCallback,

} = require('../controllers/controllers.lipanampesa.js');

const { getAccessToken} = require('../middlewares/middlewares.generateAccessToken.js');

router.route('/stkPush').post(getAccessToken, initiateSTKPush);
router.route('/stkPushCallback').post(stkPushCallback);


module.exports = router;
