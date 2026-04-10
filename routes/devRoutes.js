const router = require("express").Router();
const { Voucher, Customer } = require("../models");

// ...your existing dev routes (set-password etc.)

router.get("/seed-vouchers", async (req, res) => {
  try {
    const samples = [
      {
        title: "CNY Style Voucher",
        code: "CNY2026",
        discountType: "percent",
        discountValue: 10,
        minOrderAmount: 100,
        notes: "10% off for CNY tailoring",
      },
      {
        title: "Bridal Dress Discount",
        code: "BRIDE10",
        discountType: "amount",
        discountValue: 50,
        minOrderAmount: 200,
        notes: "$50 off bridal gowns",
      },
      {
        title: "Student Uniform Special",
        code: "STU2026",
        discountType: "amount",
        discountValue: 10,
        minOrderAmount: 50,
        notes: "$10 off student uniform orders",
      },
      {
        title: "Tailor Loyalty Reward",
        code: "LOYALTY2026",
        discountType: "percent",
        discountValue: 15,
        minOrderAmount: 0,
        notes: "15% off for returning customers",
      },
    ];

    await Voucher.bulkCreate(samples, { ignoreDuplicates: true });

    res.send("Seeded vouchers ✔");
  } catch (err) {
    console.error("Seed vouchers error:", err);
    res.status(500).send("Failed to seed vouchers");
  }
});

module.exports = router;
