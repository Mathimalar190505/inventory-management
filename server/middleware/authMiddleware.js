import jwt from "jsonwebtoken";
import User from "../models/User.js";
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    console.log("Extracted Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const userId = decoded.id || decoded.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();

  } catch (error) {
    console.error("Middleware error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


export default authMiddleware;