const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ReservationItem = sequelize.define("ReservationItem", {
  reservation_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
});

module.exports = ReservationItem;