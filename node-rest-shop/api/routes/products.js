const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const Product = require('../models/product');

router.get('/', (req,res,next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4312/products/' + doc._id
                    }
                }
            })
        };
  
        if(docs.length>=0){
        res.status(200).json(response);
        } else {
            res.status(404).json({
                message: 'No entries found'
            });
        }
        
    });
});

// upload.single uploads only one file

router.post('/', upload.single('productImage') ,(req,res,next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id : result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:4312/products' + doc._id
                }
            }
        });
    });

});

router.get('/:productId', (req,res,next) => {

    const pId = req.params.productId;
    Product.findById(pId).select('name price _id').exec().then(doc => {
        //console.log(doc);
        res.status(200).json({
            product :doc,
            request : {
                type: 'GET',
                url: 'http://localhost:4312/products'
            }
        });
    })
     .catch( err => {
         console.log(err);
         res.status(500).json({ error: err});
     });
 

});

router.patch('/:productId', (req,res,next) => {
    
    const id = req.params.productId;
   
    Product.update({
        _id: id
    }, {
        $set: {
            name: req.body.name,
            price: req.body.price
        }
    }).exec()
    .then( result => {
        console.log(result);
        res.status(200).json({
            message: 'Product Updated',
            request: {
                type: 'GET',
                url: 'http://localhost:4312/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            err: err
        })
    });

});

router.delete('/:productId', (req,res,next) => {
    
    const id = req.params.productId;
        Product.remove({
            _id : id
        }).exec().then(result => {
            //console.log('Product Deleted');
            res.status(200).json({
                message: 'Product was deleted',
                request: {
                    type: 'POST',
                    url: 'http:localhost:4312/products',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        });

});

module.exports = router;