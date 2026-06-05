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

// Statike (për dosjen lokale 'uploads' - nëse përdoret ende për diçka tjetër)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health Check
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/", (req, res) => res.send("Deçani API running ✅"));

// Lidhja e rrugëve (Routes)
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/public", publicBusinesses);
app.use("/api/admin", adminBusinesses);

app.use("/api/public", publicCityPictures);
app.use("/api/admin", adminCityPictures);

app.use("/api/public", publicFaunaVideos);
app.use("/api/admin", adminFaunaVideos);

app.use("/api/public", publicCamping);
app.use("/api/admin", adminCamping);

app.use("/api/public", publicMountains);
app.use("/api/admin", adminMountains);

app.use("/api/public", publicHikingRoutes);
app.use("/api/public", publicTouristPhotos);
app.use("/api/public", publicRestaurants);
app.use("/api/public", publicWaters);

app.use("/api/public", publicCars);
app.use("/api/admin", adminCars);

// Middleware për rrugët që nuk ekzistojnë
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error Handler (duhet të jetë gjithmonë i fundit)
app.use(errorHandler);

module.exports = app;