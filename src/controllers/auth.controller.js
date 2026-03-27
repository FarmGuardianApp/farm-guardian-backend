const authService = require('../services/auth.service');

// Controller for the registration/OTP generation step
async function register(req, res) {
  const { name, phoneNumber } = req.body;
  if (!name || !phoneNumber) {
    return res.status(400).json({ error: 'Name and phone number are required.' });
  }

  try {
    const result = await authService.registerOrLogin(name, phoneNumber);
    // In a real app, you would NOT send the OTP in the response.
    // It would be sent via an SMS service. For testing, this is okay.
    res.status(200).json({ message: 'OTP generated successfully.', otp: result.otp });
  } catch (error) {
    console.error('Error in registration controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

// Controller for the OTP verification step
async function verifyOtp(req, res) {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required.' });
  }

  try {
    const result = await authService.verifyOtp(phoneNumber, otp);
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    // On successful verification, send back the secure token
    res.status(200).json({ message: 'User verified successfully.', token: result.token });
  } catch (error) {
    console.error('Error in OTP verification controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

module.exports = {
  register,
  verifyOtp,
};
