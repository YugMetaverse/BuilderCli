const fs = require('fs');
const https = require('https');
const FormData = require('form-data');
const cliProgress = require('cli-progress');
const colors = require('ansi-colors');
const path = require('path');
const { uploadFileToCloud } = require('./upload-cloud')
// http://127.0.0.1:8080/
const API_URL = 'webapi.yugverse.com';

//TODO:move url to config
//Users/utkarshshukla/yugue5/Plugins/India_map/Saved/StagedBuilds/Mac/YugGAS/Plugins/India_map/Content/Paks/Mac/india_mapYugGAS-Mac.pak
//"C:\Users\utksh\OneDrive\Desktop\india_map\Saved\StagedBuilds\Windows\YugGAS\Plugins\india_map\Content\Paks\Windows\india_mapYugGAS-Windows.pak"
const uploadPlugin = async (options) => {
    let uploadedSize = 0;
    let platformName = (options.platform === 'win32') ? 'Windows' : options.platform;
    const buildPackPath = path.join(options.projectbasepath, 'Plugins', options.pluginname, 'Saved', 'StagedBuilds', platformName, options.projectname, 'Plugins', options.pluginname, 'Content', 'Paks', platformName, `${options.pluginname}${options.projectname}-${platformName}.pak`);
    const fileSize = fs.statSync(buildPackPath).size;
    const fileStream = fs.createReadStream(buildPackPath);


    const progressBar = new cliProgress.SingleBar({
        format: 'Upload Progress |' + colors.yellowBright('{bar}') + '| {percentage}% | {value}/{total}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '-',
        hideCursor: true
    });
    progressBar.start(fileSize, 0);


    const formData = new FormData();
    formData.append('plugin', JSON.stringify(options));
    formData.append('file', fileStream, { filename: 'plugin.pak' });
    formData.on('data', (chunk) => {
        uploadedSize += chunk.length;
        progressBar.update(uploadedSize);
    });

    const response = await new Promise((resolve, reject) => {
        const request = https.request({
            hostname: API_URL,
            path: '/items/uploadplugin',
            method: 'POST',
            headers: formData.getHeaders(),
            ...options,
        });
        request.on('response', (response) => {
            let responseData = '';
            response.on('data', (chunk) => {
                responseData += chunk;
            });
            response.on('end', () => {
                console.log('\nRequest complete.');
                resolve(responseData);
            });
        });

        request.on('error', (error) => {
            console.error(`Error with request: ${error}`);
            reject(error);
        });

        formData.pipe(request);

        request.on('close', () => {
            progressBar.stop();
            console.log('File upload completed');
            resolve();
        });
    });

    return response;
};


const uploadApp = async (options) => {
    try {
        let uploadedSize = 0;
        const fileSize = fs.statSync(options.appzipurl).size;
        const fileStream = fs.createReadStream(options.appzipurl);
        const { uploadedUrl } = await uploadFileToCloud('build.zip', options.appzipurl);
        options.appUrl = uploadedUrl;
        const progressBar = new cliProgress.SingleBar({
            format: 'Upload Progress |' + colors.yellowBright('{bar}') + '| {percentage}% | {value}/{total}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '-',
            hideCursor: true
        });



        progressBar.start(fileSize, 0);

        const formData = new FormData();
        formData.append("application", JSON.stringify(options))
        // formData.append('file', fileStream, { filename: 'build.zip' });
        formData.on('data', (chunk) => {
            uploadedSize += chunk.length;
            const percentage = (uploadedSize / fileSize) * 100;
            // process.stdout.write(`\rUploaded ${percentage.toFixed(2)}%`);
            progressBar.update(uploadedSize);
        });

        const resp = await new Promise((resolve, reject) => {

            const request = https.request({
                hostname: API_URL,
                path: '/application/old',
                method: 'POST',
                headers: formData.getHeaders(),
                ...options,
            });

            request.on('response', (response) => {
                let responseData = '';
                response.on('data', (chunk) => {
                    responseData += chunk;
                });
                response.on('end', () => {
                    console.log('\n \n Request complete. with response' + responseData + '\n \n');
                    resolve(responseData);
                });
            });

            request.on('error', (error) => {
                console.error(`Error with request: ${error}`);
                reject(error);
            });

            formData.pipe(request);

            request.on('close', () => {
                progressBar.stop();
                console.log('File upload completed');
                resolve();
            });
        });

        return resp;
    } catch (error) {
        console.log("Error in Updating File", error);
    }
};





module.exports = {
    uploadPlugin,
    uploadApp,
};



