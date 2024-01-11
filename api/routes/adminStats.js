const express = require('express');
const router = express.Router();

// import model 
const User = require('../models/User')
const Menu = require('../models/Menu.js')
const Payment = require('../models/Payments.js')

// meddleware 
const verifyToken = require('../middleware/verifyToken.js')
const verifyAdmin = require('../middleware/verifyAdmin.js')

// get all orders, users, payments, menu Item length 
router.get('/', async (req, res) => {
    try {
        const users = await User.countDocuments()
        const menuItem = await Menu.countDocuments()
        const orders = await Payment.countDocuments()
        const result = await Payment.aggregate([{
            $group:{
                _id:null,
                totalRevenue:{
                    $sum: '$price',
                }
            }
        }])
        const revenue = result.length > 0 ? result[0].totalRevenue : 0;

        res.status(200).json({
            users,
            menuItem,
            orders,
            revenue
        })
    } catch (error) {
        res.status(500).send("Internal Server Error: " + error.message)
    }
})

module.exports = router
