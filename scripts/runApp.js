const { spawn } = require("child_process");

const startApp = async (options) => {
    // let url = await getLatestAppUrlFromServer(platform);
    // await downloadZipFromServer(url);
    // Determine the appropriate command or script to run the executable based on the platform
    let command = '';
    switch (options.platform) {
      case 'win64':
        command = `${options.buildappdownloaddir}/Windows/YugGAS.exe`;
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
    startApp
}