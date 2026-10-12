
require("dotenv").config();

const db = require("../models");

async function createFabricTable() {
  try {
    await db.sequelize.authenticate();

    const Fabric = db.Fabric;

    if (!Fabric || !db.sequelize.models.Fabric) {
      throw new Error("Fabric model is not initialized.");
    }

    const queryInterface =
      db.sequelize.getQueryInterface();

    const tables = await queryInterface.showAllTables();

    if (tables.includes("fabrics")) {
      console.log("Fabric table already exists.");
      return;
    }

    // Creates the Fabric table only.
    // Does not alter or drop existing tables.
    await Fabric.sync();

    console.log("Fabric table created successfully!");

  } catch (error) {
    console.error("Error:", error);
    process.exitCode = 1;
  } finally {
    await db.sequelize.close();
  }
}

createFabricTable();
