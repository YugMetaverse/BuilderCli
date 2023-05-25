const fs = require('fs');
const inquirer = require('inquirer');
const getQuestions = require('./questions');
const chalk = require('chalk');

let currentlyChanged = false;

async function writeConfig(config) {
    await fs.promises.mkdir('./config', { recursive: true })
    await fs.promises.writeFile('./config/config.json', JSON.stringify(config, null, 2));
}

async function getConfig(buildProcess = "any") {
    await fs.promises.mkdir('./config', { recursive: true })
    if (!fs.existsSync('./config/config.json')) {
        await initConfig(buildProcess);
    }
    const data = await fs.promises.readFile("./config/config.json", "utf8");
    let configData = JSON.parse(data);
    if(await checkConfig(buildProcess, configData))
    {
        return configData;
    }
    else 
    {
        let finaldata = await initConfig(buildProcess, configData);
        return finaldata;
    }
    
}

async function checkConfig(buildProcess="any", data = {}) {
    if (!data.hasOwnProperty("platform"))
    {
        return false;
    }
    return true;
}

async function initConfig(buildProcess = "any", data = {}) {
    let questions = getQuestions(buildProcess,data);
    const answer = await inquirer.prompt(questions);
    config = {
        "platform": answer.platform
    }
    await writeConfig(config);
    currentlyChanged = true;
    return config;
}

async function confirmConfig(buildProcess="any"){
    let configData = await getConfig(buildProcess);
    if(!currentlyChanged)
    {
        currentlyChanged = false;
        console.log("Your Current Config is: ")
        var keys = Object.keys(configData);
        for (var i = 0; i < keys.length; i++) {
            console.log(keys[i] + ": " + configData[keys[i]]);
        }
        let questions = [
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to change the config? (Yes/No)',
                default: false
            }];
        const answer = await inquirer.prompt(questions);
        if(answer.confirm === "Yes")
        {
            return await initConfig(buildProcess, configData);
        }
        else {
            return configData;
        }
    }
    else {
        return configData;
    }
}

module.exports = {
    writeConfig,
    getConfig,
    initConfig,
    confirmConfig
}