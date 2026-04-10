// routes/orderRoutes.js
const router = require("express").Router();
const orderController = require("../controllers/orderController");

// Order list
router.get("/", orderController.list);

// Create order
router.get("/create", orderController.createPage);   // <== this MUST be above /:id
router.post("/create", orderController.create);

// View single order
router.get("/:id", orderController.view);

// Edit order (UI)
router.get("/:id/edit", orderController.editPage);

// Update order (form submit)
router.post("/:id/update", orderController.update);

// Delete order
router.post("/:id/delete", orderController.remove);

module.exports = router;
