const https = require('https');
const fs = require('fs');
const { extractZip } = require('./../zip/zip')


const API_URL='https://webapi.yugverse.com'

const downloadZipFromServer = async (url) => {

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', async () => {
        const zipData = Buffer.concat(chunks);
        fs.writeFileSync('./downloaded-file.zip', zipData);
        await extractZip('./downloaded-file.zip');
        resolve(true);
      });

    }).on('error', (error) => {
      reject(error);
    });
  });
};
const getLatestAppUrlFromServer = (platform) => {
  return new Promise((resolve, reject) => {
    //default aap id is =G8S7coutUORdDg7m
    https.get(`${API_URL}/application/G8S7coutUORdDg7m/${platform}/latest`, (response) => {
      let data = [];
      response.on('data', (chunk) => {
        data.push(chunk);
      });
      response.on('end', () => {
        const {url} = JSON.parse(Buffer.concat(data).toString());
        console.log(url)
        resolve(url);
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