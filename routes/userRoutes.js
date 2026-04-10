// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../controllers/userAuthController");

// small middleware to require customer login
function requireCustomer(req, res, next) {
  if (!req.session.customer) {
    return res.redirect("/user/login");
  }
  next();
}

console.log("Loaded userAuthController ✅", {
  loginPage: typeof auth.loginPage,
  login: typeof auth.login,
});

// login/logout
router.get("/login", auth.loginPage);
router.post("/login", auth.login);
router.post("/logout", auth.logout);

// customer dashboard
router.get("/dashboard", requireCustomer, (req, res) => {
  const customer = req.session.customer;

  res.render("user/dashboard", {
    pageTitle: "Customer Dashboard",
    pageSubTitle: `Welcome, ${customer.name}`,
    customer,
  });
});

module.exports = router;
