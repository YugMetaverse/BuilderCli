const { execSync } = require('child_process');
const os = require('os');

const checkDockerCommand = {
  linux: 'systemctl status docker',
  darwin: 'ps aux | grep -v grep | grep "Docker Desktop"',
  win32: 'docker ps -a',
};

const startDockerCommand = {
  linux: 'sudo systemctl start docker',
  darwin: 'open -a Docker',
  win32: 'docker start docker',
};

const checkDocker = () => {
  const platform = os.platform();
  try {
    const stdout = execSync(checkDockerCommand[platform], { stdio: 'pipe' }).toString();
    const isDockerRunning = stdout.includes('Up') || stdout.includes('Docker Desktop') || stdout.includes('Started Docker Application Container Engine') || stdout.includes('Active: active (running)');
      if (isDockerRunning) {
        console.log('Docker is running.');
      }
  } catch (cError) {
  
    try {
      
        console.log('Docker is not running. Starting Docker...');
        try {
          const startOutput = execSync(startDockerCommand[platform], { stdio: 'pipe' });
          console.log(startOutput.toString());
          console.log('Docker started successfully.');
        } catch (startError) {
          console.error(`Error: ${startError.message}`);
          process.exit(1);
        }
      
    } catch (checkError) {
      console.error(`Error: ${checkError.message}`);
      process.exit(1);
    }
  }
};

module.exports = checkDocker;