module.exports = (req, res, next) => {
  // fake user login
  req.user = { id: 1 };
  next();
};