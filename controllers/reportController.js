// controllers/reportController.js
const { Op } = require("sequelize");
const { sequelize, Order, Customer, Fabric, Accessory } = require("../models");

// Helper: parse yyyy-mm-dd from query
function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/* ------------------------------------------------------------------
   SALES REPORT  (uses createdAt so ALL orders are counted)
   ------------------------------------------------------------------ */
exports.salesReport = async (req, res) => {
  try {
    let { from, to } = req.query;

    // default to last 30 days
    const today = new Date();
    const defaultFrom = new Date();
    defaultFrom.setDate(today.getDate() - 30);

    const fromDate = parseDate(from) || defaultFrom;
    const toDate = parseDate(to) || today;

    // end of "to" day
    const toDateEnd = new Date(toDate);
    toDateEnd.setHours(23, 59, 59, 999);

    // ✅ IMPORTANT: use createdAt (NOT orderDate)
    const where = {
      createdAt: {
        [Op.between]: [fromDate, toDateEnd],
      },
    };

    // Totals
    const totalOrders = await Order.count({ where });
    const totalRevenue = (await Order.sum("totalAmount", { where })) || 0;

    // Daily breakdown (group by createdAt date)
    const dailyRows = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn("date", sequelize.col("createdAt")), "date"],
        [sequelize.fn("sum", sequelize.col("totalAmount")), "totalAmount"],
        [sequelize.fn("count", sequelize.col("id")), "orderCount"],
      ],
      group: [sequelize.fn("date", sequelize.col("createdAt"))],
      order: [[sequelize.fn("date", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    // Top customers by revenue
    const ordersWithCustomers = await Order.findAll({
      where,
      include: [{ model: Customer }],
    });

    const perCustomer = {};
    ordersWithCustomers.forEach((o) => {
      if (!o.Customer) return;

      const id = o.Customer.id;
      if (!perCustomer[id]) {
        perCustomer[id] = {
          id,
          name: o.Customer.name,
          phone: o.Customer.phone,
          totalAmount: 0,
          orderCount: 0,
        };
      }

      perCustomer[id].totalAmount += Number(o.totalAmount || 0);
      perCustomer[id].orderCount += 1;
    });

    const topCustomers = Object.values(perCustomer)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);

    res.render("reports/sales", {
      pageTitle: "Sale Report",
      pageSubTitle: "Overview of orders and revenue",
      from: fromDate.toISOString().slice(0, 10),
      to: toDate.toISOString().slice(0, 10),
      totalOrders,
      totalRevenue,
      dailyRows,
      topCustomers,
    });
  } catch (err) {
    console.error("Sales report error:", err);
    req.flash("error", "Failed to load sales report");
    res.render("reports/sales", {
      pageTitle: "Sale Report",
      pageSubTitle: "Overview of orders and revenue",
      from: "",
      to: "",
      totalOrders: 0,
      totalRevenue: 0,
      dailyRows: [],
      topCustomers: [],
    });
  }
};

/* ------------------------------------------------------------------
   STOCK REPORT
   ------------------------------------------------------------------ */
exports.stockReport = async (req, res) => {
  try {
    const fabrics = await Fabric.findAll({
      order: [["title", "ASC"]],
    });

    const accessories = await Accessory.findAll({
      order: [["name", "ASC"]],
    });

    const totalFabricItems = fabrics.length;
    const totalAccessoryItems = accessories.length;

    const totalFabricQty = fabrics.reduce(
      (sum, f) => sum + Number(f.stockQty || 0),
      0
    );
    const totalAccessoryQty = accessories.reduce(
      (sum, a) => sum + Number(a.stockQty || 0),
      0
    );

    res.render("reports/stock", {
      pageTitle: "Stock Report",
      pageSubTitle: "Overview of fabric and accessory stock",
      fabrics,
      accessories,
      totalFabricItems,
      totalAccessoryItems,
      totalFabricQty,
      totalAccessoryQty,
    });
  } catch (err) {
    console.error("Stock report error:", err);
    req.flash("error", "Failed to load stock report");
    res.render("reports/stock", {
      pageTitle: "Stock Report",
      pageSubTitle: "Overview of fabric and accessory stock",
      fabrics: [],
      accessories: [],
      totalFabricItems: 0,
      totalAccessoryItems: 0,
      totalFabricQty: 0,
      totalAccessoryQty: 0,
    });
  }
};
