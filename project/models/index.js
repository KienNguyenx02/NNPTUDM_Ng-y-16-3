const sequelize = require("../config/database");

const User = require("./user.model");
const Product = require("./product.model");
const Reservation = require("./reservation.model");
const ReservationItem = require("./reservationItem.model");
const Cart = require("./cart.model");

// Relationships
User.hasMany(Reservation, { foreignKey: "user_id" });
Reservation.belongsTo(User, { foreignKey: "user_id" });

Reservation.hasMany(ReservationItem, { foreignKey: "reservation_id" });
ReservationItem.belongsTo(Reservation, { foreignKey: "reservation_id" });

Product.hasMany(ReservationItem, { foreignKey: "product_id" });
ReservationItem.belongsTo(Product, { foreignKey: "product_id" });

User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Cart, { foreignKey: "product_id" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

module.exports = {
  sequelize,
  User,
  Product,
  Reservation,
  ReservationItem,
  Cart,
};