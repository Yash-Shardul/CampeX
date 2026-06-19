const express = require("express");
const router = express.Router();
const multer = require("multer");
const eventController = require("../controllers/eventController");

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/events");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =========================
   ROUTES
========================= */

// CREATE EVENT (with banner + images)
router.post(
  "/",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  eventController.createEvent
);

// GET ALL EVENTS
router.get("/", eventController.getEvents);

// GET UPCOMING EVENTS
router.get("/upcoming", eventController.getUpcomingEvents);

// GET PAST EVENTS
router.get("/past", eventController.getPastEvents);

// GET SINGLE EVENT
router.get("/:id", eventController.getEventById);

// UPDATE EVENT (with optional banner + images)
router.put(
  "/:id",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  eventController.updateEvent
);

// DELETE EVENT
router.delete("/:id", eventController.deleteEvent);

module.exports = router;