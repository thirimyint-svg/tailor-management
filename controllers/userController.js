const { Customer, Order, Appointment, Fabric, Accessory, DesignCategory, OrderItem } = require("../models");

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

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = await Customer.findByPk(req.session.user.id);

  if (!user.passwordHash) {
    req.flash("error", "Password change not available for this account");
    return res.redirect("/user/profile");
  }

  const bcrypt = require("bcryptjs");
  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    req.flash("error", "Current password is incorrect");
    return res.redirect("/user/profile");
  }

  if (newPassword !== confirmPassword) {
    req.flash("error", "New passwords do not match");
    return res.redirect("/user/profile");
  }

  if (newPassword.length < 6) {
    req.flash("error", "New password must be at least 6 characters");
    return res.redirect("/user/profile");
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await user.update({ passwordHash: newHash });

  req.flash("success", "Password changed successfully");
  res.redirect("/user/profile");
};

exports.orders = async (req, res) => {
  const orders = await Order.findAll({
    where: { CustomerId: req.session.user.id },
    include: [{ model: OrderItem }],
    order: [["createdAt", "DESC"]],
  });

  res.render("user/orders", {
    pageTitle: "Orders",
    pageSubTitle: "Your orders",
    orders,
  });
};

exports.orderDetail = async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, CustomerId: req.session.user.id },
    include: [{ model: OrderItem }],
  });

  if (!order) {
    req.flash("error", "Order not found");
    return res.redirect("/user/orders");
  }

  res.render("user/orderDetail", {
    pageTitle: "Order Details",
    pageSubTitle: `Order #${order.id}`,
    order,
  });
};

exports.cancelOrder = async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, CustomerId: req.session.user.id },
  });

  if (!order) {
    return res.json({ success: false, message: "Order not found" });
  }

  if (order.status !== "Pending") {
    return res.json({ success: false, message: "Only pending orders can be cancelled" });
  }

  await order.update({ status: "Cancelled" });
  res.json({ success: true, message: "Order cancelled successfully" });
};

exports.bookAppointment = async (req, res) => {
  const user = await Customer.findByPk(req.session.user.id);
  res.render("user/bookAppointment", {
    pageTitle: "Book Appointment",
    pageSubTitle: "Schedule a consultation",
    user,
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
