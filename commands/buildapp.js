const { Command, Argument, Option } = require('commander');
const { buildApplication } = require('../buildscripts/buildApp');
const buildPlugin = require('../buildscripts/buildPlugin');
const gitActions = require('../actions/git/gitActions');
const config = require('../configuration/config');
const getKeys = require('../configuration/keys');
const availableValues  = require('../configuration/availablevalues');
const { validatebuildcli } = require('../helpers/validation');


const buildAppCommand = new Command('buildapp')
  .description('Build the Yug Application. This internaly interfaces with the Unreal CLI.')
  .addArgument(new Argument('<buildtype>', 'Type to Build:').choices(availableValues.buildtype))
  .addArgument(new Argument('<buildmodule>', 'Build Module:').choices(availableValues.buildmodule))
  .addOption(new Option('-b, --buildconfig <buildconfig>', 'Build Configuration:').choices(availableValues.buildconfig))
  .option('-r, --remote ', 'Remote Build by Downloading the Repository from Scratch')
  .option('-g, --gitswitch ', 'Enable Git Actions like Branch and Tag Switch')
  .option('-b, --branch <char>', 'Branch to Build')
  .option('-t, --tag <char>', 'Tag of the Branch to Build')
  .action(async(buildtype, buildmodule, options) => {
    options["buildtype"] = buildtype;
    options["buildmodule"] = buildmodule;
    validatebuildcli(options);
    let keys = getKeys(options);
    let configData = await config.confirmConfig(keys,  options);

    if(options.remote){ console.log("We Will Clone the repo"); }
    if(options.branch){ await gitActions.SwitchBranch(options.branch); }
    if(options.tag) { await gitActions.SwitchTag(options.tag); }
  
    if(buildtype == "client" || buildtype == "server" || buildtype == "release"){
      await buildApplication(configData);
    }
  });

module.exports = buildAppCommand;
