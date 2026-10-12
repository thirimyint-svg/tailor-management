
require("dotenv").config();

const { sequelize } = require("../models");

async function createTables() {
  try {
    // Verify PostgreSQL connection
    await sequelize.authenticate();

    console.log("Connected to Supabase PostgreSQL!");

    // Safety check: do not proceed if tables already exist
    const [existingTables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `);

    if (existingTables.length > 0) {
      console.error(
        "PostgreSQL already contains tables. " +
        "Schema creation stopped to protect existing data."
      );
      process.exitCode = 1;
      return;
    }

    // Create tables from Sequelize model definitions.
    // No force and no alter.
    await sequelize.sync();

    console.log("PostgreSQL tables created successfully!");

    const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.table(tables);
  } catch (error) {
    console.error("Table creation failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

createTables();
