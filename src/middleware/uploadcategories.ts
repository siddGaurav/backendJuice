import multer from 'multer';

const storage = multer.memoryStorage();
export const catFile = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});


const productStorgae = multer.memoryStorage();
export const productFile = multer({
        storage: productStorgae, 
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})