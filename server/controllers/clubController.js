const Club = require("../models/Club");

// ===============================
// GET ALL CLUBS
// ===============================
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// CREATE CLUB
// ===============================
exports.createClub = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      department,
      activeMembersCount,
      category,
      president,
      contactEmail,
      contactNumber,
    } = req.body;

    // ✅ Parse social links
    let socialLinks = {};
    if (req.body.socialLinks) {
      socialLinks = JSON.parse(req.body.socialLinks);
    }

    // Handle logo
    const logo = req.files?.logo
      ? `/uploads/${req.files.logo[0].filename}`
      : "";

    // Handle activity images
    const activityImages = req.files?.activityImages
      ? req.files.activityImages.map((file) => `/uploads/${file.filename}`)
      : [];

    const club = await Club.create({
      name,
      description,
      type,
      department: type === "department" ? department : "",
      category,
      president,
      contactEmail,
      contactNumber,
      activeMembersCount: activeMembersCount
        ? Number(activeMembersCount)
        : 0,
      logo,
      activityImages,
      socialLinks, // ✅ ADDED
    });

    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// UPDATE CLUB
// ===============================
exports.updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const {
      name,
      description,
      type,
      department,
      activeMembersCount,
      category,
      president,
      contactEmail,
      contactNumber,
    } = req.body;

    // ===============================
    // BASIC FIELDS
    // ===============================
    if (name !== undefined) club.name = name;
    if (description !== undefined) club.description = description;
    if (type !== undefined) club.type = type;

    club.department =
      (type || club.type) === "department"
        ? department !== undefined
          ? department
          : club.department
        : "";

    if (activeMembersCount !== undefined) {
      club.activeMembersCount = Number(activeMembersCount);
    }

    if (category !== undefined) club.category = category;
    if (president !== undefined) club.president = president;
    if (contactEmail !== undefined) club.contactEmail = contactEmail;
    if (contactNumber !== undefined) club.contactNumber = contactNumber;

    // ===============================
    // ✅ SOCIAL LINKS UPDATE
    // ===============================
    if (req.body.socialLinks) {
      club.socialLinks = JSON.parse(req.body.socialLinks);
    }

    // ===============================
    // ✅ LOGO (with existing support)
    // ===============================
    if (req.files?.logo) {
      club.logo = `/uploads/${req.files.logo[0].filename}`;
    } else if (req.body.existingLogo !== undefined) {
      club.logo = req.body.existingLogo; // keep or remove
    }

    // ===============================
    // ACTIVITY IMAGES
    // ===============================
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = JSON.parse(req.body.existingImages);
    }

    let newImages = [];
    if (req.files?.activityImages) {
      newImages = req.files.activityImages.map(
        (file) => `/uploads/${file.filename}`
      );
    }

    club.activityImages = [...existingImages, ...newImages];

    const updatedClub = await club.save();

    res.json(updatedClub);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===============================
// DELETE CLUB
// ===============================
exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    await club.deleteOne();
    res.json({ message: "Club deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};