const router = require("express").Router();

//admin routes
router.use("/admin", require("./adminRoutes"))

//customer routes
router.get("/", (req, res) => res.render("customerView/main"));
router.use("/user", require("./userRoutes"));
router.use("/dev", require("./devRoutes"));
module.exports = router;
