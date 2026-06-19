module.exports = (requiredPermission) => {
  return (req, res, next) => {

    // Main admin has full access
    if (req.admin.role === "main") {
      return next();
    }

    if (!req.admin.permissions.includes(requiredPermission)) {
      return res
        .status(403)
        .json({ message: "Access denied. Permission required." });
    }

    next();
  };
};