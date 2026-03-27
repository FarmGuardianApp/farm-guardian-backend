const db = require('../config/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- IMPORTANT ---
// In a real production app, this secret key should be a long, random string
// and stored securely as an environment variable, not in the code.
const JWT_SECRET = 'your-super-secret-key-for-jwt';

// Service to handle the first step of registration/login
async function registerOrLogin(name, phoneNumber) {
  // 1. Generate a simple 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // 2. Hash the OTP for secure storage
  const hashedOtp = await bcrypt.hash(otp, 10); // 10 is the salt rounds

  // 3. Set an expiration time for the OTP (e.g., 10 minutes from now)
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // 4. Check if a user with this phone number already exists
  const userCheckSql = 'SELECT * FROM users WHERE phone_number = $1';
  const existingUser = await db.query(userCheckSql, [phoneNumber]);

  if (existingUser.rows.length > 0) {
    // If user exists, just update their OTP
    const updateOtpSql = 'UPDATE users SET otp = $1, otp_expires_at = $2 WHERE phone_number = $3';
    await db.query(updateOtpSql, [hashedOtp, otpExpiresAt, phoneNumber]);
  } else {
    // If user is new, create a new record
    const insertUserSql = 'INSERT INTO users (name, phone_number, otp, otp_expires_at) VALUES ($1, $2, $3, $4)';
    await db.query(insertUserSql, [name, phoneNumber, hashedOtp, otpExpiresAt]);
  }

  // 5. Return the plain text OTP so we can send it to the user (for testing)
  return { otp };
}


// Service to handle the second step: OTP verification
async function verifyOtp(phoneNumber, otp) {
  // 1. Find the user by their phone number
  const findUserSql = 'SELECT * FROM users WHERE phone_number = $1';
  const result = await db.query(findUserSql, [phoneNumber]);
  const user = result.rows[0];

  if (!user) {
    return { success: false, message: 'User not found.' };
  }

  // 2. Check if the OTP has expired
  if (new Date() > new Date(user.otp_expires_at)) {
    return { success: false, message: 'OTP has expired.' };
  }

  // 3. Compare the provided OTP with the hashed OTP from the database
  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch) {
    return { success: false, message: 'Invalid OTP.' };
  }

  // 4. OTP is correct! Clear the OTP from the database for security.
  const clearOtpSql = 'UPDATE users SET otp = NULL, otp_expires_at = NULL WHERE phone_number = $1';
  await db.query(clearOtpSql, [phoneNumber]);

  // 5. Generate a JSON Web Token (JWT) for the user.
  // This token will be used to authenticate future requests from the mobile app.
  const token = jwt.sign({ id: user.id, phoneNumber: user.phone_number }, JWT_SECRET, { expiresIn: '30d' });

  return { success: true, token };
}


module.exports = {
  registerOrLogin,
  verifyOtp,
};
