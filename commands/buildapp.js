const { Command, Argument, Option } = require('commander');
const { buildApplication } = require('../buildscripts/buildApp');
const buildPlugin = require('../buildscripts/buildPlugin');
const gitActions = require('../actions/git/gitActions');
const config = require('../configuration/config');
const getKeys = require('../configuration/keys');
const availableValues  = require('../configuration/availablevalues');
const { validatebuildcli } = require('../helpers/validation');
const savedconfig = require('../configuration/savedconfig');



const buildAppCommand = new Command('build')
  .description('Build the Yug Application. This internaly interfaces with the Unreal CLI.')
  .addArgument(new Argument('<buildtype>', 'Type to Build:').choices(availableValues.buildtype))
  .addArgument(new Argument('<buildmodule>', 'Build Module:').choices(availableValues.buildmodule))
  .addArgument(new Argument('[pluginname]', 'Name of the Plugin to be Built (If PLugin is being Built)'))
  .addOption(new Option('-b, --buildconfig <buildconfig>', 'Build Configuration:').choices(availableValues.buildconfig))
  .option('-r, --remote ', 'Remote Build by Downloading the Repository from Scratch')
  .option('-g, --gitswitch ', 'Enable Git Actions like Branch and Tag Switch')
  .option('-b, --branch <char>', 'Branch to Build')
  .option('-c, --config <configname>', 'Config Name to use for the Build')
  .option('-s, --saveconfig <configname>', 'Save the Config to the Saved Configs')
  .option('-t, --tag <char>', 'Tag of the Branch to Build')
  .option('-l, --localplugin <localpath>', 'Path of the Plugin')
  .option('-r, --remoteplugin <url> ', 'Remote git Repository for the Plugin')
  .option('-b, --pluginbranch <char>', 'Branch to Build')
  .option('-t, --plugintag <char>', 'Tag of the Branch to Build')
  .action(async(buildtype, buildmodule, pluginname, options) => {
    options["buildtype"] = buildtype;
    options["buildmodule"] = buildmodule;
    if(pluginname){ options["pluginname"] = pluginname; }

    validatebuildcli(options);

    let savedvalue = {};
    if(options.config){ savedvalue = await savedconfig.getSavedConfig(options.config); } 
    else if(pluginname){ savedvalue = await savedconfig.getSavedConfig("plugin_"+pluginname); }

    let mergedData = { ...savedvalue, ...options };
    let keys = getKeys(options);
    let configData = await config.confirmConfig(keys,  options);

    if(options.saveconfig){ await savedconfig.saveConfig(options.saveconfig, mergedData); } 
    else if(pluginname){ await savedconfig.saveConfig("plugin_"+pluginname, mergedData); }
    
    
    if(options.remote){ console.log("We Will Clone the repo"); }
    if(options.branch){ await gitActions.SwitchBranch(options.branch); }
    if(options.tag) { await gitActions.SwitchTag(options.tag); }
  
    await buildApplication(configData);

  });

module.exports = buildAppCommand;
