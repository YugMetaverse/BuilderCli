const https = require('https');
const url = require('url');
const fs = require('fs');
const cliProgress = require('cli-progress');
const color = require('colors-cli/toxic');
const colors = require('ansi-colors');
const loading = require('loading-cli');
const path = require('path');
const {convertUnrealPlatformNametoFolderPlatformName} = require('../../helpers/lib')

const SIGN_APIURL = 'https://webapi.yugverse.com/files/signed-url';
const API_URL = 'https://webapi.yugverse.com';
async function getSignedUrl(fileextension) {
    return new Promise((resolve, reject) => {
        const requestUrl = new URL(SIGN_APIURL);
        const load = loading("Starting Upload on Server".blue).start();
        requestUrl.searchParams.append('filename', fileextension);
        https.get(requestUrl.href, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const result = JSON.parse(data);
                load.stop();
                if (!result.signedUrl) {
                    console.error("Error Creating File on Cloud Storage");
                    process.exit(1);
                }
                resolve(result);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

const uploadPlugin = async (options) => {
    const { signedUrl, uploadedUrl } = await getSignedUrl("*.pak");
    options['uploadedurl'] = uploadedUrl;
    let platformName = convertUnrealPlatformNametoFolderPlatformName(options);
    const pluginPathName = path.join(options.projectbasepath, 'Plugins', options.pluginname, 'Saved', 'StagedBuilds', platformName, options.projectname, 'Plugins', options.pluginname, 'Content', 'Paks', platformName, `${options.pluginname}${options.projectname}-${platformName}.pak`);
    options["pakpath"] = pluginPathName;
    await uploadFileToSignedUrl(signedUrl, pluginPathName);
    await updatePluginUploadDataOnServer(options);
}

const uploadApp = async (options) => {
    const { signedUrl, uploadedUrl } = await getSignedUrl("*.zip");
    options['uploadedurl'] = uploadedUrl;
    await uploadFileToSignedUrl(signedUrl, options.appzipurl);
    await updateAppUploadDataOnServer(options);
}


// This is generic Function to upload any file to a signed url
function uploadFileToSignedUrl(cloudstoragesignedurl, localfilepath) {
    let promiseResolved = false;
    return new Promise(async (resolve, reject) => {
        try {
            // Using a stream to read the file
            const readableStream = fs.createReadStream(localfilepath);
            const fileSize = fs.statSync(localfilepath).size;
            let uploadedBytes = 0;
            // Create a progress bar
            const progressBar = new cliProgress.SingleBar({
                format: 'Upload Progress |' + colors.yellowBright('{bar}') + '| {percentage}% | {value}/{total}',
                barCompleteChar: '\u2588',
                barIncompleteChar: '-',
                hideCursor: true
            });
            progressBar.start(fileSize, 0);


            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/octet-stream' },
            };

            const request = https.request(cloudstoragesignedurl, requestOptions, (response) => {
                if (response.statusCode === 200) {
                    progressBar.stop();
                    console.log('\nFile uploaded successfully');
                    promiseResolved = true;
                    resolve(true);
                } else {
                    console.error(`\nError uploading file: ${response.statusCode}`);
                    reject(response.statusCode);
                }
            });

            request.on('error', (error) => {
                console.error('Error uploading file:', error);
                reject(error);
            });
            
            request.on('timeout', () => {
                request.abort();
                reject(new Error('Request timed out'));
            });

            request.on('close', () => {
                console.log('File upload completed');
                if (!promiseResolved) {
                    progressBar.stop();
                    resolve(true);
                }
            });

            request.on('drain', ()=>{
                readableStream.resume();
            });

            

            readableStream.on('data', (chunk) => {
                const canWriteMore = request.write(chunk);
                uploadedBytes += chunk.length;
                progressBar.update(uploadedBytes);

                if(!canWriteMore) {
                    readableStream.pause();
                }
            });

            readableStream.on('end', () => {
                request.end();
            });

            readableStream.on('error', (error) => {
                console.error('Error reading file:', error);
                reject(error)
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            reject(error)
        }
    })

}


async function updateAppUploadDataOnServer(options) {
    try {
        const url = new URL(`${API_URL}/application/old`);
        const data = JSON.stringify(options);
        const load = loading({
            "text":"Updating App On Server",
            "color":"yellow",
            "frames":["◰", "◳", "◲", "◱"]
          }).start();

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            hostname: url.hostname,
            path: url.pathname,
            protocol: url.protocol,
            port: url.port
        };

        return new Promise((resolve, reject) => {
            const req = https.request(requestOptions, (res) => {
                let responseBody = '';

                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    load.stop();
                    const jsonResponse = JSON.parse(responseBody);
                    console.log(`Data Updated on Server: ${jsonResponse.message}. Url is ${data.uploadedurl} \n`);
                    resolve(jsonResponse);
                });
            });

            req.on('error', (error) => {
                console.error(error);
                reject(error);
            });

            req.write(data);
            req.end();
        });
    } catch (error) {
        console.log("Error in Updating File", error);
    }
}

async function updatePluginUploadDataOnServer(options) {
    try {
        const url = new URL(`${API_URL}/items/uploadplugin`);
        let uploadattr = {...options};
        uploadattr["pluginid"] = "DGcEO9Ly6JcwVBVX";
        uploadattr["platform"] = convertUnrealPlatformNametoFolderPlatformName(options);
        const data = JSON.stringify({ "plugin": uploadattr});
        const load = loading({
            "text":"Updating Plugin On Server",
            "color":"yellow",
            "frames":["◰", "◳", "◲", "◱"]
          }).start();

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            hostname: url.hostname,
            path: url.pathname,
            protocol: url.protocol,
            port: url.port
        };

        return new Promise((resolve, reject) => {
            const req = https.request(requestOptions, (res) => {
                let responseBody = '';

                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    load.stop();
                    const jsonResponse = JSON.parse(responseBody);
                    console.log(`Data Updated on Server: ${jsonResponse} \n`);
                    resolve(jsonResponse);
                });
            });

            req.on('error', (error) => {
                console.error(error);
                reject(error);
            });

            req.write(data);
            req.end();
        });
    } catch (error) {
        console.log("Error in Updating Pligin", error);
    }
   
    
}


module.exports = {
    uploadPlugin,
    uploadApp
}