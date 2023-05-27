const fs = require('fs');
const inquirer = require('inquirer');
const { getQuestions, getConfirmQuestion } = require('./questions');
const chalk = require('chalk');


async function writeConfig(config) {
    let configData = {};
    await fs.promises.mkdir('./config', { recursive: true })
    if (fs.existsSync('./config/config.json')) {
        const data = await fs.promises.readFile("./config/config.json", "utf8");
        configData = JSON.parse(data);
    }
    const mergedData = mergeConfigAndOverride(config, configData); 
    await fs.promises.writeFile('./config/config.json', JSON.stringify(mergedData, null, 2));
}

async function getConfig(buildKeys, overrideValues={}) {
    await fs.promises.mkdir('./config', { recursive: true })
    if (!fs.existsSync('./config/config.json')) {
        await initConfig(buildKeys, overrideValues, {});
    }
    const data = await fs.promises.readFile("./config/config.json", "utf8");
    let existingconfigData = JSON.parse(data);
    let mergedConfigData = mergeConfigAndOverride(overrideValues, existingconfigData);
    if(await checkConfig(buildKeys, mergedConfigData))
    {
        let keysOnlyData = getMergedDataforKeysOnly(buildKeys, mergedConfigData);
        await writeConfig(keysOnlyData);
        return keysOnlyData;
    }
    else 
    {
        let finaldata = await initConfig(buildKeys, overrideValues, existingconfigData);
        return finaldata;
    }
    
}

async function checkConfig(buildKeys, mergedConfigData) {
    for (var i = 0; i < buildKeys.length; i++) {
    if (mergedConfigData[buildKeys[i]] === undefined) {
            return false;
        }
    }
    return true;
}

function mergeConfigAndOverride(overrideValues, existingconfigData){
    let mergedConfig = {
        ...existingconfigData,
        ...overrideValues
    };
    return mergedConfig;
}

function getMergedDataforKeysOnly(buildKeys, mergedConfigData) {
    let data = {};
    for (var i = 0; i < buildKeys.length; i++) {
        if(mergedConfigData[buildKeys[i]]){
            data[buildKeys[i]] = mergedConfigData[buildKeys[i]];
        }
    }
    return data;
}

async function initConfig(buildKeys, overrideValues = {}, existingconfigData = {}) {
    let neededData = getMergedDataforKeysOnly(buildKeys,mergeConfigAndOverride(overrideValues, existingconfigData));
    let questions = getQuestions(buildKeys, neededData);
    const answer = await inquirer.prompt(questions);
    await writeConfig(answer);
    return answer;
}

async function confirmConfig(buildKeys, overrideValues = {}){
    let configData = await getConfig(buildKeys, overrideValues);

    console.log(chalk.magentaBright("Your Current Config is: "));
    var keys = Object.keys(configData);
    for (var i = 0; i < keys.length; i++) {
        console.log(chalk.blueBright(keys[i] + ": " + configData[keys[i]]));
    }
    const answer = await inquirer.prompt(getConfirmQuestion());
    if(!answer.confirm) { return await initConfig(buildKeys, overrideValues, configData); }
    return configData;
}

module.exports = {
    writeConfig,
    getConfig,
    initConfig,
    confirmConfig
}