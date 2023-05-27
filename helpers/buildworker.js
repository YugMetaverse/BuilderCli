const readline = require('readline');
const https = require('https');
const { Readable, PassThrough } = require('stream');

function printDots(dotCount) {
    let dots = '';
    for (let i = 0; i < dotCount; i++) {
      dots += '.';
    }
    return dots;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getServerStatus(){
    const url = 'your-public-file-url';
    const jsonStream = new PassThrough();

    let responseObj = await new Promise((resolve, reject) => {
        https.get(url, (res) => {
            res.pipe(jsonStream);
            jsonStream.on('data', (chunk) => {
                const parsedData = JSON.parse(chunk);
                resolve(parsedData);
            });
            jsonStream.on('end', () => {
                console.log('JSON stream ended');
                resolve();
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
    return responseObj;
}

async function BuildWorker()
{
    var x =0;
    let stat = {};
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    let shouldBreakLoop = false;
    process.stdin.on('keypress', (str, key) => {
      if (key.name === 'e') {
        shouldBreakLoop = true;
        process.stdin.pause(); // Stop listening for keyboard input
      }
      if (key.ctrl && key.name === 'c') {
        process.exit();
      }
    });
    while (!shouldBreakLoop) {
        for (let i = 0; i <= 10; i++) {
          process.stdout.write('Listening for Server: ' + printDots(i) + ' Press E to exit.\r');
          await sleep(500);
          if (shouldBreakLoop) break;
        }
        stat = await getServerStatus();
        if (stat.status === 'online') {
            console.log('Server is online');
            break;
        }
    }
    console.log("\n");
    console.log('Exited Successfully');
}

module.exports = BuildWorker;