/* eslint-disable linebreak-style */
const router = require('express').Router();
const cors = require('cors');
const usersController = require('../controllers/usersController');


router.use(cors());


router.post('/register', usersController.registeration); // sent taxId as email
router.post('/login', usersController.login);
router.post('/recovery', usersController.reset_password);
router.get('/:taxID', usersController.mustBeLoggedIn, usersController.getUserData);


module.exports = router;
