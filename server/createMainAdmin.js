require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const createMainAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingMain = await Admin.findOne({ role: "main" });

    if (existingMain) {
      console.log("❌ Main admin already exists");
      process.exit();
    }

    const mainAdmin = await Admin.create({
      name: "Main Admin",
      email: "mainadmin@gmail.com",
      password: "123456", // will auto-hash
      role: "main",
      permissions: [], // main doesn't need permissions
    });

    console.log("✅ Main Admin Created:");
    console.log(mainAdmin);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createMainAdmin();