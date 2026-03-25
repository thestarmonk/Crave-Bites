const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, addAddress, deleteAddress } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/address', protect, addAddress);
router.put('/address/:id', protect, require('../controllers/authController').updateAddress);
router.delete('/address/:id', protect, deleteAddress);

// Admin Routes
const { getUsers, deleteUser, updateUserRole } = require('../controllers/authController');
router.get('/admin/users', protect, admin, getUsers);
router.delete('/admin/users/:id', protect, admin, deleteUser);
router.put('/admin/users/:id/role', protect, admin, updateUserRole);

module.exports = router;
