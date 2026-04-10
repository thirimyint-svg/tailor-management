const { Fabric } = require("../models");

exports.page = async (req, res) => {
  const q = (req.query.q || "").trim();

  const where = q
    ? {
        // simple search by code/title
        // sqlite LIKE
        // Sequelize Op imported? easiest: raw where
      }
    : undefined;

  // easiest search: filter in JS (small data)
  let fabrics = await Fabric.findAll({ order: [["createdAt", "DESC"]] });
  if (q) {
    const qq = q.toLowerCase();
    fabrics = fabrics.filter(f => (f.code || "").toLowerCase().includes(qq) || (f.title || "").toLowerCase().includes(qq));
  }

  res.render("fabrics/index", {
    pageTitle: "Fabrics",
    pageSubTitle: "Add and manage fabric swatches",
    fabrics,
    q,
  });
};

exports.create = async (req, res) => {
  try {
    const { title, code, color, stockQty, notes } = req.body;

    if (!title || !code) {
      req.flash("error", "Title and Code are required");
      return res.redirect("/inventory/fabrics");
    }

    const imageUrl = req.file
      ? "/uploads/fabrics/" + req.file.filename
      : null;

    await Fabric.create({
      title: title.trim(),
      code: code.trim().toUpperCase(),
      imageUrl,
      color,
      stockQty: Number(stockQty || 0),
      notes,
    });

    req.flash("success", "Fabric added");
    res.redirect("/inventory/fabrics");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to add fabric");
    res.redirect("/inventory/fabrics");
  }
};


exports.editPage = async (req, res) => {
  const fabric = await Fabric.findByPk(req.params.id);
  if (!fabric) {
    req.flash("error", "Fabric not found");
    return res.redirect("/inventory/fabrics");
  }

  res.render("fabrics/edit", {
    pageTitle: "Edit Fabric",
    pageSubTitle: "Update fabric details",
    fabric,
  });
};

exports.update = async (req, res) => {
  try {
    const fabric = await Fabric.findByPk(req.params.id);
    if (!fabric) {
      req.flash("error", "Fabric not found");
      return res.redirect("/inventory/fabrics");
    }

    const imageUrl = req.file
      ? "/uploads/fabrics/" + req.file.filename
      : fabric.imageUrl;

    await fabric.update({
      title: req.body.title,
      code: req.body.code.toUpperCase(),
      imageUrl,
      color: req.body.color,
      stockQty: Number(req.body.stockQty || 0),
      notes: req.body.notes,
    });

    req.flash("success", "Fabric updated");
    res.redirect("/inventory/fabrics");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update fabric");
    res.redirect("/inventory/fabrics");
  }
};

exports.remove = async (req, res) => {
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
    console.error(err);
    req.flash("error", "Failed to delete fabric");
    res.redirect("/inventory/fabrics");
  }
};
