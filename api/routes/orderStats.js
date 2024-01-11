const express = require('express');
const router = express.Router();

// import model 
const User = require('../models/User')
const Menu = require('../models/Menu.js')
const Payment = require('../models/Payments.js')

// meddleware 
const verifyToken = require('../middleware/verifyToken.js')
const verifyAdmin = require('../middleware/verifyAdmin.js')

// get all orders stats 
router.get('/',async (req, res) => {
    try {
        const result = await Payment.aggregate([
            {
                $unwind:'$menuItems'
            },
            {
                $lookup:{
                    from:'menus',
                    localField:'menuItems',
                    foreignField: "_id",
                    as: 'menuItemDetails',
                }
            },
            {
                $unwind:'$menuItemDetails'
            },
            {
                $group:{
                    _id: '$menuItemDetails.category',
                    quantity: {$sum:'$quantity'},
                    revenue: {$sum: '$price'}
                }
            },
            {
                $project:{
                    _id:0,
                    category:'$_id',
                    quantity: '$quantity',
                    revenue: '$revenue'
                }
            }
        ])
        res.json(result)
    } catch (error) {
        res.status(500).send("Internal Server Error: " + error.message)
    }
});

module.exports = router
