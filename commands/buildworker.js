const { Command } = require('commander');
const readline = require('readline');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const buildWorker = new Command('buildworker')
  .description('Build the Yug Application. This internaly interfaces with the Unreal CLI.')
  .argument('<test>', 'string to split')
  .argument('[test]', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action(async(str, test, options) => {
    var x =0;
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    let shouldBreakLoop = false;
    process.stdin.on('keypress', (str, key) => {
      if (key.name === 'k') {
        shouldBreakLoop = true;
        process.stdin.pause(); // Stop listening for keyboard input
      }
      if (key.ctrl && key.name === 'c') {
        process.exit();
      }
    });
    while (!shouldBreakLoop) {
      process.stdout.write('hello: ' + x + ' Press K to exit.' + '\r');
        x++;
      await sleep(500);
    }
    console.log("");
    console.log('Loop stopped');
  });

module.exports = buildWorker;