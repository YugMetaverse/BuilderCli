const { execSync } = require('child_process');

function dockerBuild(options) {
  let dockerRootPath = "../../assets/dockers/";
  let dockerPath = dockerRootPath + 'Dockerfile.server';
  const dockerBuildCommand = 'docker build --build-arg PACKAGED_SERVER_PATH=./Packaged/LinuxServer -t utkashx/yugserver --f '+dockerPath+' '+dockerRootPath;

  try {
    const stdout = execSync(dockerBuildCommand, { stdio: 'pipe' });
    console.log(`Docker image built successfully: ${stdout}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

module.exports = dockerBuild;
