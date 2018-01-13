const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require("../controllers/products");

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null,'./uploads/');
    },
    filename: function(req, file, callback){
        callback(null, new Date().toISOString() +file.originalname);
    }
});

const fileFilter = function(req, file, callback){
 
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null, true); // will store the file
    }
    else{
           //Reject a file
         callback(null, false);
    }
};

const upload = multer({ 
        storage: storage,
        limits: {
            fileSize : 1024 * 1024 * 5  // Can accept files only upto 5mb
        },
        fileFilter: fileFilter
    });

const Product = require('../models/product');

router.get('/', checkAuth, ProductsController.products_get_all);

// upload.single uploads only one file

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.product_get_product);

router.patch('/:productId', checkAuth, ProductsController.product_update_product);

router.delete('/:productId', checkAuth, ProductsController.product_delete_product);

module.exports = router;