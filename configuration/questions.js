const availableValues = require('../configuration/availablevalues');

function getQuestions(buildKeys, existingdata) {
    function getOptionDefault(propName) {
        return existingdata.hasOwnProperty(propName) ? existingdata[propName] : availableValues[propName][0];
    }
    const questions = [
        //platform
        {
            type: 'list',
            name: 'platform',
            choices: (answers) => {
                if (process.platform === "win32") {
                    return ["win64", "Android"];
                }
                else if (process.platform === "darwin") {
                    return ["Mac", "iOS"];
                }
                else if (process.platform === "linux") {
                    return ["Linux", "Android"];
                }
                else {
                    return ["win64", "Android", "Mac", "iOS", "Linux"];
                }
            },
            message: 'Select the Platform to Build',
        },
        //buildconfig
        {
            type: 'list',
            name: 'buildconfig',
            choices: availableValues.buildconfig,
            message: 'Select the Build Configuration',
            default: getOptionDefault('buildconfig'),
            when: answers => { return buildKeys.includes('buildconfig'); }
        },
        //unrealbasepath
        {
            type: 'input',
            name: 'unrealbasepath',
            message: 'Enter the Unreal Installation Path',
            default: (answers) => {
                if (existingdata.hasOwnProperty('unrealbasepath')) {
                    return existingdata.unrealbasepath;
                }
                else {
                    if (process.platform === "darwin") {
                        return "/Users/Shared/Epic Games/UE_5.1";
                    }
                    else if (process.platform === "win32") {
                        return "C:/Program Files/Epic Games/UE_5.1";
                    }
                    else if (process.platform === "linux") {
                        return "/opt/UnrealEngine/5.1";
                    }
                    return "C:/Program Files/Epic Games/UE_5.1";
                }
            },
            when: answers => { return buildKeys.includes('unrealbasepath') }
        },
        //projectbasepath
        {
            type: 'input',
            name: 'projectbasepath',
            message: 'Enter the Project Base Path',
            default: (answers) => { return existingdata.hasOwnProperty("projectbasepath") ? existingdata["projectbasepath"] : "/Users/utkarshshukla/Unreal/yugue5"; },
            when: (answers) => { return buildKeys.includes('projectbasepath'); }
        },
        //archivedDirectory
        {
            type: 'input',
            name: 'archivedirectory',
            message: 'Enter the Path to Archive the Project',
            default: (answers) => { return existingdata.hasOwnProperty("archivedirectory") ? existingdata["archivedirectory"] : answers.projectbasepath + "/Packaged"; },
            when: (answers) => { return buildKeys.includes('archivedirectory'); }
        },
        //projectname
        {
            type: 'input',
            name: 'projectname',
            message: 'Enter the Project Name',
            default: (answers) => { return existingdata.hasOwnProperty("projectname") ? existingdata["projectname"] : "YugGAS"; },
            when: (answers) => { return buildKeys.includes('projectname'); }
        },
        //release 
        {
            type: 'input',
            name: 'releaseversion',
            message: 'Enter the Release Version',
            default: (answers) => { return existingdata.hasOwnProperty("releaseversion") ? existingdata["releaseversion"] : "1.0"; },
            when: (answers) => {
                return buildKeys.includes('releaseversion');
            },
            filter: (answer) => {
                const major = Math.floor(answer);
                const minor = Math.floor((answer - major) * 100);
                const patch = Math.floor(((answer - major) * 100 - minor) * 100);
                return `${major}.${minor}.${patch}`;
            }
        },
        {
            type: 'input',
            name: 'servertargetname',
            message: 'Enter the Server Target Name',
            default: (answers) => { return existingdata.hasOwnProperty("servertargetname") ? existingdata["servertargetname"] : answers.projectname + "Server"; },
            when: (answers) => { return buildKeys.includes('servertargetname'); }
        },
        {
            type: 'input',
            name: 'stagingdirectory',
            message: 'Enter the Staging Directory',
            default: (answers) => { return existingdata.hasOwnProperty("stagingdirectory") ? existingdata["stagingdirectory"] : answers.projectbasepath + "/Saved/StagedBuilds/"; },
            when: (answers) => { return buildKeys.includes('stagingdirectory'); }
        },
        {
            type: 'input',
            name: 'pluginname',
            message: 'Enter the Plugin Name',
            default: (answers) => { return existingdata.hasOwnProperty("pluginname") ? existingdata["pluginname"] : "India_map"; },
            when: (answers) => { return buildKeys.includes('pluginname'); }
        },
        {
            type: 'input',
            name: 'localplugin',
            message: 'Enter the Local Plugin Path',
            default: (answers) => { return existingdata.hasOwnProperty("localplugin") ? existingdata["localplugin"] : "/Users/utkarshshukla/indialand/India_map"; },
            when: (answers) => { return buildKeys.includes('localplugin'); }
        },
        {
            type: 'confirm',
            name: 'upload',
            message: 'Do you want to upload after Build',
            default: (answers) => { return existingdata.hasOwnProperty("upload") ? existingdata["upload"] : true },
            when: (answers) => { return buildKeys.includes('upload'); }
        },
        {
            type: 'confirm',
            name: 'builddocker',
            message: 'Do you want to Build the Docker Image of the Server',
            default: (answers) => { return existingdata.hasOwnProperty("builddocker") ? existingdata["builddocker"] : true },
            when: (answers) => { return buildKeys.includes('builddocker'); }
        },
        {
            type: 'confirm',
            name: 'publishdocker',
            message: 'Do you want to Publish the Docker Image of the Server',
            default: (answers) => { return existingdata.hasOwnProperty("publishdocker") ? existingdata["publishdocker"] : true },
            when: (answers) => { return buildKeys.includes('publishdocker'); }
        }

    ];
    return questions;
}

function getConfirmQuestion() {
    let questions = [
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Do you confirm your config? (Yes/No)',
            default: true
        }];
    return questions;
}

module.exports = {
    getQuestions,
    getConfirmQuestion
}