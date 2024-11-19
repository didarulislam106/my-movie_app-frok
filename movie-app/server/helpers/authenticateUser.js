import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; // Attach user information to request
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};