
require("dotenv").config();

const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { QueryTypes } = require("sequelize");
const db = require("../models");

const backupPath = path.join(
  __dirname,
  "..",
  "backups",
  "tailor-backup-2026-10-09T16-57-14-512Z.sqlite"
);

const sqlite = new sqlite3.Database(
  backupPath,
  sqlite3.OPEN_READONLY
);

function readSQLite(sql) {
  return new Promise((resolve, reject) => {
    sqlite.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function migrate() {
  const transaction = await db.sequelize.transaction();

  try {
    await db.sequelize.authenticate();

    // Stop if PostgreSQL customers already contain records.
    const existingCustomers = await db.Customer.count({
      transaction,
    });

    if (existingCustomers > 0) {
      throw new Error(
        "PostgreSQL customers table is not empty. Migration stopped."
      );
    }

    const customers = await readSQLite(
      'SELECT * FROM "customers" ORDER BY id'
    );

    console.log(`SQLite customers found: ${customers.length}`);

    for (const customer of customers) {
      await db.Customer.create(
        {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          isVerified: Boolean(customer.isVerified),
          verificationToken: customer.verificationToken,
          address: customer.address,
          passwordHash: customer.passwordHash,
          isUser: Boolean(customer.isUser),
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        },
        { transaction }
      );
    }

    await transaction.commit();

    console.log("Customer migration completed successfully!");
    console.log(`Migrated customers: ${customers.length}`);

  } catch (error) {
    await transaction.rollback();
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    sqlite.close();
    await db.sequelize.close();
  }
}

migrate();
