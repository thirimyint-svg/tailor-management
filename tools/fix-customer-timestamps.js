
require("dotenv").config();

const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { sequelize } = require("../models");

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
        if (openError) {
          reject(openError);
          return;
        }

        sqlite.all(
          'SELECT id, "updatedAt" FROM "customers" ORDER BY id',
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

async function fixTimestamps() {
  let transaction;

  try {
    const customers = await readSQLiteCustomers();

    await sequelize.authenticate();

    transaction = await sequelize.transaction();

    const [existing] = await sequelize.query(
      'SELECT "id" FROM "customers" ORDER BY "id"',
      { transaction }
    );

    const sourceIds = customers.map((c) => Number(c.id));
    const targetIds = existing.map((c) => Number(c.id));

    if (
      sourceIds.length !== targetIds.length ||
      sourceIds.some((id, i) => id !== targetIds[i])
    ) {
      throw new Error(
        "Customer IDs do not match. No timestamps were changed."
      );
    }

    for (const customer of customers) {
      const originalUpdatedAt = new Date(
        customer.updatedAt
      );

      if (Number.isNaN(originalUpdatedAt.getTime())) {
        throw new Error(
          `Invalid timestamp for customer ${customer.id}`
        );
      }

      // Direct SQL avoids Sequelize automatically
      // changing updatedAt to the current time.
      await sequelize.query(
        `UPDATE "customers"
         SET "updatedAt" = :updatedAt
         WHERE "id" = :id`,
        {
          replacements: {
            updatedAt: originalUpdatedAt,
            id: customer.id,
          },
          transaction,
        }
      );

      console.log(
        `Customer ${customer.id}: timestamp restored`
      );
    }

    await transaction.commit();
    transaction = null;

    console.log(
      "All customer updatedAt timestamps restored successfully!"
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    console.error("Repair failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

fixTimestamps();
