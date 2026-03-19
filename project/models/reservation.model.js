const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reservation = sequelize.define("Reservation", {
  user_id: DataTypes.INTEGER,
  status: {
    type: DataTypes.STRING,
    defaultValue: "active",
  },
});

module.exports = Reservation;