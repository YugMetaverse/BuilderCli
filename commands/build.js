const { Command } = require('commander');
const inquirer = require('inquirer');
const { buildApplication } = require('../buildscripts/buildApp');
const SwitchBranch = require('../actions/switchBranch');

const buildCommand = new Command('build')
  .description('Build the Yug Application. This internaly interfaces with the Unreal CLI.')
  .argument('<buildType>', 'Type to Build: Server, Client, Plugin')
  .argument('<buildEnvironment>', 'Environment to Build: Shipping, Development')
  .option('--remote ', 'Remote Build by Downloading the Repository from Scratch')
  .option('-b, --branch <char>', 'Branch to Build')
  .option('-t, --tag <char>', 'Tag of the Branch to Build')
  .action(async(buildType, buildEnvironment, options) => {
    console.log(options);
    if(options.Remote){
      console.log("hello");
    }
    if(options.branch)
    {
      await SwitchBranch(options.branch);
    }

    // buildApplication();
  
  });

module.exports = buildCommand;
