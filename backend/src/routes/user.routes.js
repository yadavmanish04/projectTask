const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  listUsers,
  getUser,
  updateProfile,
  adminUpdateUser,
  adminDeleteUser,
} = require('../controllers/user.controller');

router.use(protect);

router.get('/', listUsers);
router.patch('/me', updateProfile);

// Admin-only routes
router.get('/:id', requireRole('admin'), getUser);
router.patch('/:id', requireRole('admin'), adminUpdateUser);
router.delete('/:id', requireRole('admin'), adminDeleteUser);

module.exports = router;
