
const { Model, DataTypes } = require("sequelize");

module.exports = class OrderItem extends Model {
  static initModel(sequelize) {
    OrderItem.init(
      {
        itemName: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        qty: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },

        price: {
          type: DataTypes.FLOAT,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "OrderItem",
        tableName: "OrderItems",
      }
    );

    return OrderItem;
  }
};
