const Event = require("../models/Event");
const fs = require("fs");
const path = require("path");

/* CREATE EVENT */
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      club,
      startTime,
      endTime,
      eventType,
      venue,
      category,
      maxParticipants,
      instagram,
      website,
      facebook,
      linkedin,
      hostName,
      contactEmail,
      contactPhone,
      guests, // JSON string from frontend
    } = req.body;

    // Auto delete 30 days after event endTime
    const deleteAfter = new Date(endTime);
    deleteAfter.setDate(deleteAfter.getDate() + 30);

    const banner = req.files?.banner?.[0]?.path || "";
    const images = req.files?.images?.map((f) => f.path) || [];

    // Parse guests safely (max 4)
    let guestsArray = [];
    if (guests) {
      try {
        const parsed = JSON.parse(guests);
        guestsArray = Array.isArray(parsed) ? parsed.slice(0, 4) : [parsed].slice(0, 4);
      } catch {
        guestsArray = [guests].slice(0, 4);
      }
    }

    const event = await Event.create({
      title,
      description,
      club,
      startTime,
      endTime,
      eventType: eventType || "Offline",
      venue,
      category,
      maxParticipants,
      guests: guestsArray,
      banner,
      images,
      socialLinks: { instagram, website, facebook, linkedin },
      host: { name: hostName, contactEmail, contactPhone },
      deleteAfter,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* GET ALL EVENTS */
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET EVENT BY ID */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE EVENT */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const {
      title,
      description,
      club,
      startTime,
      endTime,
      eventType,
      venue,
      category,
      maxParticipants,
      instagram,
      website,
      facebook,
      linkedin,
      hostName,
      contactEmail,
      contactPhone,
      guests,
      removedImages,
      removeBanner,
    } = req.body;

    // Update fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.club = club || event.club;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.eventType = eventType || event.eventType || "Offline";
    event.venue = venue || event.venue;
    event.category = category || event.category;
    event.maxParticipants = maxParticipants || event.maxParticipants;

    if (endTime) {
      const deleteAfter = new Date(endTime);
      deleteAfter.setDate(deleteAfter.getDate() + 30);
      event.deleteAfter = deleteAfter;
    }

    // Guests (max 4)
    let guestsArray = [];
    if (guests) {
      try {
        const parsed = JSON.parse(guests);
        guestsArray = Array.isArray(parsed) ? parsed.slice(0, 4) : [parsed].slice(0, 4);
      } catch {
        guestsArray = [guests].slice(0, 4);
      }
    }
    event.guests = guestsArray;

    // Remove selected images
    if (removedImages) {
      const imagesToRemove = Array.isArray(removedImages) ? removedImages : [removedImages];
      imagesToRemove.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
      event.images = event.images.filter((img) => !imagesToRemove.includes(img));
    }

    // Add new images
    if (req.files?.images) {
      const newImages = req.files.images.map((f) => f.path);
      event.images = [...event.images, ...newImages];
    }

    // Remove banner
    if (removeBanner === "true" && event.banner) {
      const fullPath = path.join(__dirname, "..", event.banner);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      event.banner = "";
    }

    // Replace banner
    if (req.files?.banner) {
      if (event.banner) {
        const oldBanner = path.join(__dirname, "..", event.banner);
        if (fs.existsSync(oldBanner)) fs.unlinkSync(oldBanner);
      }
      event.banner = req.files.banner[0].path;
    }

    // Social links
    if (!event.socialLinks) event.socialLinks = {};
    event.socialLinks.instagram = instagram || event.socialLinks.instagram;
    event.socialLinks.website = website || event.socialLinks.website;
    event.socialLinks.facebook = facebook || event.socialLinks.facebook;
    event.socialLinks.linkedin = linkedin || event.socialLinks.linkedin;

    // Host info
    event.host.name = hostName || event.host.name;
    event.host.contactEmail = contactEmail || event.host.contactEmail;
    event.host.contactPhone = contactPhone || event.host.contactPhone;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* DELETE EVENT */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET UPCOMING EVENTS */
exports.getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ startTime: { $gte: now } }).sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET PAST EVENTS (Last 30 days) */
exports.getPastEvents = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const events = await Event.find({
      startTime: { $lt: now, $gte: thirtyDaysAgo },
    }).sort({ startTime: -1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};