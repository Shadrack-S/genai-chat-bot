import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.body.userDetails = decoded;
        console.log("userDetails",req.body.userDetails)
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}