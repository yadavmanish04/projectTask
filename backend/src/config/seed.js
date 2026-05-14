const bcrypt = require('bcryptjs');
const User = require('../models/User');

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'Admin';

const seedAdmin = async () => {
  const existing = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

  if (existing) {
    // Ensure role is admin and password is correct (fixes stale/corrupt seeds)
    const passwordOk = await bcrypt.compare(ADMIN_PASSWORD, existing.password || '');
    if (existing.role !== 'admin' || !passwordOk) {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await User.updateOne(
        { email: ADMIN_EMAIL },
        { role: 'admin', name: ADMIN_NAME, password: hashed }
      );
      console.log('✅ Admin account repaired');
    }
    return;
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD, // pre-save hook hashes it
    role: 'admin',
  });
  console.log('✅ Admin user seeded');
};

module.exports = seedAdmin;
