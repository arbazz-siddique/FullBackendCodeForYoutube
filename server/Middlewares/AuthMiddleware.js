import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔓 Decoded user:", decodedData); 
    req.userId = decodedData?.id;  // ✅ Corrected here

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token", error: error.message });

  }
};

export default auth;
