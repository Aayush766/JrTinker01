const router = require('express').Router();
const User = require('../models/User'); // Ensure this points to your main User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

console.log('auth.routes.js file loaded and ready.');

// POST /login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('--- Login Attempt ---');
  console.log('Received from frontend:');
  console.log('  Email:', email);
  console.log('  Password:', password);

  try {
    // 1. Find the user by email
    const userExist = await User.findOne({ email });
    if (!userExist) {
      console.log('User not found in database.');
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 2. Compare the password
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Generate a JWT token on success
    const token = jwt.sign(
      { id: userExist._id, email: userExist.email, role: userExist.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '12h' }
    );

    // 4. Set the token as an HTTP-only cookie
    res.cookie("jwt-intern-token", token, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000,
    });
    
    // 5. Send a success response
    console.log('Login successful! Sending cookie and user data to frontend.');
    res.status(200).json({ 
      success: true, 
      message: 'Login successful!', 
      user: {
        id: userExist._id,
        email: userExist.email,
        username: userExist.username,
        role: userExist.role
      }
    });

  } catch (err) {
    console.error('SERVER-SIDE ERROR during login:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// POST /logout route
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('jwt-intern-token', {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'strict',
    });
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while logging out' });
  }
});

router.post('/create-admin', async (req, res) => {
  try {
    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@jrtinker.com' });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin user already exists.' });
    }

    // Create a new user with the "admin" role
    const newAdmin = new User({
      username: 'Admin User',
      email: 'admin@jrtinker.com',
      password: 'jrt123', // The password will be hashed by the pre-save middleware
      role: 'admin',
    });

    await newAdmin.save();
    console.log('Admin user created successfully.');
    res.status(201).json({ message: 'Admin user created successfully!', user: newAdmin });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Server error creating admin user.' });
  }
});

module.exports = router;