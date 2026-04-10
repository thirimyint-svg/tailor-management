const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// List + Create form on same page
router.get("/", customerController.list);
router.post("/create", customerController.create);

// Edit page
router.get("/:id/edit", customerController.editPage);
router.post("/:id/update", customerController.update);

// Delete
router.post("/:id/delete", customerController.remove);

module.exports = router;
