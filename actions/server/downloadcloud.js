const https = require('https');
const fs = require('fs');
const https = require('https');

const downloadZipFromServer = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', () => {
        const zipData = Buffer.concat(chunks);
        fs.writeFileSync('./downloaded-file.zip', zipData);
        resolve();
      });

    }).on('error', (error) => {
      reject(error);
    });
  });
};

const getLatestAppUrlFromServer = () => {
  return new Promise((resolve, reject) => {
    https.get('https://your-api-url', (response) => {
      let data = [];
      response.on('data', (chunk) => {
        data.push(chunk);
      });
      response.on('end', () => {
        const appUrl = JSON.parse(Buffer.concat(data).toString());
        resolve(appUrl);
      });

    }).on('error', (error) => {
      reject(error);
    });
  });
};








module.exports = {
  downloadZipFromServer,
  getLatestAppUrlFromServer
}