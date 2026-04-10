// controllers/voucherController.js
const path = require("path");
const fs = require("fs");
const { Voucher, Customer } = require("../models");

// simple helper to match search text
function matches(voucher, q) {
  if (!q) return true;
  const text = q.toLowerCase();
  const fields = [
    voucher.code || "",
    voucher.title || "",
    voucher.notes || "",
    voucher.Customer ? voucher.Customer.name || "" : "",
  ];
  return fields.some(f => f.toLowerCase().includes(text));
}

// LIST + SEARCH
exports.list = async (req, res) => {
  const q = (req.query.q || "").trim();

  // load all customers for dropdown
  const customers = await Customer.findAll({
    order: [["name", "ASC"]],
  });

  // load ALL vouchers (with customer)
  const allVouchers = await Voucher.findAll({
    include: [{ model: Customer }],
    order: [["createdAt", "DESC"]],
  });

  // filter in JS by code/title/customer name
  const vouchers = allVouchers.filter(v => matches(v, q));

  res.render("vouchers/index", {
    pageTitle: "Vouchers",
    pageSubTitle: "Upload and manage vouchers",
    vouchers,
    customers,
    q,
  });
};

// CREATE
exports.create = async (req, res) => {
  try {
    const {
      title,
      code,
      discountType,
      discountValue,
      minOrderAmount,
      validFrom,
      validTo,
      notes,
      customerId,
    } = req.body;

    let imagePath = null;
    if (req.file) {
      imagePath = "/uploads/vouchers/" + req.file.filename;
    }

    await Voucher.create({
      title: title.trim(),
      code: code.trim(),
      discountType: discountType || "amount",
      discountValue: discountValue || 0,
      minOrderAmount: minOrderAmount || 0,
      validFrom: validFrom || null,
      validTo: validTo || null,
      notes: notes || null,
      imagePath,
      isActive: true,
      CustomerId: customerId || null,  // ✅ set customer
    });

    req.flash("success", "Voucher created");
    res.redirect("/vouchers");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create voucher");
    res.redirect("/vouchers");
  }
};

// TOGGLE ACTIVE / INACTIVE
exports.toggleActive = async (req, res) => {
  try {
    const voucher = await Voucher.findByPk(req.params.id);
    if (!voucher) {
      req.flash("error", "Voucher not found");
      return res.redirect("/vouchers");
    }

    voucher.isActive = !voucher.isActive;
    await voucher.save();

    req.flash(
      "success",
      `Voucher ${voucher.isActive ? "activated" : "deactivated"}`
    );
    res.redirect("/vouchers");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update voucher");
    res.redirect("/vouchers");
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const voucher = await Voucher.findByPk(req.params.id);
    if (!voucher) {
      req.flash("error", "Voucher not found");
      return res.redirect("/vouchers");
    }

    // delete image file if exists
    if (voucher.imagePath) {
      const filePath = path.join(__dirname, "..", "public", voucher.imagePath);
      fs.unlink(filePath, () => {});
    }

    await voucher.destroy();
    req.flash("success", "Voucher deleted");
    res.redirect("/vouchers");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete voucher");
    res.redirect("/vouchers");
  }
};
