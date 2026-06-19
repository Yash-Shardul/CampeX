const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { protect, authorizeRole } = require("../middleware/authMiddleware");


// =============================
// ADMIN LOGIN
// =============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.role === "main"
        ? ["ALL"]   // 🔥 main admin automatically gets ALL access
        : admin.permissions,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// CREATE SUB ADMIN (Main Only)
// =============================
router.post(
  "/create-subadmin",
  protect,
  authorizeRole("main"),
  async (req, res) => {
    try {
      const { name, email, password, permissions } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const subAdmin = await Admin.create({
        name,
        email,
        password,
        role: "sub",
        permissions: permissions || [],
      });

      res.status(201).json({
        _id: subAdmin._id,
        name: subAdmin.name,
        email: subAdmin.email,
        role: subAdmin.role,
        permissions: subAdmin.permissions,
      });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =============================
// ADMIN DASHBOARD STATS
// =============================
const Club = require("../models/Club");
const Event = require("../models/Event");

router.get(
  "/stats",
  protect,
  async (req, res) => {
    try {
      const clubCount = await Club.countDocuments();
      const eventCount = await Event.countDocuments();
      const subAdminCount = await Admin.countDocuments({ role: "sub" });

      res.json({
        clubs: clubCount,
        events: eventCount,
        subAdmins: subAdminCount,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =============================
// GET ALL SUB ADMINS (Main Only)
// =============================
router.get("/", protect, authorizeRole("main"), async (req, res) => {
  try {
    const admins = await Admin.find({ role: "sub" }).select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// UPDATE SUB ADMIN (EDIT DETAILS + PERMISSIONS)
// =============================
router.put(
  "/update/:id",
  protect,
  authorizeRole("main"),
  async (req, res) => {
    try {
      const { name, email, password, permissions } = req.body;

      const admin = await Admin.findById(req.params.id);

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (admin.role === "main") {
        return res.status(403).json({ message: "Cannot modify main admin" });
      }

      // 🔥 Email duplicate check (exclude current admin)
      if (email && email !== admin.email) {
        const emailExists = await Admin.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: "Email already exists" });
        }
        admin.email = email;
      }

      if (name) admin.name = name;
      if (permissions) admin.permissions = permissions;
      if (password) admin.password = password; // will auto hash in model

      await admin.save();

      res.json({
        message: "Sub admin updated successfully",
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
        },
      });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);


// =============================
// DELETE SUB ADMIN (Main Only)
// =============================
router.delete("/:id", protect, authorizeRole("main"), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.role === "main") {
      return res.status(403).json({ message: "Cannot delete main admin" });
    }

    await admin.deleteOne();

    res.json({ message: "Sub admin removed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;