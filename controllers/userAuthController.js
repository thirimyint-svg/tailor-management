// controllers/userAuthController.js
const bcrypt = require("bcryptjs");
const { Customer } = require("../models");

exports.loginPage = (req, res) => {
  res.render("user/login", {
    pageTitle: "Customer Login",
    pageSubTitle: "Login to your account",
  });
};

exports.login = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

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
    req.session.customer = {
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
  req.session.customer = null;
  req.session.destroy(() => {
    res.redirect("/user/login");
  });
};
