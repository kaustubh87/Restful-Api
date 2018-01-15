const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const UserController = require('../controllers/users');

router.post('/signup', UserController.users_get_all_users);

router.post('/login', UserController.user_get_login);

router.delete('/:userId', (req,res,next) => {
    User.remove(
        {
            _id: req.params.userId
        }
    )
    .exec().
    then(result => {
        console.log(result);
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
});

module.exports = router;
