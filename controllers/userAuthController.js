// controllers/userAuthController.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Customer, sequelize } = require("../models");

exports.loginPage = (req, res) => {
  res.render("user/login", {
    pageTitle: "Customer Login",
    pageSubTitle: "Login to your account",
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
      return res.redirect('/user/login');
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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const verificationUrl = `${process.env.SITE_URL}/user/verify/${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify.</p>`,
    });
    
    await transaction.commit();

    req.flash('success', 'Registration successful! Check your email to verify.');
    res.redirect('/user/login');
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
      return res.redirect("/user/login");
    }

    const user = await Customer.findOne({ where: { email } });

    if (!user || !user.passwordHash) {
      req.flash("error", "Login failed");
      return res.redirect("/user/login");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      req.flash("error", "Login failed");
      return res.redirect("/user/login");
    }

    // 🔐 store customer session (separate from admin)
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    req.flash("success", "Login successful");
    return res.redirect("/user/dashboard");   // 👈 customer dashboard
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
      return res.redirect('/user/login');
    }

    customer.isVerified = true;
    customer.verificationToken = null;  // Clear token
    await customer.save();

    req.flash('success', 'Email verified! You can now log in.');
    res.redirect('/user/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Verification failed');
    res.redirect('/user/login');
  }
};
