
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

/* =======================
   Global View Variables
   ======================= */
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUrl = req.originalUrl;

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

async function startServer() {
  try {
    if (!process.env.SESSION_SECRET) {
      throw new Error("SESSION_SECRET is missing from .env");
    }

    // Check PostgreSQL connection only.
    // Do NOT automatically create or alter tables.
    await sequelize.authenticate();

    console.log("Supabase PostgreSQL connected successfully!");

    // Reminder job is deliberately disabled
    // until migration and validation are complete.
    // startReminderJob();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database or server startup error:", err);
    process.exitCode = 1;
  }
}

startServer();
