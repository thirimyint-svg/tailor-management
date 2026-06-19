const bcrypt = require("bcryptjs");
const { Admin } = require("../models");

exports.loginPage = (req, res) => {
  if (req.session.admin) {
    return res.redirect("/admin/dashboard");
  }

  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
  });

  return res.render("admin/login", {
    pageTitle: "Admin Login",
    pageSubTitle: "Login to your account",
  });
};

exports.login = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
      req.flash("error", "Email and password are required");
      return res.redirect("/admin/login");
    }

    const admin = await Admin.findOne({ where: { email } });

    if (!admin || !admin.passwordHash) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/admin/login");
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/admin/login");
    }

    req.session.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      isRoot: admin.isRoot,
      role: admin.isRoot ? "root" : "admin",
    };

    req.flash("success", "Login successful");
    return res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Admin login error:", err);
    req.flash("error", "Login failed");
    return res.redirect("/admin/login");
  }
};

exports.logout = (req, res) => {
  req.session.admin = null;
  req.session.destroy(() => {
    return res.redirect("/admin/login");
  });
};
