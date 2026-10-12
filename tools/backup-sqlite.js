
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const source = path.join(__dirname, "..", "tailor.sqlite");
const backupDir = path.join(__dirname, "..", "backups");

fs.mkdirSync(backupDir, { recursive: true });

const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-");

const destination = path.join(
  backupDir,
  `tailor-backup-${timestamp}.sqlite`
);

const db = new sqlite3.Database(
  source,
  sqlite3.OPEN_READONLY,
  (openErr) => {
    if (openErr) {
      console.error("Open error:", openErr.message);
      process.exitCode = 1;
      return;
    }

    console.log("Starting SQLite backup...");

    const backup = db.backup(destination);

    backup.step(-1, (stepErr) => {
      if (stepErr) {
        console.error("Backup step error:", stepErr.message);
      }

      // Finalize the backup before closing the DB.
      backup.finish((finishErr) => {
        if (finishErr) {
          console.error("Backup finish error:", finishErr.message);
        }

        db.close((closeErr) => {
          if (closeErr) {
            console.error("Close error:", closeErr.message);
          }

          if (stepErr || finishErr || closeErr) {
            console.error("Backup was not fully successful.");
            process.exitCode = 1;
            return;
          }

          console.log("Backup completed successfully!");
          console.log("Backup file:", destination);
          console.log("SQLite connection closed successfully!");
        });
      });
    });
  }
);
