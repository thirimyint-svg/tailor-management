// controllers/orderController.js
const { Order, Customer } = require("../models");

/* ========== LIST ========== */
exports.list = async (req, res) => {
  try {
    const orders = await Order.findAll({
       include: [{ model: Customer }],
       order: [['createdAt', 'DESC']]
    });

    res.render("orders/list", {
      pageTitle: "Orders",
      pageSubTitle: "View and manage all customer orders",
      orders,
    });
  } catch (err) {
    console.error("Order list error:", err);
    req.flash("error", "Failed to load orders");
    res.redirect("/dashboard");
  }
};

/* ========== CREATE PAGE ========== */
exports.createPage = async (req, res) => {
  try {
    const customers = await Customer.findAll({ order: [["name", "ASC"]] });

    res.render("orders/create", {
      pageTitle: "Create Order",
      pageSubTitle: "Customer Order",
      customers,
    });
  } catch (err) {
    console.error("Order createPage error:", err);
    req.flash("error", "Failed to open create order page");
    res.redirect("/orders");
  }
};

/* ========== CREATE SUBMIT ========== */
exports.create = async (req, res) => {
  try {
    const {
      customerId,
      orderDate,
      garmentType,
      purpose,
      buttonDesign,
      measure1,
      measure2,
      measure3,
      lengthType,
      lengthCustom,
      lengthNotes,
      notes,
    } = req.body;

    if (!customerId) {
      req.flash("error", "Please select customer");
      return res.redirect("/orders/create");
    }

    const order = await Order.create({
      orderDate: orderDate ? new Date(orderDate) : new Date(),
      status: "Pending",
      totalAmount: 0,
      garmentType,
      purpose,
      buttonDesign,
      measure1,
      measure2,
      measure3,
      lengthType,
      lengthCustom,
      lengthNotes,
      notes,
      CustomerId: customerId,
    });

    req.flash("success", "Order created");
    return res.redirect(`/orders/${order.id}`); // go to detail page
  } catch (err) {
    console.error("Order create error:", err);
    req.flash("error", "Failed to create order");
    return res.redirect("/orders/create");
  }
};

/* ========== VIEW DETAIL ========== */
exports.view = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [Customer],
    });

    if (!order) {
      req.flash("error", "Order not found");
      return res.redirect("/orders");
    }

    res.render("orders/view", {
      pageTitle: `Order #${order.id}`,
      pageSubTitle: "View order information",
      order,
    });
  } catch (err) {
    console.error("Order view error:", err);
    req.flash("error", "Failed to load order");
    return res.redirect("/orders");
  }
};

/* ========== EDIT PAGE ========== */
exports.editPage = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [Customer],
    });

    if (!order) {
      req.flash("error", "Order not found");
      return res.redirect("/orders");
    }

    const customers = await Customer.findAll({ order: [["name", "ASC"]] });

    res.render("orders/edit", {
      pageTitle: `Edit Order #${order.id}`,
      pageSubTitle: "Update customer order",
      order,
      customers,
    });
  } catch (err) {
    console.error("Order editPage error:", err);
    req.flash("error", "Failed to open edit page");
    return res.redirect("/orders");
  }
};

/* ========== UPDATE SUBMIT ========== */
exports.update = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      req.flash("error", "Order not found");
      return res.redirect("/orders");
    }

    const {
      customerId,
      orderDate,
      status,
      garmentType,
      purpose,
      buttonDesign,
      measure1,
      measure2,
      measure3,
      lengthType,
      lengthCustom,
      lengthNotes,
      notes,
    } = req.body;

    await order.update({
      CustomerId: customerId || order.CustomerId,
      orderDate: orderDate ? new Date(orderDate) : order.orderDate,
      status: status || order.status,
      garmentType,
      purpose,
      buttonDesign,
      measure1,
      measure2,
      measure3,
      lengthType,
      lengthCustom,
      lengthNotes,
      notes,
    });

    req.flash("success", "Order updated");
    return res.redirect(`/orders/${order.id}`);
  } catch (err) {
    console.error("Order update error:", err);
    req.flash("error", "Failed to update order");
    return res.redirect(`/orders/${req.params.id}/edit`);
  }
};

/* ========== DELETE ========== */
exports.remove = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      req.flash("error", "Order not found");
      return res.redirect("/orders");
    }

    await order.destroy();
    req.flash("success", "Order deleted");
    return res.redirect("/orders");
  } catch (err) {
    console.error("Order remove error:", err);
    req.flash("error", "Failed to delete order");
    return res.redirect("/orders");
  }
};
