const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  club: { type: String, required: false },

  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  eventType: {
    type: String,
    enum: ["Virtual", "Offline"],
    default: "Offline",
  },

  venue: String,

  category: {
    type: String,
    enum: ["Technical", "Cultural", "Sports", "Workshop", "Other"],
    default: "Other",
  },

  maxParticipants: Number,
  guests: [{ type: String }],

  status: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Completed"],
    default: "Upcoming",
  },

  banner: { type: String },
  images: [{ type: String }],

  socialLinks: {
    instagram: { type: String },
    website: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
  },

  host: {
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
  },

  deleteAfter: { type: Date },
});

// TTL Index (Auto delete after date passes)
eventSchema.index({ deleteAfter: 1 }, { expireAfterSeconds: 0 });

// Ensure endTime is after startTime
eventSchema.pre("save", function (next) {
  if (this.endTime <= this.startTime) {
    return next(new Error("End time must be after start time"));
  }
  next();
});

// Dynamic status calculation for all find queries
eventSchema.post(/^find/, function (docs) {
  const now = new Date();

  if (Array.isArray(docs)) {
    docs.forEach((doc) => {
      if (now < doc.startTime) doc.status = "Upcoming";
      else if (now >= doc.startTime && now <= doc.endTime) doc.status = "Ongoing";
      else doc.status = "Completed";
    });
  } else if (docs) {
    if (now < docs.startTime) docs.status = "Upcoming";
    else if (now >= docs.startTime && now <= docs.endTime) docs.status = "Ongoing";
    else docs.status = "Completed";
  }
});

module.exports = mongoose.model("Event", eventSchema);