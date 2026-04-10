const { Customer, Order, Appointment } = require("../models");

exports.index = async (req, res) => {
  try {
    const [
      customerCount,
      orderCount,
      appointmentCount,
    ] = await Promise.all([
      Customer.count().catch(() => 0),
      Order.count().catch(() => 0),
      Appointment ? Appointment.count().catch(() => 0) : 0,
    ]);

    res.render("dashboard/index", {
      pageTitle: "Dashboard",
      pageSubTitle: "Overview",
      customerCount,
      orderCount,
      appointmentCount,
    });
  } catch (err) {
    console.error("Dashboard error:", err);

    res.render("dashboard/index", {
      pageTitle: "Dashboard",
      pageSubTitle: "Overview",
      customerCount: 0,
      orderCount: 0,
      appointmentCount: 0,
    });
  }
};
