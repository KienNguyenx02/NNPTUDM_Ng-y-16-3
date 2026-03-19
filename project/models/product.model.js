const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  name: DataTypes.STRING,
  stock: DataTypes.INTEGER,
});

module.exports = Product;