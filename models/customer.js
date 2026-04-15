const { Model, DataTypes } = require("sequelize");

module.exports = class Customer extends Model {
  static initModel(sequelize) {
    Customer.init(
      {
        name: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING, unique: true },
        isVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        verificationToken: { type: DataTypes.STRING },
        address: { type: DataTypes.TEXT },
        passwordHash: { type: DataTypes.STRING, allowNull: true },
        isUser: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

      },
      {
        sequelize,
        modelName: "Customer",
        tableName: "customers",
      }
    );
    return Customer;
  }
};
