const express = require("express");
const Water = require("../models/Water");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const list = await Water.find().sort({ createdAt: -1 });
    // Ky console.log do të ndihmojë të shohësh në terminal nëse fotot po kthehen nga MongoDB
    console.log("List e ujërave:", list); 
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Water.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;