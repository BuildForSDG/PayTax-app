/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('../config/auth.config');
const User = require('../models/Users');
const usersCollection = require('../db').db('paytax').collection('users');

exports.home = (req, res) => {
// return payer Id by email
  res.json('testing api');
};

exports.registeration = (req, res) => {
  const user = new User(req.body);
  user.register().then((result) => res.status(200).json({
    status: true,
    PaytaxId: result.taxPayerId
  })).catch((err) => {
    res.json(err);
  });
};

exports.login = [
  [
    // taxPayerId must be alphanumeric and at least 15 characters long
    check('taxPayerId').isAlphanumeric().withMessage('Payer ID must be alphanumeric')
      .isLength({ min: 10, max: 10 })
      .withMessage('Tax Payer ID must be 10 chars long'),
    // password must be at least 8 chars long
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars long')
  ], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, errors: errors.array() });
    }
    const user = await usersCollection.findOne({
      taxPayerId: req.body.taxPayerId
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        data: 'User not found'
      });
    }
    // check if password is valid
    const isPasswordValid = await bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        token: null,
        data: 'Invalid password'
      });
    }
    // create access token
    const token = jwt.sign({ id: user.id }, process.env.JWTSECRET, {
      expiresIn: 86400 // 24 hours
    });
    return res.status(200).json({
      status: true,
      token,
      data: user
    });
  }
];

exports.mustBeLoggedIn = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization || req.body.token;
  // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length).trimLeft();
  }
  try {
    req.apiUser = jwt.verify(token, process.env.JWTSECRET);
    next();
  } catch (error) {
    res.status(403).json({
      status: false,
      data: 'Sorry, you must provide a valid token.'
    });
  }
};

exports.recovery = (req, res) => {
  res.json('recovery in progress');
};

exports.getUserData = [
  [
    // taxPayerId must be alphanumeric and at least 15 characters long
    check('taxID').isAlphanumeric().withMessage('Payer ID must be alphanumeric')
      .isLength({ min: 10, max: 10 })
      .withMessage('Tax Payer ID must be 10 chars long')
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, errors: errors.array() });
    }
    const user = await usersCollection.findOne({
      taxPayerId: req.params.taxID
    }, { password: 0, _id: 0 });
    if (!user) {
      return res.status(400).json({
        status: false,
        data: 'User not found'
      });
    }
    return res.status(200).json({
      status: true,
      data: user
    });
  }
];

exports.recovery = function (req, res) {
  const { email } = req.body;
  User.recovery(email).then((userExists) => {

  }).catch((err) => {

  });
};
// middleware
exports.recoveryLink = function (req, res) {
  const { token } = req.params;
  if (!token) {
    return;
  }
  // confirm token
};
