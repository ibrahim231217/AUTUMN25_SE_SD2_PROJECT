// Admin-only middleware
const isAdmin = (req, res, next) => {
  try {
    // Check if user exists in request
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login first",
      });
    }

    // Check if user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only admins can access this resource",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking admin permissions",
    });
  }
};

module.exports = { isAdmin };
