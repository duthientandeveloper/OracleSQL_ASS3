var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../models/user');

module.exports = router;