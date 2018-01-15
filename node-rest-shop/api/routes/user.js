const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const UserController = require('../controllers/users');

router.post('/signup', UserController.users_get_all_users);

router.post('/login', (req, res, next) => {
    User.find({
        email: req.body.email
    })
    .exec()
    .then(user => {
        if(user.length <1) {
            return res.status(401).json({
                message: 'Authorization failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
            if(err){
                return res.status(401).json({
                    message: 'Authorization failed'
                });
            }
            if(result) {
                //User has logged in so generate a token for him
               const token =  jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                "secret", 
                {
                    expiresIn: "1h"
                }
            );
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Authorization failed'
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.statusCode(500).json({
            error: err
        })
    })
});

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
