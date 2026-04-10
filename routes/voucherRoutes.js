// routes/voucherRoutes.js
const router = require("express").Router();
const voucherController = require("../controllers/voucherController");
const uploadVoucher = require("../config/uploadVoucher"); // multer config for vouchers

// List + search
router.get("/", voucherController.list);

// Create
router.post(
  "/create",
  uploadVoucher.single("image"),
  voucherController.create
);

// Toggle active / inactive
router.post("/:id/toggle", voucherController.toggleActive);

// Delete
router.post("/:id/delete", voucherController.remove);

module.exports = router;
