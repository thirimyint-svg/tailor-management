const router = require("express").Router();

router.use("/", require("./authRoutes"));
router.use("/dashboard", require("./dashboardRoutes"));
router.use("/inventory", require("./inventoryRoutes"));
router.use("/customers", require("./customerRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/vouchers", require("./voucherRoutes"));
router.use("/appointments", require("./appointmentRoutes"));
router.use("/reports", require("./reportRoutes"));

router.get("/", (req, res) => res.redirect("/dashboard"));
router.use("/user", require("./userRoutes"));
router.use("/dev", require("./devRoutes"));
module.exports = router;
