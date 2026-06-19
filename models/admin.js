const { Model, DataTypes } = require("sequelize");

module.exports = class Admin extends Model {
  static initModel(sequelize) {
    Admin.init(
      {
        name: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, unique: true },
        isRoot: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        address: { type: DataTypes.TEXT, allowNull: true},
        passwordHash: { type: DataTypes.STRING, allowNull: true }

      },
      {
        sequelize,
        modelName: "Admin",
        tableName: "admins",
      }
    );
    return Admin;
  }
};
