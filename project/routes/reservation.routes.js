const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservation.controller");
const auth = require("../middleware/auth");

router.get("/reservations", auth, controller.getAll);
router.get("/reservations/:id", auth, controller.getOne);
router.post("/reserveItems", auth, controller.reserveItems);
router.post("/reserveACart", auth, controller.reserveACart);
router.post("/cancelReserve/:id", auth, controller.cancelReserve);

module.exports = router;