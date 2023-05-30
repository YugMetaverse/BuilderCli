const { Command, Argument, Option } = require('commander');
const { buildApplication } = require('../buildscripts/buildApp');
const buildPlugin = require('../buildscripts/buildPlugin');
const gitActions = require('../actions/git/gitActions');
const config = require('../configuration/config');
const getKeys = require('../configuration/keys');
const availableValues  = require('../configuration/availablevalues');
const validation = require('../helpers/validation');
const savedconfig = require('../configuration/savedconfig');


const buildPluginCommand = new Command('buildplugin')
  .description('Build a Plugin with Unreal Engine to be used for Yug Metaverse.')
  .addArgument(new Argument('<pluginname>', 'Name of the Plugin to be Built'))
  .addOption(new Option('-b, --buildconfig <buildconfig>', 'Build Configuration:').choices(availableValues.buildconfig))
  .option('-l, --local <localpath>', 'Path of the Plugin')
  .option('-r, --remote <url> ', 'Remote git Repository for the Plugin')
  .option('-b, --branch <char>', 'Branch to Build')
  .option('-t, --tag <char>', 'Tag of the Branch to Build')
  .action(async(pluginname, options) => {
    options["pluginname"] = pluginname;
    options["buildtype"] = "plugin";
    validation.validateplugicli(options);
    let savedvalue = await savedconfig.getSavedConfig("plugin_"+pluginname);
    let mergedData = {
        ...savedvalue,
        ...options
    };
    let configData = await config.confirmConfig(getKeys(options),  mergedData);
    savedconfig.saveSavedConfig("plugin_"+pluginname, configData);
    if(options.remote){ console.log("We Will Clone the repo"); }
    if(options.branch){ await gitActions.SwitchBranch(options.branch); }
    if(options.tag) { await gitActions.SwitchTag(options.tag); }
  
    
    // await buildPlugin(configData);
  });

module.exports = buildPluginCommand;
