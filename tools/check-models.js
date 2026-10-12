
require("dotenv").config();

const db = require("../models");

async function checkModels() {
  try {
    console.log("Registered Sequelize models:");

    for (const [name, model] of Object.entries(
      db.sequelize.models
    )) {
      console.log(
        `${name} -> ${model.getTableName()}`
      );
    }

    const queryInterface =
      db.sequelize.getQueryInterface();

    const tables = await queryInterface.showAllTables();

    console.log("\nPostgreSQL tables:");
    console.log(tables);

    console.log(
      "\nFabric model registered:",
      Boolean(db.sequelize.models.Fabric)
    );

    console.log(
      "Fabric table exists:",
      tables.includes("fabrics")
    );
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    await db.sequelize.close();
  }
}

checkModels();
