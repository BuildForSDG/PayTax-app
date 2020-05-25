/* eslint-disable no-unused-vars */
const router = require('express').Router();
const cors = require('cors');
const paymentsController = require('../controllers/paymentsController');
const usersController = require('../controllers/usersController');

router.use(cors());


router.get('/tax_types', usersController.mustBeLoggedIn, paymentsController.getTaxTypes);
router.post('/tax_types', usersController.mustBeLoggedIn, paymentsController.addTaxTypes);
router.get('/history/:taxPayerID', usersController.mustBeLoggedIn, paymentsController.paymentHistory);
router.get('/receipt/:taxPayerID', paymentsController.paymentReceipt);

module.exports = router;
