const express = require('express');
const Carts = require('../models/Cards.js');
const router = express.Router();

const cartController = require('../controller/cartController')
const verifyToken = require('../middleware/verifyToken.js')

router.get('/',verifyToken,cartController.getCartByEmail)
router.post('/',cartController.addToCart)
router.delete('/:id', cartController.deleteCart)
router.put('/:id', cartController.updateCart)
router.get('/:id', cartController.getSingleCart)
module.exports = router 