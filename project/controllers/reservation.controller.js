const {
  sequelize,
  Reservation,
  ReservationItem,
  Product,
  Cart,
} = require("../models");

// GET all
exports.getAll = async (req, res) => {
  const reservations = await Reservation.findAll({
    where: { user_id: req.user.id },
    include: ReservationItem,
  });
  res.json(reservations);
};

// GET one
exports.getOne = async (req, res) => {
  const reservation = await Reservation.findOne({
    where: { id: req.params.id, user_id: req.user.id },
    include: ReservationItem,
  });

  if (!reservation) return res.status(404).json({ message: "Not found" });

  res.json(reservation);
};

// reserveItems
exports.reserveItems = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { items } = req.body;

    const reservation = await Reservation.create(
      { user_id: req.user.id },
      { transaction: t }
    );

    for (let item of items) {
      const product = await Product.findByPk(item.product_id);

      if (!product || product.stock < item.quantity) {
        throw new Error("Invalid product or not enough stock");
      }

      await ReservationItem.create(
        {
          reservation_id: reservation.id,
          product_id: item.product_id,
          quantity: item.quantity,
        },
        { transaction: t }
      );

      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    await t.commit();
    res.json({ message: "Reserved successfully" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

// reserveACart
exports.reserveACart = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
    });

    if (cartItems.length === 0) throw new Error("Cart is empty");

    const reservation = await Reservation.create(
      { user_id: req.user.id },
      { transaction: t }
    );

    for (let item of cartItems) {
      const product = await Product.findByPk(item.product_id);

      if (!product || product.stock < item.quantity) {
        throw new Error("Stock error");
      }

      await ReservationItem.create(
        {
          reservation_id: reservation.id,
          product_id: item.product_id,
          quantity: item.quantity,
        },
        { transaction: t }
      );

      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    await Cart.destroy({
      where: { user_id: req.user.id },
      transaction: t,
    });

    await t.commit();
    res.json({ message: "Cart reserved successfully" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

// cancelReserve
exports.cancelReserve = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const reservation = await Reservation.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!reservation) throw new Error("Not found");

    if (reservation.status === "cancelled") {
      throw new Error("Already cancelled");
    }

    const items = await ReservationItem.findAll({
      where: { reservation_id: reservation.id },
    });

    for (let item of items) {
      const product = await Product.findByPk(item.product_id);
      product.stock += item.quantity;
      await product.save({ transaction: t });
    }

    reservation.status = "cancelled";
    await reservation.save({ transaction: t });

    await t.commit();
    res.json({ message: "Cancelled successfully" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};