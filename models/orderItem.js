const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OrderItem = sequelize.define("OrderItem", {
  itemName: { type: DataTypes.STRING, allowNull: false }, // e.g. "Shirt", "Pant"
  qty: { type: DataTypes.INTEGER, defaultValue: 1 },
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
});

module.exports = OrderItem;