const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling POST requests to /products'
       
    });
});

router.get('/:productId', (req,res,next) => {
    const pId = req.params.productId;
    if(pId == 'special'){
        res.status(200).json({
            message: 'You discovered the special Id',
            pId: pId
        });
    }
    else{
        res.status(200).json({
            message: 'You passed an Id'
        })

    }

});

router.patch('/:productId', (req,res,next) => {
    
        res.status(200).json({
            message: 'Updated product!'
        })

});

router.delete('/:productId', (req,res,next) => {
    
        res.status(200).json({
            message: 'Deleted product!'
        })

});

module.exports = router;