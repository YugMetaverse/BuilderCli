#!/usr/bin/env node

var figlet = require("figlet");
const { Command } = require('commander');
const buildAppCommand = require('./commands/buildapp');
const testCommand = require('./commands/test');
const buildWorker = require('./commands/buildworker');
const chalk = require('chalk');


const program = new Command();

program
  .name('Yug Builder')
  .description('CLI to Build Yug Applications')
  .version('0.1.0');

program.addCommand(buildAppCommand);
program.addCommand(buildWorker);
program.addCommand(testCommand);

figlet("Yug Metaverse Builder", async function (err, asciidraw) {
  console.log(chalk.yellowBright(asciidraw) + '\n');
  // console.log(chalk.green(JSON.stringify(configData, null, 4)));
  program.parse();
});

