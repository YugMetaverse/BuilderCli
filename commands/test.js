const { Command, Argument, Option } = require('commander');
const { buildApplication } = require('../buildscripts/buildApp');
const gitActions = require('../actions/git/gitActions');
const config = require('../configuration/config');
const getKeys = require('../configuration/keys');
const availableValues  = require('../configuration/availablevalues');
const validation = require('../helpers/validation');
const savedconfig = require('../configuration/savedconfig');


const testCommand = new Command('test')
  .description('Test app')
  .action(async(pluginname, options) => {
    
  });

module.exports = testCommand;
