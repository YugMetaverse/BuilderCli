const { execSync, spawnSync, spawn } = require('child_process');
const path = require('path');
const {convertUnrealPlatformNametoFolderPlatformName } = require('../../helpers/lib');
const fs = require('fs');


async function dockerBuild(options) {
  let dockerRootPath = path.normalize(process.cwd()+"/assets/dockers");
  let dockerPath = dockerRootPath + '/Dockerfile.server';
  let platform = convertUnrealPlatformNametoFolderPlatformName(options);
  const buildfolder = path.join(options.archivedirectory, platform);

  let builddockerpath = options.archivedirectory + '/Dockerfile.server';
  fs.copyFileSync(dockerPath, builddockerpath);

  const dockerBuildCommand = 'docker';
  const args = ['build', '--build-arg', 'PACKAGED_SERVER_PATH=./'+platform, '-t', 'utkashx/yugserver', '-f', 'Dockerfile.server', '.'];
  const opts = { cwd: '/home/utkarsh/Unreal/Build' };
  
  return new Promise((resolve, reject) => {
    const builder = spawn(dockerBuildCommand, args, opts);

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

}

module.exports = dockerBuild;
