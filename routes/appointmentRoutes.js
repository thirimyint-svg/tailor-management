const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

/* =======================
   CALENDAR (FIXED ROUTES)
   ======================= */
router.get("/calendar/view", appointmentController.calendarPage);
router.get("/calendar/events", appointmentController.calendarEvents);

/* =======================
   MAIN PAGES
   ======================= */
router.get("/", appointmentController.page);
router.post("/create", appointmentController.create);

/* =======================
   EDIT / DELETE (DYNAMIC)
   ======================= */
router.get("/:id/edit", appointmentController.editPage);
router.post("/:id/update", appointmentController.update);
router.post("/:id/delete", appointmentController.remove);

module.exports = router;
