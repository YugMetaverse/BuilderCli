function getQuestions(buildProcess="any", existingdata = {}){
    const questions = [
        {
            type: 'list',
            name: 'platform',
            choices: (answers) => {
                if(process.platform === "win32"){
                    return [ "Windows", "Android" ];
                }
                else if(process.platform === "darwin"){
                    return [ "Mac", "iOS" ];
                }
                else if(process.platform === "linux"){
                    return [ "Linux", "Android" ];
                }
                else{
                    return ["Windows", "Android", "Mac", "iOS", "Linux"];
                }
            },
            message: 'Select the Platform to Build',
        },
        {
            type: 'list',
            name: 'buildtype',
            choices: [ "Development",  "Shipping" ],
            message: 'Select the Build Type',
            default: 'Shipping'
        },
        {
            type: 'input',
            name: 'unrealpath',
            message: 'Enter the Unreal Installation Path',
            default: (answers) => {
               return (existingdata.hasOwnProperty('unrealpath') ? existingdata.unrealpath :  "/Applications/Unreal Engine.app");
            }
        },
        {
            type: 'input',
            name: 'projectpath',
            message: 'Enter the Project Path',
            default: (answers) => {
                return (existingdata.hasOwnProperty('projectpath') ? existingdata.projectpath :  "/Users/username/Documents/MyProject");
            }
        },
        {
            type: 'input',
            name: 'archivepath',
            message: 'Enter the Path to Archive the Project',
            default: (answers) => {
                return (existingdata.hasOwnProperty('archivepath') ? existingdata.projectpath :  "/Users/user/Desktop/Indialand");
            }
        },
        {
            type: 'input',
            name: 'releaseversion',
            message: 'Enter the Release Version',
            default: (answers) => {
                return (existingdata.hasOwnProperty('releaseversion') ? existingdata.releaseversion :  "1.0.0");
            },
            when: (answers) => {
                return buildProcess === "releaseBuild";
            }
        }
    ];
    return questions;
    
}

module.exports = getQuestions;