const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');

router.get('/:id', cartController.getCartByUserId);
router.delete('/:id', cartController.deleteCart);
router.post('/:id', cartController.createCartItem);
router.put('/:id', cartController.updateCartItem);
router.delete('/:id/:item_id', cartController.deleteCartItem);

module.exports = router;
