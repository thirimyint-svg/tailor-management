require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const { sequelize } = require("./models");
const routes = require("./routes");
const { startReminderJob } = require("./services/reminderService");

const app = express();

/* =======================
   View Engine
   ======================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =======================
   Core Middlewares
   ======================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* =======================
   Session & Flash
   ======================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "tailor_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;  // customer session
  next();
});

/* =======================
   Global View Variables
   ======================= */
app.use((req, res, next) => {
  // Flash messages
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  // Current URL (used for active sidebar menu)
  res.locals.currentUrl = req.originalUrl;      // for active menu
  res.locals.user = req.session.user || null;  // customer session

  next();
});

/* =======================
   Routes
   ======================= */
app.use("/", routes);

/* =======================
   Server & Database
   ======================= */
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // use { force:true } ONLY in development if needed

    console.log("DB connected & synced");

    // Start reminder cron job
    startReminderJob();
    console.log("Reminder job started ✅");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB error:", err);
  }
})();
