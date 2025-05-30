if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const multer = require("multer");
const ejsMate = require("ejs-mate");
const helmet = require("helmet");
const { storage } = require("./Cloudconfig.js");
const { cloudinary } = require("./Cloudconfig.js");
const { connectDB } = require("./config/db.js");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const { UnitSchema, BhkSchema, locationSchema } = require("./schema.js");

// Import Models
const Unit = require("./models/unit.js");
const Bhk = require("./models/bhk.js");
const Location = require("./models/location.js");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(helmet()); // Security headers
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Connect to MongoDB
connectDB();

// Session Setup with MongoDB Store
const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  secret: process.env.SECRET_KEY,
  touchAfter: 24 * 3600, // Reduces session update frequency
});
app.use(
  session({
    store,
    name: "session",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// Multer for File Uploads
const uploads = multer({ storage });

// Middleware: Admin Authentication
const adminAuth = (req, res, next) => {
  if (!req.session.isAdmin) return res.redirect("/login");
  next();
};

// Middleware: Set Global Admin Variable
app.use((req, res, next) => {
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

// Admin Credentials
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_CREDENTIALS_USERNAME,
  password: process.env.ADMIN_CREDENTIALS_PASSWORD,
};

// Validation Middleware
const validateUnit = (req, res, next) => {
  const { error } = UnitSchema.validate(req.body);
  if (error) throw new ExpressError(error.message, 400);
  next();
};
const validateBhk = (req, res, next) => {
  const { error } = BhkSchema.validate(req.body);
  if (error) throw new ExpressError(error.message, 400);
  next();
};
const validateLocation = (req, res, next) => {
  const { error } = locationSchema.validate(req.body);
  if (error) throw new ExpressError(error.message, 400);
  next();
};

//  Home Page
app.get("/", wrapAsync(async (req, res) => {
  const units = await Unit.find({});
  const locations = await Location.find({});
  res.render("home.ejs", { units, locations });
}));

//  Show Unit Details
app.get("/show/:id", wrapAsync(async (req, res) => {
  const unit = await Unit.findById(req.params.id).populate("types");
  if (!unit) throw new ExpressError("Unit not found", 404);
  res.render("show.ejs", { unit });
}));

//  Add New Unit Page
app.get("/new", adminAuth, (req, res) => {
  res.render("new.ejs");
});

//  Create New Unit
app.post(
  "/new-page",
  adminAuth,
  uploads.array("img", 5),
  validateUnit,
  wrapAsync(async (req, res) => {
    const { projectname, area, location, price } = req.body;
    const img = req.files.map(file => ({ url: file.path, filename: file.filename }));
    const unit = new Unit({ projectname, area, location, price, img });
    await unit.save();
    res.redirect("/");
  })
);

//  Edit Unit
app.get("/edit/:id", adminAuth, wrapAsync(async (req, res) => {
  const unit = await Unit.findById(req.params.id);
  if (!unit) throw new ExpressError("Unit not found", 404);
  res.render("edit.ejs", { unit });
}));

//  Update Unit
app.post("/update/:id", adminAuth, validateUnit, wrapAsync(async (req, res) => {
  const { projectname, area, location, price } = req.body;
  await Unit.findByIdAndUpdate(req.params.id, { projectname, area, location, price });
  res.redirect("/");
}));

// Delete Unit
app.post("/delete/:id", adminAuth, wrapAsync(async (req, res) => {
  const unit = await Unit.findById(req.params.id);
  if (!unit) throw new ExpressError("Unit not found", 404);

  // Delete images from Cloudinary
  for (const image of unit.img) {
    await cloudinary.uploader.destroy(image.filename);
  }
  await Unit.findByIdAndDelete(req.params.id);
  res.redirect("/");
}));

// Add BHK
app.post("/:id/addbhk", adminAuth, validateBhk, wrapAsync(async (req, res) => {
  const bhk = new Bhk(req.body);
  const unit = await Unit.findById(req.params.id);
  unit.types.push(bhk);
  await bhk.save();
  await unit.save();
  res.redirect(`/show/${req.params.id}`);
}));

//  Delete BHK
app.post("/:id/deletebhk/:bhkid", adminAuth, wrapAsync(async (req, res) => {
  await Unit.findByIdAndUpdate(req.params.id, { $pull: { types: req.params.bhkid } });
  await Bhk.findByIdAndDelete(req.params.bhkid);
  res.redirect(`/show/${req.params.id}`);
}));

//  Admin Login
app.get("/login", (req, res) => res.render("login.ejs"));
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    req.session.isAdmin = true;
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

//  Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// Add Location
app.get("/location", adminAuth, (req, res) => res.render("location.ejs"));
app.post("/submit-location", adminAuth, validateLocation, wrapAsync(async (req, res) => {
  await new Location(req.body).save();
  res.redirect("/");
}));

// Filter Units by Location
app.get("/filter", wrapAsync(async (req, res) => {
  const units = await Unit.find({ location: req.query.location });
  units.length ? res.render("filter.ejs", { units }) : res.send("No units found");
}));

//  Additional Pages
app.get("/sell", (req, res) => res.render("sell.ejs"));
app.get("/about", (req, res) => res.render("about.ejs"));
app.get("/contact", (req, res) => res.render("contact.ejs"));

// 404 Page
app.use((req, res) => res.status(404).send("404 Page not found"));

//  Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).render("error.ejs", { message: err.message || "Something went wrong" });
});

// Start Server
app.listen(3000, () => console.log("🚀 Server running on port 3000"));
