const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

exports.users_get_all_users = (req,res,next) => {

    User.find({email: req.body.email}).exec().then(user => {
        if (user.length >=1 ){
            return res.status(409).json({
                message: 'Email address exists'
            });
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {   
                if(err){
                    res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });   
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        })
                    }).catch(err => {
                        console.log(err);
                        res.status(501),json({
                            error: err
                        });
                    });
                }
            });   
        }
    });
   
};

exports.user_get_login = (req, res, next) => {
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
};

exports.user_delete = (req,res,next) => {
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
};