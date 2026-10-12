
require("dotenv").config();

const db = require("../models");

async function checkCounts() {
  try {
    await db.sequelize.authenticate();

    const models = [
      db.Customer,
      db.Order,
      db.OrderItem,
      db.Fabric,
      db.Accessory,
      db.Appointment,
      db.Voucher,
      db.DesignCategory,
    ];

    for (const model of models) {
      const count = await model.count();

      console.log(
        `${model.getTableName()}: ${count}`
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    await db.sequelize.close();
  }
}

checkCounts();
