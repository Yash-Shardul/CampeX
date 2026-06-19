const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// LOGIN
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(400).json({ message: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  res.json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions,
    token: generateToken(admin._id),
  });
};

// CREATE SUB ADMIN (Main Admin Only)
exports.createSubAdmin = async (req, res) => {
  const { name, email, password, permissions } = req.body;

  const admin = await Admin.create({
    name,
    email,
    password,
    role: "sub",
    permissions,
  });

  res.status(201).json(admin);
};

// DELETE ADMIN
exports.deleteAdmin = async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ message: "Admin deleted" });
};

// GET ALL ADMINS
exports.getAdmins = async (req, res) => {
  const admins = await Admin.find().select("-password");
  res.json(admins);
};