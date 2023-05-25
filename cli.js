#!/usr/bin/env node

var figlet = require("figlet");
const { Command } = require('commander');
const buildAppCommand = require('./commands/buildapp');
const buildWorker = require('./commands/buildworker');
const chalk = require('chalk');


const program = new Command();

program
  .name('Yug Builder')
  .description('CLI to Build Yug Applications')
  .version('0.1.0');

program.addCommand(buildAppCommand);
program.addCommand(buildWorker);

figlet("Yug Metaverse Builder", async function (err, data) {
  console.log(chalk.yellowBright(data) + '\n');
  // console.log(chalk.green(JSON.stringify(configData, null, 4)));
  program.parse();
});

