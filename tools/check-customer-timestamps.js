
require("dotenv").config();

const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { Customer, sequelize } = require("../models");

const backupPath = path.join(
  __dirname,
  "..",
  "backups",
  "tailor-backup-2026-10-09T16-57-14-512Z.sqlite"
);

async function checkTimestamps() {
  const sqlite = new sqlite3.Database(
    backupPath,
    sqlite3.OPEN_READONLY
  );

  try {
    const sqliteCustomers = await new Promise(
      (resolve, reject) => {
        sqlite.all(
          'SELECT id, createdAt, updatedAt FROM "customers" ORDER BY id',
          [],
          (error, rows) => {
            if (error) reject(error);
            else resolve(rows);
          }
        );
      }
    );

    const pgCustomers = await Customer.findAll({
      attributes: ["id", "createdAt", "updatedAt"],
      order: [["id", "ASC"]],
      raw: true,
    });

    for (const source of sqliteCustomers) {
      const target = pgCustomers.find(
        (row) => Number(row.id) === Number(source.id)
      );

      console.log(`\nCustomer ID: ${source.id}`);

      if (!target) {
        console.log("Missing from PostgreSQL");
        continue;
      }

      for (const field of ["createdAt", "updatedAt"]) {
        console.log(`${field}:`);
        console.log("  SQLite:", source[field]);
        console.log(
          "  PostgreSQL:",
          target[field] instanceof Date
            ? target[field].toISOString()
            : target[field]
        );
      }
    }
  } catch (error) {
    console.error("Check failed:", error.message);
    process.exitCode = 1;
  } finally {
    sqlite.close();
    await sequelize.close();
  }
}

checkTimestamps();
