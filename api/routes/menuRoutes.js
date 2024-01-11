const express = require('express')
const menuController = require('../controller/menuController.js')
const router = express.Router()

// get all menu item 
router.get('/', menuController.getAllMenuItems)

// post a new  menu item
router.post('/',menuController.postMenuItem) 

// delete a menu item 
router.delete('/:id',menuController.deleteMenuItem)

// get single menu item 
router.get('/:id', menuController.singleMenuItem);

// update single menu item 
router.patch('/:id', menuController.updateMenuItem)

module.exports = router