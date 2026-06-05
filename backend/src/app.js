// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const { errorHandler } = require("./middleware/error");

// Importimi i rrugëve (Routes)
const authRoutes = require("./routes/auth");
const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");

const publicBusinesses = require("./routes/publicBusinesses");
const adminBusinesses = require("./routes/adminBusinesses");

const publicCityPictures = require("./routes/publicCityPictures");
const adminCityPictures = require("./routes/adminCityPictures");

const publicFaunaVideos = require("./routes/publicFaunaVideos");
const adminFaunaVideos = require("./routes/adminFaunaVideos");

const publicCamping = require("./routes/publicCamping");
const adminCamping = require("./routes/adminCamping");

const publicMountains = require("./routes/publicMountains");
const adminMountains = require("./routes/adminMountains");

const publicHikingRoutes = require("./routes/publicHiking");
const publicTouristPhotos = require("./routes/publicTouristPhotos");
const publicRestaurants = require("./routes/publicRestaurants");
const publicWaters = require("./routes/publicWaters");

const publicCars = require("./routes/publicCars");
const adminCars = require("./routes/adminCars");

const app = express();

// Middleware bazë
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Statike
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health Check
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/", (req, res) => res.send("Deçani API running ✅"));

// Lidhja e rrugëve me prefikse unike (KËTU ËSHTË NDRYSHIMI)
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes); // Për gjeneralet
app.use("/api/admin", adminRoutes);

app.use("/api/businesses/public", publicBusinesses);
app.use("/api/businesses/admin", adminBusinesses);

app.use("/api/citypictures/public", publicCityPictures);
app.use("/api/citypictures/admin", adminCityPictures);

app.use("/api/fauna/public", publicFaunaVideos);
app.use("/api/fauna/admin", adminFaunaVideos);

app.use("/api/camping/public", publicCamping);
app.use("/api/camping/admin", adminCamping);

app.use("/api/mountains/public", publicMountains);
app.use("/api/mountains/admin", adminMountains);

app.use("/api/hiking", publicHikingRoutes);
app.use("/api/tourist-photos", publicTouristPhotos);
app.use("/api/restaurants", publicRestaurants);
app.use("/api/waters", publicWaters);

app.use("/api/cars/public", publicCars);
app.use("/api/cars/admin", adminCars);

// Middleware për rrugët që nuk ekzistojnë
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error Handler
app.use(errorHandler);

module.exports = app;