import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return process.env.JWT_SECRET;
};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired session" });
  }
};

export default authMiddleware;


