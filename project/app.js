const express = require("express");
const bodyParser = require("body-parser");
const { sequelize, Product, Cart, User } = require("./models");

const app = express(); // ✅ KHỞI TẠO APP
app.use(bodyParser.json());

const reservationRoutes = require("./routes/reservation.routes");
app.use("/", reservationRoutes);

sequelize.sync({ force: true }).then(async () => {
  console.log("Database synced");

  await User.create({ id: 1, name: "Test User" });

  await Product.bulkCreate([
    { id: 1, name: "Coffee", stock: 10 },
    { id: 2, name: "Milk Tea", stock: 5 },
  ]);

  await Cart.bulkCreate([
    { user_id: 1, product_id: 1, quantity: 2 },
    { user_id: 1, product_id: 2, quantity: 1 },
  ]);

  console.log("Seed data created");

  app.listen(3000, () => console.log("Server running at 3000")); // ✅ OK
});