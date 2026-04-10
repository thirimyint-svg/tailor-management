// models/accessory.js
const { Model, DataTypes } = require("sequelize");

module.exports = class Accessory extends Model {
  static initModel(sequelize) {
    Accessory.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        category: {
          type: DataTypes.STRING, // Buttons / Zipper / Lining etc.
          allowNull: true,
        },
        unit: {
          type: DataTypes.STRING, // pcs / set / m
          allowNull: true,
        },
        stockQty: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Accessory",
        tableName: "Accessories", // ⬅ important, matches SQL below
      }
    );
    return Accessory;
  }
};
