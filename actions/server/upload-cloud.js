const https = require('https');
const url = require('url');
const fs = require('fs');
const cliProgress = require('cli-progress');

// const apiUrl = 'https://your_cloud_run_service_url/signed-url';
const apiUrl = 'https://webapi.yugverse.com/files/signed-url';
async function getSignedUrl(filename) {
    return new Promise((resolve, reject) => {
        const requestUrl = new URL(apiUrl);
      
        requestUrl.searchParams.append('filename', filename);
        console.log(requestUrl);
        https.get(requestUrl.href, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const result = JSON.parse(data);
                resolve(result.signedUrl);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}
async function uploadFileToCloud(filename, filePath) {
    return new Promise(async (resolve, reject) => {
        try {
            const { signedUrl, uploadedUrl } = await getSignedUrl(filename);
            if (!signedUrl) {
                console.error('Failed to get signed URL');
                reject('Failed to get signed URL')
            }

            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/octet-stream' },
            };

            const request = https.request(signedUrl, requestOptions, (response) => {
                if (response.statusCode === 200) {
                    progressBar.stop();

                    console.log('\nFile uploaded successfully');
                    resolve({ uploadedUrl })
                } else {
                    reject(response.statusCode)
                    console.error(`\nError uploading file: ${response.statusCode}`);
                }
            });

            request.on('error', (error) => {

                console.error('Error uploading file:', error);
                reject(error)
            });

            // Using a stream to read the file
            const readableStream = fs.createReadStream(filePath);
            const fileSize = fs.statSync(filePath).size;
            let uploadedBytes = 0;

            // Create a progress bar
            const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
            progressBar.start(fileSize, 0);

            readableStream.on('data', (chunk) => {
                request.write(chunk);
                uploadedBytes += chunk.length;
                progressBar.update(uploadedBytes);
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


module.exports = {
    uploadFileToCloud
}
// Example usage
// const filename = 'test.bin';
// const filePath = 'path/to/test.bin';

// uploadFile(filename, filePath);