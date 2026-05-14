const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/jwt');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already registered');

  // Role is always 'member' for self-registration; admin is seeded separately
  const user = await User.create({ name, email, password, role: 'member' });
  const token = signToken({ id: user._id, role: user.role });
  return ApiResponse(res, 201, 'Registered successfully', { user, token });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  const token = signToken({ id: user._id, role: user.role });
  user.password = undefined;
  return ApiResponse(res, 200, 'Login successful', { user, token });
});

exports.me = asyncHandler(async (req, res) => {
  return ApiResponse(res, 200, 'Current user', { user: req.user });
});
