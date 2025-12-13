import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    // read token defensively
    const token = req.cookies && req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode && tokenDecode.id) {
            // attach user id to req.userId instead of mutating req.body
            req.userId = tokenDecode.id;
            return next();
        }
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    } catch (error) {
        console.error("Auth User error:", error.message || error);
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

export default authUser;
