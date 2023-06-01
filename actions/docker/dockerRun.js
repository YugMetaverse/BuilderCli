const { execSync } = require('child_process');


function runDocker(imageName) {
    try {
        const output = execSync(`docker run -p 7777:7777/udp -p 9080:9080 --name yugserver -d ${imageName}`);
        console.log(`Docker image ${imageName} started`);
    } catch (error) {
        console.error(`Error running Docker image: ${error.message}`);
    }
}

function stopDocker(imageName) {
    try {
        const output = execSync(`docker stop ${imageName}`);
        console.log(`Docker image ${imageName} stopped`);
    } catch (error) {
        console.error(`Error stopping Docker image: ${error.message}`);
    }
    try {
        const output = execSync(`docker rm ${imageName}`);
        console.log(`Docker image ${imageName} removed`);
    } catch (error) {
        console.error(`Error removing Docker image: ${error.message}`);
    }
}


module.exports = { runDocker, stopDocker };