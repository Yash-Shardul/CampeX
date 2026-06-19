const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// ==========================
// PROTECT ROUTE
// ==========================
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// ==========================
// ROLE CHECK
// ==========================
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: "Access denied (role)" });
    }
    next();
  };
};


// ==========================
// PERMISSION CHECK
// ==========================
exports.checkPermission = (permission) => {
  return (req, res, next) => {

    // Main admin has full access
    if (req.admin.role === "main") return next();

    if (!req.admin.permissions.includes(permission)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};