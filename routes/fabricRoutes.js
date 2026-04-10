const express = require("express");
const router = express.Router();
const fabricController = require("../controllers/fabricController");
const uploadFabric = require("../config/uploadFabric");

router.get("/", fabricController.page);

// ⬇️ add multer middleware here
router.post(
  "/create",
  uploadFabric.single("image"),
  fabricController.create
);

router.get("/:id/edit", fabricController.editPage);

router.post(
  "/:id/update",
  uploadFabric.single("image"),
  fabricController.update
);

router.post("/:id/delete", fabricController.remove);

module.exports = router;
