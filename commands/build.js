const { Command } = require('commander');
const inquirer = require('inquirer');
const { buildApplication } = require('../buildscripts/buildApp');
const SwitchBranch = require('../actions/switchBranch');
const SwitchTag = require('../actions/switchTag');

const buildCommand = new Command('build')
  .description('Build the Yug Application. This internaly interfaces with the Unreal CLI.')
  .argument('[buildType]', 'Type to Build: Server, Client, Plugin')
  .argument('[buildEnvironment]', 'Environment to Build: Shipping, Development')
  .option('-r, --remote ', 'Remote Build by Downloading the Repository from Scratch')
  .option('-g, --gitswitch ', 'Enable Git Actions like Branch and Tag Switch')
  .option('-b, --branch <char>', 'Branch to Build')
  .option('-t, --tag <char>', 'Tag of the Branch to Build')
  .action(async(buildType, buildEnvironment, options) => {
    console.log(options);
    options["buildType"] = buildType;
    options["buildEnvironment"] = buildEnvironment;
    if(options.branch && options.tag)
    {
      throw new Error("Cannot have both branch and tag");
    }
    if(options.remote){
      console.log("hello");
    }
    if(options.branch)
    {
      await SwitchBranch(options.branch);
    }
    if(options.tag)
    {
      console.log("tags");
    }

    // buildApplication();
  
  });

module.exports = buildCommand;
