const express = require("express");
const router = express.Router();

const {
  getAllClubs,
  createClub,
  updateClub,
  deleteClub,
} = require("../controllers/clubController");

const upload = require("../middleware/upload");

const {
  protect,
  checkPermission,
} = require("../middleware/authMiddleware");

// ================= PUBLIC ROUTE =================

// ✅ VIEW clubs (PUBLIC)
router.get("/", getAllClubs);

// ================= ADMIN ROUTES =================

// 🔐 CREATE club
router.post(
  "/",
  protect,
  checkPermission("create_club"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "activityImages", maxCount: 5 },
  ]),
  createClub
);

// 🔐 UPDATE club
router.put(
  "/:id",
  protect,
  checkPermission("edit_club"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "activityImages", maxCount: 5 },
  ]),
  updateClub
);

// 🔐 DELETE club
router.delete(
  "/:id",
  protect,
  checkPermission("delete_club"),
  deleteClub
);

module.exports = router;