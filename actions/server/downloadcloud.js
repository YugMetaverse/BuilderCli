const https = require('https');
const fs = require('fs');
const { spawn } = require("child_process");


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

const startApp = async (options) => {
  // let url = await getLatestAppUrlFromServer(platform);
  // await downloadZipFromServer(url);
  // Determine the appropriate command or script to run the executable based on the platform
  let command = '';
  switch (options.platform) {
    case 'win64':
      command = `./extracted-files/YugGAS-Windows-Shipping.exe`;
      break;
    case 'Mac':
      command = `${options.buildappdownloaddir}/${options.platform}/YugGAS.app/Contents/MacOS/YugGAS`;
      break;
    case 'linux':
      command = `./extracted-files/YugGAS-Linux-Shipping.exe`;
      break;
    default:
      throw new Error('Unsupported platform');
  }

  const args = ['-log'];
  const opts = { };
  return new Promise((resolve, reject) => {
    const builder = spawn(command, args, opts);

    builder.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });

    builder.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });

    builder.on('error', (error) => {
        console.log(`error: ${error.message}`);
        reject(error);
    });

    builder.on("close", code => {
        console.log(`child process exited with code ${code}`);
        resolve();
    });
  });
};








module.exports = {
  downloadZipFromServer,
  getLatestAppUrlFromServer,
  startApp
}