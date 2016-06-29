/**
 * Created by Administrator on 2016/6/30.
 */
const urllib = require('urllib');

const request = (path, options) => {
    options = options || {};
    const url = `${path}`;
    return new Promise((resolve, reject) => {
        urllib.request(url, options)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            })
    });
};

module.exports = request;