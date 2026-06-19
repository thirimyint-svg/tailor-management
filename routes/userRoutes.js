// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../controllers/userAuthController");
const userController = require("../controllers/userController");

// small middleware to require customer login
function requireCustomer(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
}

// login/logout
router.get("/login", auth.loginPage);
router.get("/verifyEmail", auth.verifyEmailPage);
router.post("/login", auth.login);
router.post("/register", auth.register);
router.post("/logout", auth.logout);
router.post("/resendVerifyEmail/:id", auth.resendVerificationEmail);
router.get("/verify/:token", auth.verifyEmail);

// customer dashboard
router.get("/dashboard", requireCustomer, (req, res) => {
  const customer = req.session.user;

  res.render("user/dashboard", {
    pageTitle: "Customer Dashboard",
    pageSubTitle: `Welcome, ${customer.name}`,
    customer,
  });
});

// profile routes
router.get("/profile", requireCustomer, userController.profile);
router.post("/profile", requireCustomer, userController.profileUpdate);
router.post("/change-password", requireCustomer, userController.changePassword);

// orders routes
router.get("/orders", requireCustomer, userController.orders);
router.get("/orders/:id", requireCustomer, userController.orderDetail);
router.post("/orders/:id/cancel", requireCustomer, userController.cancelOrder);

router.get("/book-appointment", requireCustomer, userController.bookAppointment);

module.exports = router;
