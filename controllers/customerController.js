const { Customer } = require("../models");

// LIST PAGE
exports.list = async (req, res) => {
  try {
    const users = await Customer.findAll({
      order: [["id", "DESC"]],
    });

    res.render("users/list", {
      pageTitle: "Customers",
      pageSubTitle: "Manage customers",
      users,
      entityType: "customer"
    });
  } catch (err) {
    console.error("Customer list error:", err);

    res.render("users/list", {
      pageTitle: "Customers",
      pageSubTitle: "Manage customers",
      users: [],
      entityType: "customer"
    });
  }
};

// CREATE PAGE (GET)
exports.createPage = (req, res) => {
  res.render("users/create", {
    pageTitle: "Add Customer",
    pageSubTitle: "Create a new customer",
    entityType: "customer"
  });
};

// CREATE (POST)
exports.create = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone) {
      req.flash("error", "Name and Phone are required");
      return res.redirect("/customers/create");
    }

    await Customer.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email || null,
      address: address || null,
    });

    req.flash("success", "Customer created successfully");
    res.redirect("/customers");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create customer");
    res.redirect("/customers/create");
  }
};

// EDIT PAGE
exports.editPage = async (req, res) => {
  const user = await Customer.findByPk(req.params.id);

  if (!user) {
    req.flash("error", "Customer not found");
    return res.redirect("/customers");
  }

  res.render("users/edit", {
    pageTitle: "Edit Customer",
    pageSubTitle: "Update customer details",
    user,
    entityType: "customer"
  });
};

// UPDATE
exports.update = async (req, res) => {
  const user = await Customer.findByPk(req.params.id);

  if (!user) {
    req.flash("error", "Customer not found");
    return res.redirect("/customers");
  }

  const { name, phone, email, address } = req.body;

  await user.update({
    name,
    phone,
    email,
    address,
  });

  req.flash("success", "Customer updated");
  res.redirect("/customers");
};

// DELETE
exports.remove = async (req, res) => {
  const user = await Customer.findByPk(req.params.id);

  if (!user) {
    req.flash("error", "Customer not found");
    return res.redirect("/customers");
  }

  await user.destroy();
  req.flash("success", "Customer deleted");
  res.redirect("/customers");
};
