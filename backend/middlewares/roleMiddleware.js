const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user found" });
    }

    if (!req.user.role) {
      return res.status(403).json({ success: false, message: "Forbidden: User role not found. Please log in again." });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ success: false, message: "Forbidden: Access denied" });
    }

    next();
  };
};

export default roleMiddleware;
