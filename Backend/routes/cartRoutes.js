const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const sessionAuth = require('../middleware/sessionAuth');

// All routes require user to be authenticated
router.use(sessionAuth);

router.get('/', cartController.getCart); // Get user's cart
router.post('/add', cartController.addToCart); // Add item to cart
router.put('/update', cartController.updateCartItem); // Update item quantity
router.delete('/remove', cartController.removeCartItem); // Remove item from cart

module.exports = router;
