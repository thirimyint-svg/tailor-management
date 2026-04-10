const { Model, DataTypes } = require("sequelize");

module.exports = class Fabric extends Model {
  static initModel(sequelize) {
    Fabric.init(
      {
        title: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING, allowNull: false, unique: true },
        imageUrl: { type: DataTypes.STRING, allowNull: true }, // /uploads/fabrics/xxx.jpg
        color: { type: DataTypes.STRING, allowNull: true },
        stockQty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        notes: { type: DataTypes.TEXT, allowNull: true },
      },
      { sequelize, modelName: "Fabric", tableName: "fabrics" }
    );
    return Fabric;
  }
};
