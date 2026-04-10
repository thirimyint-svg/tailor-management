// routes/reportRoutes.js
const router = require("express").Router();
const reportController = require("../controllers/reportController");

// Sale report
router.get("/sales", reportController.salesReport);

// Stock report
router.get("/stock", reportController.stockReport);

module.exports = router;
