const https = require("https");

const getApi = options => {
    return new Promise((resolve, reject) => {
        const getRequest = https
            .get(options, data => {
                const result = [];

                data.on("data", chunk => {
                    result.push(chunk);
                });

                data.on("end", () => {
                    try {
                        const jsonData = JSON.parse(result);
                        resolve(jsonData);
                    } catch (error) {
                        reject(error);
                    }
                });
            })
            .on("error", error => {
                reject(error);
            });
        getRequest.end();
    });
};

export default getApi;
