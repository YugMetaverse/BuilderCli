const { Command } = require('commander');
const { buildApplication } = require('../buildscripts/buildApp');
const buildPlugin = require('../buildscripts/buildPlugin');
const buildRelease = require('../buildscripts/buildRelease');
const SwitchBranch = require('../actions/switchBranch');
const SwitchTag = require('../actions/switchTag');
const config = require('./configuration/config');
const getKeys = require('./configuration/keys');

const buildAppCommand = new Command('buildapp')
  .description('Build the Yug Application. This internaly interfaces with the Unreal CLI.')
  .argument('[buildType]', 'Type to Build: Server, Client, Plugin')
  .argument('[buildEnvironment]', 'Environment to Build: Shipping, Development')
  .option('-r, --remote ', 'Remote Build by Downloading the Repository from Scratch')
  .option('-g, --gitswitch ', 'Enable Git Actions like Branch and Tag Switch')
  .option('-b, --branch <char>', 'Branch to Build')
  .option('-t, --tag <char>', 'Tag of the Branch to Build')
  .action(async(buildType, buildEnvironment, options) => {
    options["buildType"] = buildType;
    options["buildEnvironment"] = buildEnvironment;
    if(options.branch && options.tag)
    {
      throw new Error("Cannot have both branch and tag");
    }
    let configData = await config.confirmConfig(getKeys("buildApp"));

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

    // buildApplication(configData);
  
  });

module.exports = buildAppCommand;
