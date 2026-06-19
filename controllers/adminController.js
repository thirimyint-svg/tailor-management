const { Admin } = require("../models");

// LIST PAGE
exports.list = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      order: [["id", "DESC"]],
    });

    return res.render("users/list", {
      pageTitle: "Admins",
      pageSubTitle: "Manage admins",
      users: admins,
      entityType: "admin",
    });
  } catch (err) {
    console.error("Admin list error:", err);

    return res.render("users/list", {
      pageTitle: "Admins",
      pageSubTitle: "Manage admins",
      users: [],
      entityType: "admin",
    });
  }
};

// CREATE PAGE (GET)
exports.createPage = (req, res) => {
  return res.render("users/create", {
    pageTitle: "Add Admin",
    pageSubTitle: "Create a new admin",
    entityType: "admin",
  });
};

// CREATE (POST)
exports.create = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone) {
      req.flash("error", "Name and Phone are required");
      return res.redirect("/admins/create");
    }

    await Admin.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      address: address ? address.trim() : null,
    });

    req.flash("success", "Admin created successfully");
    return res.redirect("/admins");
  } catch (err) {
    console.error("Admin create error:", err);
    req.flash("error", "Failed to create admin");
    return res.redirect("/admins/create");
  }
};

// EDIT PAGE
exports.editPage = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);

    if (!admin) {
      req.flash("error", "Admin not found");
      return res.redirect("/admins");
    }

    return res.render("users/edit", {
      pageTitle: "Edit Admin",
      pageSubTitle: "Update admin details",
      customer: admin,
      entityType: "admin",
    });
  } catch (err) {
    console.error("Admin edit page error:", err);
    req.flash("error", "Failed to load admin");
    return res.redirect("/admins");
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);

    if (!admin) {
      req.flash("error", "Admin not found");
      return res.redirect("/admins");
    }

    const { name, phone, email, address } = req.body;

    await admin.update({
      name: name ? name.trim() : admin.name,
      phone: phone ? phone.trim() : admin.phone,
      email: email ? email.trim() : null,
      address: address ? address.trim() : null,
    });

    req.flash("success", "Admin updated");
    return res.redirect("/admins");
  } catch (err) {
    console.error("Admin update error:", err);
    req.flash("error", "Failed to update admin");
    return res.redirect("/admins");
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);

    if (!admin) {
      req.flash("error", "Admin not found");
      return res.redirect("/admins");
    }

    if (admin.id === req.session.admin?.id) {
      req.flash("error", "You cannot delete your own account");
      return res.redirect("/admins");
    }

    if (admin.isRoot) {
      req.flash("error", "Cannot delete the primary admin account");
      return res.redirect("/admins");
    }

    await admin.destroy();
    req.flash("success", "Admin deleted");
    return res.redirect("/admins");
  } catch (err) {
    console.error("Admin delete error:", err);
    req.flash("error", "Failed to delete admin");
    return res.redirect("/admins");
  }
};
