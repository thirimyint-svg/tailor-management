// models/voucher.js
const { Model, DataTypes } = require("sequelize");

module.exports = class Voucher extends Model {
  static initModel(sequelize) {
    Voucher.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        discountType: {
          type: DataTypes.STRING, // 'amount' or 'percent'
          allowNull: false,
          defaultValue: "amount",
        },
        discountValue: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
        },
        minOrderAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
        },
        validFrom: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        validTo: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        imagePath: {
          type: DataTypes.STRING, // /uploads/vouchers/xxx.jpg
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },

        // 👉 link to customer (optional)
        CustomerId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        // 👉 flag if used
        isUsed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: "Voucher",
        tableName: "Vouchers",
      }
    );
    return Voucher;
  }
};
