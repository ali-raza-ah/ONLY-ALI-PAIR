const { Storage } = require("megajs");

const auth = {
    email: 'your mega email', // Replace with your actual email
    password: 'mega password', // Replace with your actual password
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

/**
 * Uploads a file stream to MEGA
 * @param {ReadableStream} data - The readable stream (e.g., fs.createReadStream)
 * @param {string} name - Name of the file to save on MEGA
 * @returns {Promise<string>} - Resolves to the MEGA file URL
 */
const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        if (!auth.email || !auth.password || !auth.userAgent) {
            return reject(new Error("Missing required authentication fields"));
        }

        const storage = new Storage(auth, () => {
            const uploader = storage.upload({ name });

            uploader.on('complete', file => {
                file.link((err, url) => {
                    storage.close(); // Close connection
                    if (err) return reject(err);
                    resolve(url);
                });
            });

            uploader.on('error', err => {
                storage.close();
                reject(err);
            });

            data.pipe(uploader);
        });

        storage.on('error', err => {
            reject(err);
        });
    });
};

module.exports = { upload };
