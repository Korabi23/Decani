function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({
    message: "Server error",
    detail: err?.message || String(err),
  });
}

module.exports = { errorHandler };
