import { verifyJwt } from '../utils/jwt.js';
export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 'failed', message: 'Unauthorized', messageLogin: "Please Login !" });
    }
    const token = authHeader.split(' ')[1];
    console.log(token, "ye he token");
    try {
        const decoded = verifyJwt(token);
        if (!decoded) {
            return res.status(401).json({ status: 'failed', message: 'Invalid or expired token', messageLogin: "Please Login !" });
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error('Auth middleware error', err);
        return res.status(500).json({ status: 'failed', message: 'Internal server error' });
    }
};
