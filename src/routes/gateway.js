/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const router = require('express').Router();
const cors = require('cors');
const usersController = require('../controllers/usersController');
const gatewayController = require('../controllers/gatewayController');

router.use(cors());

// protected routes
router.post('/pay', usersController.mustBeLoggedIn, gatewayController.pay);

router.get('/callback', gatewayController.verify);


module.exports = router;
