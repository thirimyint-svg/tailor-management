
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

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

sqlite.all(
  "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  [],
  (error, tables) => {
    if (error) {
      console.error(error);
      sqlite.close();
      return;
    }

    let index = 0;

    function next() {
      if (index >= tables.length) {
        sqlite.close();
        return;
      }

      const table = tables[index++].name;
      const safeName = table.replace(/"/g, '""');

      sqlite.get(
        `SELECT COUNT(*) AS count FROM "${safeName}"`,
        [],
        (err, row) => {
          if (err) {
            console.error(`${table}: ${err.message}`);
          } else {
            console.log(`${table}: ${row.count}`);
          }
          next();
        }
      );
    }

    next();
  }
);
