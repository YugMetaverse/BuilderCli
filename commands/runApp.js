const { Command, Argument, Option } = require('commander');
const checkDocker = require('../actions/docker/ensuredockerrunning');
const {pullImage} = require('../actions/docker/dockerHub');
const {runDocker, stopDocker} = require('../actions/docker/dockerRun');

const runAppCommand = new Command('run')
  .description('Run Yug Applications')
  .argument('<apptype>', 'Application Type to Run: server or client')
  .argument('[action]', 'Action to perform: start, stop, restart')
  .action(async(apptype, action, options) => {
    if(apptype === 'server') {
      if(action === 'start') {
        checkDocker();
        pullImage('utkashx/yugserver');
        runDocker('utkashx/yugserver');
      }
      else if(action === 'stop') {
        checkDocker();
        stopDocker('yugserver');
      }
    }
 });

module.exports = runAppCommand;