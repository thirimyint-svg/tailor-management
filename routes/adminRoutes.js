const express = require("express");
const router = express.Router();

const auth = require("../controllers/adminAuthController");

const { requireAdmin, requireUser, requireGuestAdmin } = require("../middlewares/userAuth");

router.get("/login", requireGuestAdmin, auth.loginPage);
router.post("/login", requireGuestAdmin, auth.login);
router.post("/logout", auth.logout);

router.use(requireAdmin);

//admin navigation
router.use("/dashboard", require("./dashboardRoutes"));
router.use("/inventory", require("./inventoryRoutes"));
router.use("/customers", require("./customerRoutes"));
router.use("/admins", require("./userAdminRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/vouchers", require("./voucherRoutes"));
router.use("/appointments", require("./appointmentRoutes"));
router.use("/reports", require("./reportRoutes"));


// customer dashboard
router.get("/dashboard", requireUser, (req, res) => {
  const customer = req.session.user;

  res.render("/dashboard", {
    pageTitle: "Customer Dashboard",
    pageSubTitle: `Welcome, ${customer.name}`,
    customer,
  });
});

module.exports = router;