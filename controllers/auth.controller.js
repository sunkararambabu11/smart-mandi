const User = require('../models/User');
const Otp = require('../models/Otp');
const { generateOtp } = require('../utils/otp.util');
const { generateToken } = require('../utils/token.util');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//signup API

exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      role
    } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password and confirm password do not match'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      isVerified: false
    });

    return res.status(201).json({
      message: 'User registered successfully',
      userId: user._id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error'
    });
  }
};

//login api

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    //  Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error'
    });
  }
};


exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber,role  } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
 if (!['FARMER', 'BUYER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role'
      });
    }

    const otp = generateOtp();
    await Otp.deleteMany({ phoneNumber });

    await Otp.create({
      phoneNumber,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 min
    });

    // DEV MODE: log OTP
    console.log(` DEV OTP for ${phoneNumber}: ${otp}`);

    res.json({
      message: 'OTP sent successfully (DEV MODE)',
       role,
      devOtp: otp // remove in production
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/auth/verify-otp
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    const otpRecord = await Otp.findOne({ phoneNumber, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    let user = await User.findOne({ phoneNumber });

    if (!user) {
      user = await User.create({ phoneNumber });
    }

    user.isVerified = true;
    await user.save();

    await Otp.deleteMany({ phoneNumber });

    const token = generateToken(user);

    res.json({
      message: 'OTP verified successfully',
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json({
      message: 'Profile fetched successfully',
      user
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error'
    });
  }
};


