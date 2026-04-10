// routes/inventoryRoutes.js
const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");
const uploadFabric = require("../config/uploadFabric");
const uploadDesign = require("../config/uploadDesign");

// ---------- FABRICS ----------
router.get("/fabrics", inventoryController.fabricsList);

router.post(
  "/fabrics/create",
  uploadFabric.single("image"),
  inventoryController.fabricsCreate
);

router.post(
  "/fabrics/:id/delete",
  inventoryController.fabricsDelete
);

// ---------- ACCESSORIES ----------
router.get("/accessories", inventoryController.accessoriesList);

router.post(
  "/accessories/create",
  inventoryController.accessoriesCreate
);

router.post(
  "/accessories/:id/delete",
  inventoryController.accessoriesDelete
);

// ---------- DESIGN CATEGORIES ----------
router.get(
  "/design-categories",
  inventoryController.designCategoriesList
);

router.post(
  "/design-categories/create",
  uploadDesign.single("image"),
  inventoryController.designCategoriesCreate
);

router.post(
  "/design-categories/:id/delete",
  inventoryController.designCategoriesDelete
);

module.exports = router;
