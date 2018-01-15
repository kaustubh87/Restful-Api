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