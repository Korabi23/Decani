const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true }, // p.sh: 'Implementim', 'Planifikim', 'Përfunduar (2025)'
  description: { type: String, required: true },
  statusColor: { type: String, default: "#10b981" }, // Ruajmë ngjyrën e pikës (p.sh: #10b981, #facc15, #3b82f6)
  type: { type: String, enum: ["active", "completed"], required: true }, // Përcakton nëse shfaqet te blloku i parë apo i dytë
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);