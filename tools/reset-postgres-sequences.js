
require("dotenv").config();

const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");

async function resetSequences() {
  try {
    await sequelize.authenticate();

    const tables = [
      "customers",
      "orders",
      "OrderItems",
      "fabrics",
      "Accessories",
      "appointments",
      "Vouchers",
      "DesignCategories",
    ];

    for (const table of tables) {
      const [result] = await sequelize.query(
        `SELECT pg_get_serial_sequence(
          quote_ident(:tableName),
          'id'
        ) AS sequence_name`,
        {
          replacements: { tableName: table },
          type: QueryTypes.SELECT,
        }
      );

      if (!result.sequence_name) {
        console.log(`${table}: No ID sequence found`);
        continue;
      }

      const escapedTable = `"${table.replace(/"/g, '""')}"`;

      const [maxRow] = await sequelize.query(
        `SELECT MAX("id") AS max_id FROM ${escapedTable}`,
        { type: QueryTypes.SELECT }
      );

      const maxId = Number(maxRow.max_id || 0);

      await sequelize.query(
        `SELECT setval(
          CAST(:sequenceName AS regclass),
          :sequenceValue,
          :isCalled
        )`,
        {
          replacements: {
            sequenceName: result.sequence_name,
            sequenceValue: maxId > 0 ? maxId : 1,
            isCalled: maxId > 0,
          },
        }
      );

      console.log(
        `${table}: Next ID = ${maxId + 1}`
      );
    }

    console.log("All ID sequences checked successfully!");

  } catch (error) {
    console.error("Sequence reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

resetSequences();
