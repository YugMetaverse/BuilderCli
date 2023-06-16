const { Command, Argument, Option } = require('commander');
const checkDocker = require('../actions/docker/ensureDockerRunning');
const { pullImage } = require('../actions/docker/dockerHub');
const { runDocker, stopDocker } = require('../actions/docker/dockerRun');
const { startApp } = require('../scripts/runApp')
const availableValues = require('../configuration/availablevalues');
const config = require('../configuration/config');
const getKeys = require('../configuration/keys');

const runAppCommand = new Command('run')
  .description('Run Yug Applications')
  .argument('<apptype>', 'Application Type to Run: server or client')
  .argument('[action]', 'Action to perform: start, stop, restart')
  .addArgument(new Argument('[platform]', 'Platform Name :').choices(availableValues.platforms))
  .addOption(new Option('-n, --nodownload', 'Do not Download'))
  .action(async (apptype, action, platform, options) => {
    options["commandname"] = "run";
    options["apptype"] = apptype;
    if (action) { options["action"] = action; }
    if (platform) { options["platform"] = platform; }
    let mergedData = {};
    let keys = getKeys(options);
    let configData = await config.confirmConfig(keys, mergedData);


    if (apptype === 'server') {
      if (action === 'start') {
        checkDocker();
        pullImage('utkashx/yugserver');
        runDocker('utkashx/yugserver');
      }
      else if (action === 'stop') {
        checkDocker();
        stopDocker('yugserver');
      }
    }
    else if (apptype === 'app') {
      await startApp(configData)
    }
  });

module.exports = runAppCommand;