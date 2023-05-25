// buildCommand.js
const { Command } = require('commander');
const inquirer = require('inquirer');
const { buildApplication } = require('../buildscripts/buildApp');

const buildCommand = new Command('build')
  .description('Build the Yug Application. This internaly interfaces with the Unreal CLI.')
  .argument('<test>', 'string to split')
  .argument('[test]', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action(async(str, test, options) => {
    
    buildApplication();
  
  });

module.exports = buildCommand;
