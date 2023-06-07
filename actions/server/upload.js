const fs = require('fs');
const https = require('https');
const FormData = require('form-data');
const { zipAppFolder } = require('../zip/zip');
const API_URL = 'webapi.yugverse.com';

//TODO:move url to config
//"C:\Users\utksh\OneDrive\Desktop\india_map\Saved\StagedBuilds\Windows\YugGAS\Plugins\india_map\Content\Paks\Windows\india_mapYugGAS-Windows.pak"
const uploadPlugin = async (options) => {
    const path = require('path');
    let appName = "YugGAS"
    let platformName = (options.platform === 'win32') ? 'Windows' : options.platform;
    const buildPackPath = path.join(options.stagingdirectory, platformName, appName, 'Plugins', options.pluginname, 'Content', 'Paks', platformName, `${options.pluginname}${appName}-${platformName}.pak`);
    console.log(buildPackPath)
    const buildPack = fs.readFileSync(buildPackPath);
    const formData = new FormData();
    formData.append('plugin', JSON.stringify(options));
    formData.append('file', buildPack, { filename: 'plugin.pak' });
    const requestOptions = {
        hostname: API_URL,
        path: '/items/uploadplugin',
        method: 'POST',
        headers: formData.getHeaders(),
        ...options,
    };
    console.log(requestOptions);
    const response = await new Promise((resolve, reject) => {
        const request = https.request(requestOptions, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                console.log(data)
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
    try {
        const zipurl = await zipAppFolder(options);
        const buildPack = fs.readFileSync(zipurl);
        const formData = new FormData();
        formData.append("application", JSON.stringify(options))
        formData.append('file', buildPack, { filename: 'build.zip' });
        const requestOptions = {
            hostname: API_URL,
            path: '/application/old',
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
                    console.log(data);
                    console.log('Request complete.', data);
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
    } catch (error) {
        console.log("Error in Updating File", error);
    }
};

module.exports = {
    uploadPlugin,
    uploadApp,
};



