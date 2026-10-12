
const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");

require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const caCertificate = fs.readFileSync(
  path.join(__dirname, "prod-ca-2021.crt"),
  "utf8"
);

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: caCertificate
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
