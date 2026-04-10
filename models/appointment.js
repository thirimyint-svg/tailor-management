const { Model, DataTypes } = require("sequelize");

module.exports = class Appointment extends Model {
  static initModel(sequelize) {
    Appointment.init(
      {
        appointmentAt: { type: DataTypes.DATE, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: true },
        whatsapp: { type: DataTypes.STRING, allowNull: true },

        hotelPickup: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        hotelName: { type: DataTypes.STRING, allowNull: true },
        roomNo: { type: DataTypes.STRING, allowNull: true },
        hotelAddress: { type: DataTypes.TEXT, allowNull: true },

        notes: { type: DataTypes.TEXT, allowNull: true },
        remindBeforeMinutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60 },

        // ✅ reminder flag
        remindedAt: { type: DataTypes.DATE, allowNull: true },
      },
      {
        sequelize,
        modelName: "Appointment",
        tableName: "appointments", // ✅ important for sqlite case issues
      }
    );

    return Appointment;
  }
};
