import jwt from "jsonwebtoken";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";
const getJwtSecret = () => {
    return process.env.JWT_SECRET || "t6d_6Gf^2**145@62$$&1kH@";
};
export function signJwt(payload, expiresIn) {
    try {
        const secret = getJwtSecret();
        const exp = (expiresIn ?? JWT_EXPIRE ?? "1d");
        const options = {
            expiresIn: exp
        };
        return jwt.sign(payload, secret, options);
    }
    catch (err) {
        return null;
    }
}
export const verifyJwt = (token) => {
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        return decoded;
    }
    catch (err) {
        return null;
    }
};
