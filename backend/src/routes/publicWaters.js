const express = require("express");
const Water = require("../models/Water");
const router = express.Router();

/**
 * GET: Merr listën e të gjitha ujërave
 * Përdorim .lean() për performancë më të mirë (kthim të thjeshtë të objekteve JSON)
 */
router.get("/", async (req, res) => {
  try {
    const list = await Water.find().sort({ createdAt: -1 }).lean();
    
    // Logimi për diagnostikim: shiko terminalin tënd për të verifikuar 
    // nëse fusha 'images' (ose 'photos') po kthehet me të dhëna.
    console.log("Duke kthyer listën e ujërave. Numri i objekteve:", list.length);
    
    res.json(list);
  } catch (e) {
    console.error("Gabim te GET /api/public/waters:", e);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET: Merr një ujë specifik sipas ID
 */
router.get("/:id", async (req, res) => {
  try {
    const item = await Water.findById(req.params.id).lean();
    
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    
    res.json(item);
  } catch (e) {
    console.error(`Gabim te GET /api/public/waters/${req.params.id}:`, e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;