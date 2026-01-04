const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  try {
    const token = authHeader.split(" ")[1];
    // Verify token using secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user ID to the request object for use in subsequent routes
    req.userId = decoded.id; 
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};