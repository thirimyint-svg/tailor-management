// controllers/userAuthController.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Customer, sequelize } = require("../models");

exports.loginPage = (req, res) => {
  res.render("admin/login", {
    pageTitle: "Admin Login",
    pageSubTitle: "Login to your account",
  });
};

exports.verifyEmailPage = (req, res) => {
  const userId = req.session.pendingUserId;
  res.render("auth/verifyEmail", {
    pageTitle: "Verify Email",
    pageSubTitle: "Please verify your email address",
    userId,
  });
};

exports.register = async (req, res) => {

  const transaction = await sequelize.transaction();
  try {

    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";
    const customerName = (req.body.customerName || "").trim();
    const phone = (req.body.phone || "").trim();

    let customer = await Customer.findOne({ where: {email}, transaction });

    if (customer) {
      await transaction.rollback();
      req.flash('error', 'Email already registered');
      return res.redirect('/');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
      customer = await Customer.create({
        name: customerName.trim(),
        passwordHash: passwordHash,
        isVerified: false,
        verificationToken: verificationToken,
        phone,
        email
      }, { transaction });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);
    
    await transaction.commit();

    req.flash('success', 'Registration successful! Check your email to verify.');
    res.redirect('/user/verifyEmail');
  } catch (err) {
    console.error("Customer login error:", err);
    req.flash("error", "Login failed");
    return res.redirect("/user/login");
  }
};

exports.login = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
      req.flash("error", "Email and password are required");
      return res.redirect("/");
    }

    const user = await Customer.findOne({ where: { email } });

    if (!user || !user.passwordHash) {
      req.flash("error", "Login failed");
      return res.redirect("/");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      req.flash("error", "Login failed");
      return res.redirect("/");
    }
    
    if(user.isVerified === false) {
      req.session.pendingUserId = user.id; // Store pending user ID in session
      req.flash("error", "Please verify your email before logging in");
      return res.redirect("/user/verifyEmail");
    }

    // 🔐 store customer session (separate from admin)
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    req.flash("success", "Login successful");
    return res.redirect("/");   // 👈 customer dashboard
  } catch (err) {
    console.error("Customer login error:", err);
    req.flash("error", "Login failed");
    return res.redirect("/user/login");
  }
};

exports.logout = (req, res) => {
  req.session.user = null;
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const customer = await Customer.findOne({ where: { verificationToken: token } });
    if (!customer) {
      req.flash('error', 'Invalid token');
      return res.redirect('/');
    }

    customer.isVerified = true;
    customer.verificationToken = null;  // Clear token
    await customer.save();
    req.session.pendingUserId = null; // Clear pending user session

    req.flash('success', 'Email verified! You can now log in.');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Verification failed');
    res.redirect('/');
  }
};

// filepath: c:\Users\ggd\Documents\Personal Drive\Web Development\Web Applications\tailor-management\controllers\userAuthController.js
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const verificationUrl = `${process.env.SITE_URL}/user/verify/${verificationToken}`;
    await transporter.sendMail({
      from: `"Milano Tailor" <${process.env.EMAIL_USER}>`,  // Add a friendly name
      to: email,
      subject: 'Verify Your Email Address - Milano Tailor',  // More descriptive
      html: `
        <p>Hello,</p>
        <p>Thank you for registering with Milano Tailor. Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify Email</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>Milano Tailor Team</p>
      `,  // Add more text and a signature
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      req.flash('error', 'Customer not found');
      return res.redirect('/');
    }

    if (customer.isVerified) {
      req.flash('error', 'Email already verified');
      return res.redirect('/');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    customer.verificationToken = verificationToken;
    await customer.save();

    // Send verification email (using the same logic as register)
    await sendVerificationEmail(customer.email, verificationToken);
    console.log('Verification email resent to:', customer.email);

    req.flash('success', 'Verification email resent! Check your inbox.');
    res.redirect('/user/verifyEmail');
  } catch (err) {
    console.error('Resend verification error:', err);
    req.flash('error', 'Failed to resend verification email');
    res.redirect('/user/verifyEmail');
  }
};


