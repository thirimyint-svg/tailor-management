// models/designCategory.js
const { Model, DataTypes } = require("sequelize");

module.exports = class DesignCategory extends Model {
  static initModel(sequelize) {
    DesignCategory.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        imagePath: {
          type: DataTypes.STRING,
          allowNull: true, // /uploads/designs/xxx.jpg
        },
      },
      {
        sequelize,
        modelName: "DesignCategory",
        tableName: "DesignCategories",
      }
    );
    return DesignCategory;
  }
};
