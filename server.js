const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mehta.riya604@gmail.com',
    pass: process.env.APP_PASSWORD,
  }
});

const users = {};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (users[email] && users[email].verified) {
    return res.json({ message: 'Email already verified' });
  }

  const otp = generateOTP();

  users[email] = { otp, verified: false };

  const verificationLink = `http://localhost:3000/verify-email?token=${otp}`;

  const mailOptions = {
    to: email,
    subject: 'Verify Your Email',
    from: 'oneesan148@gmail.com',
    text: `Your OTP is: ${otp}. Click on the following link to verify your email: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
    res.json({ message: 'OTP sent successfully' });
  });
};

const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (users[email] && users[email].otp === otp) {
    users[email].verified = true;
    return res.json({ message: 'Email verified successfully' });
  } else {
    return res.json({ message: 'Email verification Failed' });
  }
};

const verifyEmail = (req, res) => {
  const { token } = req.query;

  const emailToVerify = Object.keys(users).find(email => users[email].otp === token);

  if (emailToVerify) {
    users[emailToVerify].verified = true;
    return res.send('Email verified successfully!');
  } else {
    return res.json({ message: 'Email verification Failed' });
  }
};

app.post('/send-otp', sendOTP);
app.post('/verify-otp', verifyOTP);
app.get('/verify-email', verifyEmail);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
