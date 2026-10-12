
require("dotenv").config();

const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { sequelize, Customer } = require("../models");

const backupPath = path.join(
  __dirname,
  "..",
  "backups",
  "tailor-backup-2026-10-09T16-57-14-512Z.sqlite"
);

function readSQLiteCustomers() {
  return new Promise((resolve, reject) => {
    const sqlite = new sqlite3.Database(
      backupPath,
      sqlite3.OPEN_READONLY,
      (openError) => {
        if (openError) return reject(openError);

        sqlite.all(
          'SELECT * FROM "customers" ORDER BY id',
          [],
          (error, rows) => {
            sqlite.close();

            if (error) reject(error);
            else resolve(rows);
          }
        );
      }
    );
  });
}

async function verify() {
  try {
    const sqliteCustomers = await readSQLiteCustomers();

    const pgCustomers = await Customer.findAll({
      order: [["id", "ASC"]],
      raw: true,
    });

    console.log("SQLite customers:", sqliteCustomers.length);
    console.log("PostgreSQL customers:", pgCustomers.length);

    if (sqliteCustomers.length !== pgCustomers.length) {
      throw new Error("Customer counts do not match.");
    }

    for (const source of sqliteCustomers) {
      const target = pgCustomers.find(
        (customer) => customer.id === source.id
      );

      if (!target) {
        throw new Error(
          `Customer ID ${source.id} is missing in PostgreSQL.`
        );
      }

      const fields = [
        "name",
        "phone",
        "email",
        "verificationToken",
        "address",
        "passwordHash",
      ];

      for (const field of fields) {
        if (source[field] !== target[field]) {
          throw new Error(
            `Customer ${source.id}: ${field} does not match.`
          );
        }
      }

      for (const field of ["isVerified", "isUser"]) {
        if (Boolean(source[field]) !== Boolean(target[field])) {
          throw new Error(
            `Customer ${source.id}: ${field} does not match.`
          );
        }
      }

      for (const field of ["createdAt", "updatedAt"]) {
        const sourceTime = new Date(source[field]).getTime();
        const targetTime = new Date(target[field]).getTime();

        if (
          !Number.isFinite(sourceTime) ||
          !Number.isFinite(targetTime) ||
          sourceTime !== targetTime
        ) {
          throw new Error(
            `Customer ${source.id}: ${field} does not match.`
          );
        }
      }

      console.log(`Customer ID ${source.id}: Verified`);
    }

    console.log("Customer migration verification passed!");

  } catch (error) {
    console.error("Verification failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

verify();
