const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/users?search=  — admin gets everyone, members get a picker list
exports.listUsers = asyncHandler(async (req, res) => {
  const { search = '' } = req.query;
  const filter = search
    ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
    : {};
  const users = await User.find(filter).select('name email role avatar createdAt').sort('-createdAt').limit(200);
  return ApiResponse(res, 200, 'Users', { users });
});

// GET /api/users/:id  — admin only
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  return ApiResponse(res, 200, 'User', { user });
});

// PATCH /api/users/me  — update own profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const updates = {};
  ['name', 'avatar'].forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  return ApiResponse(res, 200, 'Profile updated', { user });
});

// PATCH /api/users/:id  — admin can update name / role of any user
exports.adminUpdateUser = asyncHandler(async (req, res) => {
  const ADMIN_EMAIL = 'admin@gmail.com';
  const target = await User.findById(req.params.id);
  if (!target) throw new ApiError(404, 'User not found');
  if (target.email === ADMIN_EMAIL) throw new ApiError(403, 'Cannot modify the root admin account');

  const updates = {};
  ['name', 'role', 'avatar'].forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  return ApiResponse(res, 200, 'User updated', { user });
});

// DELETE /api/users/:id  — admin only
exports.adminDeleteUser = asyncHandler(async (req, res) => {
  const ADMIN_EMAIL = 'admin@gmail.com';
  const target = await User.findById(req.params.id);
  if (!target) throw new ApiError(404, 'User not found');
  if (target.email === ADMIN_EMAIL) throw new ApiError(403, 'Cannot delete the root admin account');
  await target.deleteOne();
  return ApiResponse(res, 200, 'User deleted');
});
