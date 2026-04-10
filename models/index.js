// models/index.js
const Sequelize = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "tailor.sqlite"),
  logging: false,
});

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

// Init models
if (db.Customer.initModel) db.Customer.initModel(sequelize);
if (db.Order.initModel) db.Order.initModel(sequelize);
if (db.OrderItem.initModel) db.OrderItem.initModel(sequelize);
if (db.Fabric.initModel) db.Fabric.initModel(sequelize);
if (db.Accessory.initModel) db.Accessory.initModel(sequelize);
if (db.Appointment.initModel) db.Appointment.initModel(sequelize);
if (db.Voucher.initModel) db.Voucher.initModel(sequelize);
if (db.DesignCategory.initModel) db.DesignCategory.initModel(sequelize);

// Associations
db.Customer.hasMany(db.Order);
db.Order.belongsTo(db.Customer);

db.Order.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Order);

db.Customer.hasMany(db.Appointment);
db.Appointment.belongsTo(db.Customer);

db.Customer.hasMany(db.Voucher);
db.Voucher.belongsTo(db.Customer);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
