const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const UserController = require('../controllers/users');

router.post('/signup', UserController.users_get_all_users);

router.post('/login', UserController.user_get_login);

router.delete('/:userId', UserController.user_delete);

module.exports = router;
