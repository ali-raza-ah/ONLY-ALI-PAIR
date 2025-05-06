const mega = require("megajs");

const auth = {
    email: 'jakejaspns580@gmail.com',
    password: 'Septorch111',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        if (!auth.email || !auth.password || !auth.userAgent) {
            return reject(new Error("Missing required authentication fields"));
        }

        console.log("Initializing MEGA storage...");

        const storage = mega(auth);

        storage.on('ready', () => {
            console.log("MEGA storage is ready. Uploading file...");

            const file = storage.upload({ name: name });

            data.pipe(file);

            file.on('complete', () => {
                console.log("Upload complete. Getting link...");

                file.link((err, url) => {
                    storage.close();

                    if (err) {
                        return reject(err);
                    }

                    resolve(url);
                });
            });

            file.on('error', (err) => {
                storage.close();
                reject(err);
            });
        });

        storage.on('error', (err) => {
            reject(new Error("Storage error: " + err.message));
        });
    });
};

module.exports = { upload };
