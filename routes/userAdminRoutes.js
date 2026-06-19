const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireRoot } = require("../middlewares/userAuth");

router.use(requireRoot);

// List + Create form on same page
router.get("/", adminController.list);
router.post("/create", adminController.create);

// Edit page
router.get("/:id/edit", adminController.editPage);
router.post("/:id/update", adminController.update);

// Delete
router.post("/:id/delete", adminController.remove);

module.exports = router;
