
 // models/index.js

const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const db = {};

// Load models
db.Customer = require("./customer");
db.Order = require("./order");
db.OrderItem = require("./orderItem");
db.Fabric = require("./fabric");
db.Accessory = require("./accessory");
db.Appointment = require("./appointment");
db.Voucher = require("./voucher");
db.DesignCategory = require("./designCategory");

// Initialize models
if (db.Customer.initModel) {
  db.Customer.initModel(sequelize);
}

if (db.Order.initModel) {
  db.Order.initModel(sequelize);
}

if (db.OrderItem.initModel) {
  db.OrderItem.initModel(sequelize);
}

if (db.Fabric.initModel) {
  db.Fabric.initModel(sequelize);
}

if (db.Accessory.initModel) {
  db.Accessory.initModel(sequelize);
}

if (db.Appointment.initModel) {
  db.Appointment.initModel(sequelize);
}

if (db.Voucher.initModel) {
  db.Voucher.initModel(sequelize);
}

if (db.DesignCategory.initModel) {
  db.DesignCategory.initModel(sequelize);
}

// Associations

// Customer -> Orders
db.Customer.hasMany(db.Order);
db.Order.belongsTo(db.Customer);

// Order -> OrderItems
db.Order.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Order);

// Customer -> Appointments
db.Customer.hasMany(db.Appointment);
db.Appointment.belongsTo(db.Customer);

// Customer -> Vouchers
db.Customer.hasMany(db.Voucher);
db.Voucher.belongsTo(db.Customer);

// Export database connection and models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
