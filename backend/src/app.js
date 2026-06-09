/*const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const { errorHandler } = require("./middleware/error");

// Importimi i rrugëve
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

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Logger për të parë çfarë po kërkohet (shikoje terminalin!)
app.use((req, res, next) => {
  console.log(`[REQUEST]: ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/", (req, res) => res.send("Decani API running ✅"));

// Lidhja e rrugëve me prefikse unike për të shmangur konfliktet 404
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/public/businesses", publicBusinesses);
app.use("/api/admin/businesses", adminBusinesses);

app.use("/api/public/city-pictures", publicCityPictures);
app.use("/api/admin/city-pictures", adminCityPictures);

app.use("/api/public/fauna", publicFaunaVideos);
app.use("/api/admin/fauna", adminFaunaVideos);

app.use("/api/public/camping", publicCamping);
app.use("/api/admin/camping", adminCamping);

app.use("/api/public/mountain", publicMountain);
app.use("/api/admin/mountain", adminMountain);

app.use("/api/public/hiking", publicHikingRoutes);
app.use("/api/public/tourist-photos", publicTouristPhotos);
app.use("/api/public/restaurants", publicRestaurants);
app.use("/api/public/waters", publicWaters);

app.use("/api/public/cars", publicCars);
app.use("/api/admin/cars", adminCars);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use(errorHandler);

module.exports = app;*/

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

const adminHiking = require("./routes/adminHiking");
const publicHikingRoutes = require("./routes/publicHiking");

//const publicTouristPhotos = require("./routes/publicTouristPhotos");
//const adminTouristPhotosRoutes = require("./routes/adminTouristPhotos");

const publicTouristPhotos = require("./routes/publicTouristPhotos");
const adminTouristPhotosRoutes = require("./routes/adminTouristPhotos");


const publicWaters = require("./routes/publicWaters");
const adminWaters = require("./routes/adminWaters"); // Importimi

const publicRestaurants = require("./routes/publicRestaurants");
const adminRestaurants = require("./routes/adminRestaurants");

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


app.use("/api/public/city-pictures", publicCityPictures);
app.use("/api/admin/city-pictures", adminCityPictures);


//app.use("/api/public", publicFaunaVideos);
//app.use("/api/admin", adminFaunaVideos);

app.use("/api/public/fauna", publicFaunaVideos);
app.use("/api/admin/fauna", adminFaunaVideos);



//app.use("/api/public", publicCamping);
//app.use("/api/admin", adminCamping);

app.use("/api/public/camping", publicCamping);
app.use("/api/admin/camping", adminCamping);


app.use("/api/public", publicMountains);
app.use("/api/admin", adminMountains);


app.use("/api/public/hiking", publicHikingRoutes);
app.use("/api/admin/hiking", adminHiking);


// Gjej këto rreshta në app.js dhe sigurohu që janë kështu:
app.use("/api/public/tourist-photos", publicTouristPhotos);
app.use("/api/admin/tourist-photos", adminTouristPhotosRoutes);

//app.use("/api/public/tourist-photos", publicTouristPhotos);
//app.use("/api/admin/tourist-photos", adminTouristPhotosRoutes);

app.use("/api/admin/waters", adminWaters);
app.use("/api/public", publicWaters);


app.use("/api/public/restaurants", publicRestaurants);
app.use("/api/admin/restaurants", adminRestaurants);


//app.use("/api/public", publicCars);
//app.use("/api/admin", adminCars);
app.use("/api/public/cars", publicCars);
app.use("/api/admin/cars", adminCars);

// Middleware për rrugët që nuk ekzistojnë
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error Handler (duhet të jetë gjithmonë i fundit)
app.use(errorHandler);

module.exports = app;