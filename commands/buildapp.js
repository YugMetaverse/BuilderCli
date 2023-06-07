const { Command, Argument, Option } = require('commander');
const { buildApplication } = require('../buildscripts/buildApp');
const gitActions = require('../actions/git/gitActions');
const config = require('../configuration/config');
const getKeys = require('../configuration/keys');
const availableValues = require('../configuration/availablevalues');
const { validatebuildcli } = require('../helpers/validation');
const savedconfig = require('../configuration/savedconfig');
const { getpluginfolder, removepluginfolder } = require('../actions/file/filemanager');
const { uploadApp, uploadPlugin } = require('../actions/server/upload');




const buildAppCommand = new Command('build')
  .description('Build the Yug Application. This internaly interfaces with the Unreal CLI.')
  .addArgument(new Argument('<buildtype>', 'Type to Build:').choices(availableValues.buildtype))
  .addArgument(new Argument('<buildmodule>', 'Build Module:').choices(availableValues.buildmodule))
  .addArgument(new Argument('[pluginname]', 'Name of the Plugin to be Built (If PLugin is being Built)'))
  .addArgument(new Argument('[plugiid]', 'Id of the Plugin to be Built (If PLugin is being Built)'))
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
  .option('-u, --upload', 'upload the build and packages')
  .action(async (buildtype, buildmodule, pluginname, pluginid, options) => {
    options["buildtype"] = buildtype;
    options["buildmodule"] = buildmodule;
    if (pluginname) { options["pluginname"] = pluginname; }
    if (pluginid) { options["pluginid"] = pluginid; }

    validatebuildcli(options);

    let savedvalue = {};
    if (options.config) { savedvalue = await savedconfig.getSavedConfig(options.config); }
    else if (buildmodule == "plugin") { savedvalue = await savedconfig.getSavedConfig("plugin_" + pluginname); }

    let mergedData = { ...savedvalue, ...options };
    let keys = getKeys(options);
    let configData = await config.confirmConfig(keys, mergedData);

    if (options.saveconfig) { await savedconfig.saveSavedConfig(options.saveconfig, configData); }
    else if (buildmodule == "plugin") { await savedconfig.saveSavedConfig("plugin_" + pluginname, configData); }

    if (buildmodule == "plugin") { await getpluginfolder(configData); }
    if (configData.remote) { console.log("We Will Clone the repo"); }
    if (configData.branch) { await gitActions.SwitchBranch(configData.branch); }
    if (configData.tag) { await gitActions.SwitchTag(configData.tag); }

    // await buildApplication(configData);

    if (buildmodule == "plugin") {
      // await removepluginfolder(configData);
    }

    if (configData.upload) {
      if (configData.buildmodule == 'plugin') {
       await uploadPlugin(configData)
      }
      else if (configData.buildmodule == 'app') {
       await uploadApp(configData)
      }
    }

  });

module.exports = buildAppCommand;
