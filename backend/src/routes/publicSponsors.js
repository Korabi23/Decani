const express = require("express");
const Sponsor = require("../models/Sponsor");

const router = express.Router();

// Kjo rrugë shërben për të marrë listën e sponsorëve nga baza e të dhënave
router.get("/", async (req, res, next) => {
  try {
    const list = await Sponsor.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

module.exports = router;