const { Command, Argument, Option } = require('commander');
const checkDocker = require('../actions/docker/ensureDockerRunning');
const { pullImage } = require('../actions/docker/dockerHub');
const { runDocker, stopDocker } = require('../actions/docker/dockerRun');
const { startApp } = require('../actions/server/downloadcloud')
const availableValues = require('../configuration/availablevalues');

const runAppCommand = new Command('run')
  .description('Run Yug Applications')
  .argument('<apptype>', 'Application Type to Run: server or client')
  .argument('[action]', 'Action to perform: start, stop, restart')
  .addArgument(new Argument('[platform]', 'Run Platform:').choices(availableValues.platforms))
  .action(async (apptype, action,platform, options) => {
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
      if (action === 'start') {
         startApp(platform)
      }
      else if (action === 'stop') {

      }
    }
  });

module.exports = runAppCommand;