const https = require('https');
const fs = require('fs');
const https = require('https');

const API_URL='https://webapi.yugverse.com'
const { extractZip } = require('./../zip/zip')

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
const getLatestAppUrlFromServer = () => {
  return new Promise((resolve, reject) => {
    https.get(`${API_URL}/yug-app`, (response) => {
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

const startApp = async (platform) => {
  let url = await getLatestAppUrlFromServer(platform);
  await downloadZipFromServer(url);
  // Determine the appropriate command or script to run the executable based on the platform
  const command = '';
  switch (platform) {
    case 'Windows':
      command = `./extracted-files/YugGAS-Windows-Shipping.exe`;
      break;
    case 'Mac':
      command = `./extracted-files/YugGAS-Mac-Shipping.app`;
      break;
    case 'Linux':
      command = `./extracted-files/YugGAS-Linux-Shipping.exe`;
      break;
    default:
      throw new Error('Unsupported platform');
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running executable: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }
    console.log(`Executable started successfully: ${stdout}`);
  });
};








module.exports = {
  downloadZipFromServer,
  getLatestAppUrlFromServer,
  startApp
}