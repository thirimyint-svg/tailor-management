// controllers/inventoryController.js
const { Op } = require("sequelize");
const { Fabric, Accessory, DesignCategory } = require("../models");

// ---------- FABRICS ----------

exports.fabricsList = async (req, res) => {
  try {
    const q = req.query.q || "";

    const where = q
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${q}%` } },
            { code: { [Op.like]: `%${q}%` } },
          ],
        }
      : {};

    const fabrics = await Fabric.findAll({
      where,
      order: [["id", "DESC"]],
    });

    res.render("inventory/fabrics", {
      pageTitle: "Fabrics",
      pageSubTitle: "Add and manage fabric swatches",
      fabrics,
      q,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (err) {
    console.error("fabricsList error:", err);
    req.flash("error", "Failed to load fabrics: " + err.message);
    res.render("inventory/fabrics", {
      pageTitle: "Fabrics",
      pageSubTitle: "Add and manage fabric swatches",
      fabrics: [],
      q: "",
      success: req.flash("success"),
      error: req.flash("error"),
    });
  }
};

exports.fabricsCreate = async (req, res) => {
  try {
    const { title, code, color, stockQty, notes, imageUrl } = req.body;

    if (!title || !code) {
      req.flash("error", "Title and code are required");
      return res.redirect("/inventory/fabrics");
    }

    let finalImageUrl = imageUrl && imageUrl.trim() ? imageUrl.trim() : null;

    if (req.file) {
      // uploaded image takes priority
      finalImageUrl = "/uploads/fabrics/" + req.file.filename;
    }

    await Fabric.create({
      title: title.trim(),
      code: code.trim(),
      color: color ? color.trim() : null,
      stockQty: stockQty ? Number(stockQty) : 0,
      notes: notes ? notes.trim() : null,
      imageUrl: finalImageUrl,
    });

    req.flash("success", "Fabric added");
    res.redirect("/inventory/fabrics");
  } catch (err) {
    console.error("fabricsCreate error:", err);
    req.flash("error", "Failed to create fabric: " + err.message);
    res.redirect("/inventory/fabrics");
  }
};

exports.fabricsDelete = async (req, res) => {
  try {
    const fabric = await Fabric.findByPk(req.params.id);
    if (!fabric) {
      req.flash("error", "Fabric not found");
      return res.redirect("/inventory/fabrics");
    }

    await fabric.destroy();
    req.flash("success", "Fabric deleted");
    res.redirect("/inventory/fabrics");
  } catch (err) {
    console.error("fabricsDelete error:", err);
    req.flash("error", "Failed to delete fabric: " + err.message);
    res.redirect("/inventory/fabrics");
  }
};

// ---------- ACCESSORIES ----------

// ---------- ACCESSORIES LIST ----------
exports.accessoriesList = async (req, res) => {
  try {
    const q = req.query.q || "";

    const where = q
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { code: { [Op.like]: `%${q}%` } },
            // If you have "category" column, you can also search it:
            // { category: { [Op.like]: `%${q}%` } },
          ],
        }
      : {};

    const accessories = await Accessory.findAll({
      where,
      order: [["id", "DESC"]],
    });

    res.render("inventory/accessories", {
      pageTitle: "Accessories",
      pageSubTitle: "Add and manage accessories",
      accessories,
      q,                               // ✅ pass q to EJS
      success: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (err) {
    console.error("accessoriesList error:", err);
    req.flash("error", "Failed to load accessories");

    res.render("inventory/accessories", {
      pageTitle: "Accessories",
      pageSubTitle: "Add and manage accessories",
      accessories: [],
      q: req.query.q || "",            // ✅ still define q on error
      success: req.flash("success"),
      error: req.flash("error"),
    });
  }
};

exports.accessoriesCreate = async (req, res) => {
  try {
    const { name, code, stockQty, notes } = req.body;

    if (!name || !code) {
      req.flash("error", "Name and code are required");
      return res.redirect("/inventory/accessories");
    }

    await Accessory.create({
      name: name.trim(),
      code: code.trim(),
      stockQty: stockQty ? Number(stockQty) : 0,
      notes: notes ? notes.trim() : null,
    });

    req.flash("success", "Accessory added");
    res.redirect("/inventory/accessories");
  } catch (err) {
    console.error("accessoriesCreate error:", err);
    req.flash("error", "Failed to create accessory: " + err.message);
    res.redirect("/inventory/accessories");
  }
};

exports.accessoriesDelete = async (req, res) => {
  try {
    const acc = await Accessory.findByPk(req.params.id);
    if (!acc) {
      req.flash("error", "Accessory not found");
      return res.redirect("/inventory/accessories");
    }

    await acc.destroy();
    req.flash("success", "Accessory deleted");
    res.redirect("/inventory/accessories");
  } catch (err) {
    console.error("accessoriesDelete error:", err);
    req.flash("error", "Failed to delete accessory: " + err.message);
    res.redirect("/inventory/accessories");
  }
};

// ---------- DESIGN CATEGORIES WITH IMAGE ----------

exports.designCategoriesList = async (req, res) => {
  try {
    const q = req.query.q || "";

    const where = q
      ? {
          name: {
            [Op.like]: `%${q}%`,
          },
        }
      : {};

    const designs = await DesignCategory.findAll({
      where,
      order: [["id", "DESC"]],
    });

    res.render("inventory/designCategories", {
      pageTitle: "Designs",
      pageSubTitle: "Add and manage design categories",
      designs,
      q,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (err) {
    console.error("designCategoriesList error:", err);
    req.flash("error", "Failed to load designs: " + err.message);
    res.render("inventory/designCategories", {
      pageTitle: "Designs",
      pageSubTitle: "Add and manage design categories",
      designs: [],
      q: "",
      success: req.flash("success"),
      error: req.flash("error"),
    });
  }
};

exports.designCategoriesCreate = async (req, res) => {
  try {
    console.log("Create design - body:", req.body);
    console.log("Create design - file:", req.file);

    const { name, description, notes } = req.body;

    if (!name || !name.trim()) {
      req.flash("error", "Design name is required");
      return res.redirect("/inventory/design-categories");
    }

    let imagePath = null;
    if (req.file) {
      imagePath = "/uploads/designs/" + req.file.filename;
    }

    const payload = {
      name: name.trim(),
      description: description ? description.trim() : null,
      notes: notes ? notes.trim() : null,
      imagePath,
    };

    console.log("Create design - payload:", payload);

    const created = await DesignCategory.create(payload);
    console.log("Create design - created id:", created.id);

    req.flash("success", "Design created");
    res.redirect("/inventory/design-categories");
  } catch (err) {
    console.error("designCategoriesCreate error:", err);
    req.flash("error", "Failed to create design: " + err.message);
    res.redirect("/inventory/design-categories");
  }
};

exports.designCategoriesDelete = async (req, res) => {
  try {
    const design = await DesignCategory.findByPk(req.params.id);
    if (!design) {
      req.flash("error", "Design not found");
      return res.redirect("/inventory/design-categories");
    }

    await design.destroy();
    req.flash("success", "Design deleted");
    res.redirect("/inventory/design-categories");
  } catch (err) {
    console.error("designCategoriesDelete error:", err);
    req.flash("error", "Failed to delete design: " + err.message);
    res.redirect("/inventory/design-categories");
  }
};
