
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

console.log(
  "DATABASE_URL loaded:",
  Boolean(process.env.DATABASE_URL)
);

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing from .env");
  process.exit(1);
}

const sequelize = require("./db");

async function testConnection() {
  try {
    await sequelize.authenticate();

    console.log("Supabase PostgreSQL connected successfully!");
  } catch (error) {
    console.error("Connection failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

testConnection();
