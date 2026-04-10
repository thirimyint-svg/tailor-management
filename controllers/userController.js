const { Customer, Order, Appointment, Fabric, Accessory, DesignCategory } = require("../models");

exports.dashboard = async (req, res) => {
  const userId = req.session.user.id;

  const [ordersCount, apptCount] = await Promise.all([
    Order.count({ where: { CustomerId: userId } }),
    Appointment.count({ where: { CustomerId: userId } }),
  ]);

  res.render("user/dashboard", {
    pageTitle: "Dashboard",
    pageSubTitle: "Your tailor account",
    ordersCount,
    apptCount,
  });
};

exports.profile = async (req, res) => {
  const user = await Customer.findByPk(req.session.user.id);
  res.render("user/profile", {
    pageTitle: "Profile",
    pageSubTitle: "Manage your profile",
    user,
  });
};

exports.profileUpdate = async (req, res) => {
  const user = await Customer.findByPk(req.session.user.id);

  await user.update({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
  });

  req.session.user.name = user.name;
  req.flash("success", "Profile updated");
  res.redirect("/user/profile");
};

exports.orders = async (req, res) => {
  const orders = await Order.findAll({
    where: { CustomerId: req.session.user.id },
    order: [["createdAt", "DESC"]],
  });

  res.render("user/orders", {
    pageTitle: "Orders",
    pageSubTitle: "Your orders",
    orders,
  });
};

exports.appointments = async (req, res) => {
  const appointments = await Appointment.findAll({
    where: { CustomerId: req.session.user.id },
    order: [["appointmentAt", "DESC"]],
  });

  res.render("user/appointments", {
    pageTitle: "Appointments",
    pageSubTitle: "Your appointments",
    appointments,
  });
};

exports.stockFabrics = async (req, res) => {
  const fabrics = await Fabric.findAll({ order: [["id", "DESC"]] });
  res.render("user/stockFabrics", {
    pageTitle: "In Stock Fabrics",
    pageSubTitle: "Available fabrics",
    fabrics,
  });
};

exports.stockAccessories = async (req, res) => {
  const accessories = await Accessory.findAll({ order: [["id", "DESC"]] });
  res.render("user/stockAccessories", {
    pageTitle: "In Stock Accessories",
    pageSubTitle: "Available accessories",
    accessories,
  });
};

exports.stockDesigns = async (req, res) => {
  const designs = await DesignCategory.findAll({ order: [["id", "DESC"]] });
  res.render("user/stockDesigns", {
    pageTitle: "In Stock Designs",
    pageSubTitle: "Available designs",
    designs,
  });
};
