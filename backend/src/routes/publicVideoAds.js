const express = require("express");
const VideoAd = require("../models/VideoAd");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // 1. Kontrollo sa dokumente ka gjithsej në model
    const count = await VideoAd.countDocuments();
    console.log("Total video në DB:", count);

    // 2. Merr listën
    const list = await VideoAd.find().sort({ createdAt: -1 });
    
    // 3. Log-o listën për ta parë në terminalin e serverit
    console.log("Videot që po dërgohen:", list);

    if (list.length === 0) {
      console.log("KUJDES: Lista është bosh!");
    }

    res.json(list);
  } catch (e) { 
    console.error("Gabim në server:", e);
    next(e); 
  }
});

module.exports = router;