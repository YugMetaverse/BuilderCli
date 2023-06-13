const https = require('https');
const fs = require('fs');


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

const startApp = async (platform) => {
  let url = await getLatestAppUrlFromServer(platform);
  await downloadZipFromServer(url);
  // Determine the appropriate command or script to run the executable based on the platform
  const command = '';
  switch (platform) {
    case 'windows':
      command = `./extracted-files/YugGAS-Windows-Shipping.exe`;
      break;
    case 'mac':
      command = `./extracted-files/YugGAS-Mac-Shipping.app`;
      break;
    case 'linux':
      command = `./extracted-files/YugGAS-Linux-Shipping.exe`;
      break;
    default:
      throw new Error('Unsupported platform');
  }

  exec(`open ${command}` , (error, stdout, stderr) => {
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