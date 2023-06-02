const fs = require('fs');
const https = require('https');
const FormData = require('form-data');

const API_URL = 'https://webapi.yugverse.com';
//TODO:move url to config


const uploadPlugin = async (options) => {
    const buildPackPath = `${options.stagingdirectory}/${options.pluginname}/${options.platform}.pak`;
    const buildPack = fs.readFileSync(buildPackPath);
    const formData = new FormData();

    formData.append('file', buildPack, { filename: 'plugin.pak' });
    const requestOptions = {
        hostname: API_URL,
        path: '/upload',
        method: 'POST',
        headers: formData.getHeaders(),
        ...options,
    };

    const response = await new Promise((resolve, reject) => {
        const request = https.request(requestOptions, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                console.log('Request complete.');
                resolve(data);
            });
        });

        request.on('error', (error) => {
            console.error(`Error with request: ${error}`);
            reject(error);
        });

        formData.pipe(request);
    });

    return response;
};


const uploadApp = async (options) => {
    const buildPackPath = `${options.archivedirectory}`;
    const buildPack = fs.readFileSync(buildPackPath);
    const formData = new FormData();

    formData.append('file', buildPack, { filename: 'build.pak' });
    const requestOptions = {
        hostname: API_URL,
        path: '/upload',
        method: 'POST',
        headers: formData.getHeaders(),
        ...options,
    };

    const response = await new Promise((resolve, reject) => {
        const request = https.request(requestOptions, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                console.log('Request complete.');
                resolve(data);
            });
        });
        request.on('error', (error) => {
            console.error(`Error with request: ${error}`);
            reject(error);
        });
        formData.pipe(request);
    });

    return response;
};

module.exports = {
    uploadPlugin,
    uploadApp,
};
