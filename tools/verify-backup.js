
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const backupPath = path.join(
  __dirname,
  "..",
  "backups",
  "tailor-backup-2026-10-09T16-57-14-512Z.sqlite"
);

const db = new sqlite3.Database(
  backupPath,
  sqlite3.OPEN_READONLY,
  (err) => {
    if (err) {
      console.error("Cannot open backup:", err.message);
      process.exitCode = 1;
      return;
    }

    db.get("PRAGMA integrity_check", (err, result) => {
      if (err || result.integrity_check !== "ok") {
        console.error("Integrity check failed:", err || result);
        process.exitCode = 1;
        return db.close();
      }

      console.log("Integrity: ok");

      db.get(
        "SELECT COUNT(*) AS total FROM customers",
        (err, row) => {
          if (err) {
            console.error("Customer count error:", err.message);
            process.exitCode = 1;
          } else {
            console.log("Customers:", row.total);
          }

          db.close();
        }
      );
    });
  }
);
