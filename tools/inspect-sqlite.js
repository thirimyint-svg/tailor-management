
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
      console.error("SQLite open error:", openErr.message);
      process.exitCode = 1;
      return;
    }

    console.log("Starting SQLite backup...");

    // Completion callback is passed as the 5th argument.
    db.backup(
      destination,
      "main",
      "main",
      true,
      (backupErr) => {
        if (backupErr) {
          console.error("Backup failed:", backupErr.message);
          process.exitCode = 1;
        } else {
          console.log("Backup completed successfully!");
          console.log("Backup file:", destination);
        }

        db.close((closeErr) => {
          if (closeErr) {
            console.error("Close error:", closeErr.message);
            process.exitCode = 1;
          } else {
            console.log("SQLite connection closed successfully!");
          }
        });
      }
    );
  }
);
