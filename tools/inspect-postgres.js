
require("dotenv").config();

const sequelize = require("../config/db");

async function inspectPostgres() {
  try {
    await sequelize.authenticate();

    console.log("Connected to Supabase PostgreSQL!");

    const [tables] = await sequelize.query(`
      SELECT
        table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log("\nExisting PostgreSQL tables:");

    if (tables.length === 0) {
      console.log("No tables found.");
    } else {
      console.table(tables);
    }
  } catch (error) {
    console.error("Inspection failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

inspectPostgres();
