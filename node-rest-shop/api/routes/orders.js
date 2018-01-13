const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, (req,res,next) => {
   
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            res.status(404).json({
                message: 'Product not found'
            })
        }
        const order = new Order ({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' +result._id
                }
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    })


router.get('/:orderId',checkAuth, (req,res,next)=>{
    const orderId = req.params.orderId;
   Order.findById(orderId)
   .populate('product')
   .exec()
   .then(order => {
       if(!order) {
           res.status(404).json({
               message: 'Order not found'
           });
       }
       res.status(200).json({
           order: order,
           request: {
               type: 'GET',
               url: 'http://localhost:4312/orders'
           }
       });
   })
   .catch( err =>{
       res.status(500).json({
           error : err
       })
   });
});

router.delete('/:orderId', checkAuth, (req,res,next)=> {
    const orderId = req.params.orderId;
    Order.remove({
        _id: orderId
    }).exec()
    .then(data => {
        res.status(200).json({
            message: 'Order was deleted successfully',
            request: {
                type: 'GET',
                url: 'http://localhost:4312/orders'
            }
        })   
    })
    .catch(err => {
        error: err
    })
});


module.exports = router;