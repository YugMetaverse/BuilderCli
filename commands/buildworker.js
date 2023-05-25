const { Command } = require('commander');
const BuildWorker = require('../helpers/buildworker');
const config = require('../configuration/config');
const getKeys = require('../configuration/keys');



const buildWorker = new Command('buildworker')
  .description('Build the Yug Application. This internaly interfaces with the Unreal CLI.')
  .argument('<test>', 'string to split')
  .argument('[test]', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action(async(str, test, options) => {
    let configData = await config.confirmConfig(getKeys("buildWorker"));
    await BuildWorker();
  });

module.exports = buildWorker;