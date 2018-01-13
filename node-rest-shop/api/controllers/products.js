const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req,res,next) => {
    
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
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
}

exports.products_create_product = (req,res,next) => {
    //console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        //console.log(result);
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
};

exports.product_get_product = (req,res,next) => {

    const pId = req.params.productId;
    Product.findById(pId).select('name price _id productImage').exec().then(doc => {
        //console.log(doc);
        res.status(200).json({
            product : doc,
            request : {
                type: 'GET',
                url: 'http://localhost:4312/products'
            }
        });
    })
     .catch(err => {
         console.log(err);
         res.status(500).json(
             { 
                 error: err
            });
     });

    };

exports.product_update_product = (req,res,next) => {
    
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
            });
        });
    
    };

exports.product_delete_product = (req,res,next) => {
    
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

};
 




    