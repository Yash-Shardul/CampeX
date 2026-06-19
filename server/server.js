const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middleware FIRST
app.use(cors());
app.use(express.json());

// Routes
const eventRoutes = require("./routes/eventRoutes");
const clubRoutes = require("./routes/clubRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/events", eventRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Events & Clubs API Running...");
});

// Connect MongoDB (Skip in Test Environment)
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
}

module.exports = app;

if (require.main === module) {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
