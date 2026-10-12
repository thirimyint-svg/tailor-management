const { Model, DataTypes } = require("sequelize");

module.exports = class Order extends Model {
  static initModel(sequelize) {
    Order.init(
      {
        orderDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        totalAmount: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Pending",
        },
        notes: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "orders",
      }
    );
    return Order;
  }
};
