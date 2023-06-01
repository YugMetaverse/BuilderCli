const { execSync } = require('child_process');

const dockerHubUsername = "utkashx";
const dockerHubAccessToken = "dckr_pat_hM1ShvRS-Y5J2n6RG8q97ZldLlU";


const dockerTagImageCommand = 'docker tag YugServer docker_hub_username/repository_name:tag';
const dockerPushCommand = 'docker push utkashx/yugserver';
const dockerLoginCommand = `echo "${dockerHubAccessToken}" | docker login -u ${dockerHubUsername} --password-stdin`;

const loginToDockerHub = () => {
  try {
    const output = execSync(dockerLoginCommand, { stdio: 'pipe' });
    console.log(output.toString());
    console.log('Logged in to Docker Hub');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

const tagImage = (imageName, repositoryName, tag) => {
    try {
      execSync(`docker tag ${imageName} ${repositoryName}:${tag}`, { stdio: 'pipe' });
      console.log(`Tagged image ${imageName} with ${repositoryName}:${tag}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  };
  
  const pushImage = (repositoryName) => {
    try {
      execSync(`docker push ${repositoryName}`, { stdio: 'pipe' });
      console.log(`Pushed image ${repositoryName} to Docker Hub`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  };

  const pullImage = (imageName) => {
    try {
        execSync(`docker pull ${imageName}`, { stdio: 'pipe' });
        console.log(`Pulled image ${imageName} from Docker Hub`);
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
}

const removeImageLocally = (imageName) => {
    try {
      execSync(`docker rmi ${imageName}`);
      console.log(`Image ${imageName} removed successfully.`);
    } catch (error) {
      console.error(`Error removing image: ${error.message}`);
    }
};

// loginToDockerHub();
// // tagImage('local_image_name', 'docker_hub_username/repository_name', 'tag');
// pushImage('utkashx/yugserver');
// removeImageLocally('utkashx/yugserver');

module.exports = {
    loginToDockerHub,
    pushImage,
    pullImage,
    removeImageLocally
}