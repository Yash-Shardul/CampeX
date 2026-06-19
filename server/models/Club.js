const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    type: {
      type: String,
      enum: ["general", "department"],
      required: true,
    },

    department: {
      type: String,
      default: null,
    },

    category: String,

    president: String,

    contactEmail: String,

    contactNumber: {
      type: String,
    },

    logo: {
      type: String,   // store image URL
    },
    
    socialLinks: {
    instagram: { type: String },
    website: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
  },

    activityImages: [
      {
        type: String  // multiple image URLs
      }
    ],

    activeMembersCount: {
      type: Number,
      default: 0,  // starts with 0
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);