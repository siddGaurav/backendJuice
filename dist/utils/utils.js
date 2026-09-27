import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
export async function genHash(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}
export async function compare(hash, password) {
    return bcrypt.compare(password, hash);
}
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
