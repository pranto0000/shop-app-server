const express = require('express');
const mongoose = require('mongoose');
const Payment = require('../models/Payments.js');
const router = express.Router()
const Cart = require('../models/Cards.js')
const ObjectId = mongoose.Types.ObjectId;
// token 
const verifyToken = require('../middleware/verifyToken');

// post payment infoemation to database 
router.post ('/',verifyToken,async (req, res) => {
    const payment = req.body;
    try {
        const paymentRequest = await Payment.create(payment)

        // delete carts after payment
        const cartIds = payment.cartItems.map(id => new ObjectId(id));
        const deletedCardRequest = await Cart.deleteMany({_id: {$in: cartIds}})

        res.status(200).json({paymentRequest,deletedCardRequest});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})


router.get('/',verifyToken,async(req,res) => {
    const email = req.query.email;
    const query = {email: email}
    try {
        const decodedEmail = req.decoded.email;
        if (email !== decodedEmail) {
            res.status(403).json({message: "Forbidden Access"})
        }
        const result = await Payment.find(query).sort({createdAt:-1}).exec()
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

// get all payments 
router.get('/all',async(req,res) => {
    try {
        const payments = await Payment.find({}).sort({createdAt: -1}).exec();
        res.status(200).json(payments)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

// confirm payment status 
router.patch('/:id', async (req, res) => {
    const payId = req.params.id;
    const {status} = req.body;
    try {
        const updatedStatus = await Payment.findByIdAndUpdate(payId, {status:"confirmed"},
            {new:true,runValidators:true}
        );
        if (!updatedStatus) {
            return res.status(404).json({message:"Payment not found"})
        }
        response.status(200).json(updatedStatus)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})
module.exports = router