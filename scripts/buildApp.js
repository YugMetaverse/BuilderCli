const { spawn } = require("child_process");
const { getConfig } = require("../configuration/config");
const buildlib = require("../helpers/lib");
const path = require('path');

async function buildApplication(config){

    const command = buildlib.getUnrealUATPath(config.unrealbasepath);
    const args = [
    'BuildCookRun',
    '-nop4',  
    '-utf8output',
    '-nocompileeditor',
    '-cook',
    '-project="'+ path.join(config.projectbasepath,config.projectname+'.uproject') +'"',
    '-stage',
    '-package',
    '-build',
    '-pak',
    '-compressed',
    '-nocompile',
    ];


    if(config.buildmodule == "release"){
        args.push('-package');
        args.push('-createreleaseversion='+config.releaseversion);
        args.push('-stagingdirectory="'+config.stagingdirectory+'"');
        args.push('-map=');
        args.push('-CookCultures=en');
        args.push('-unversionedcookedcontent');
        args.push('-serverconfig='+config.buildconfig);
        args.push('-clientconfig='+config.buildconfig);
        if(config.buildtype == "server"){
            args.push('-serverplatform='+ config.platform);
            args.push('-server');
            args.push('-noclient');
        }
        if(config.buildtype == "client"){
            args.push('-platform='+ config.platform);
        }
    }
    
    else if(config.buildmodule == "plugin"){
        args.push('-serverconfig='+config.buildconfig);
        args.push('-clientconfig='+config.buildconfig); 
        args.push('-map=');
        args.push('-CookCultures=en');
        args.push('-dlcname=' + config.pluginname);
        args.push('-DLCIncludeEngineContent');
        args.push('-basedonreleaseversion=' + config.releaseversion);  
        args.push('-stagebasereleasepaks');
        if(config.buildtype == "server"){
            args.push('-serverplatform='+ config.platform);
            args.push('-server');
            args.push('-noclient');
        }
        if(config.buildtype == "client"){
            args.push('-platform='+ config.platform);
        }
    }
    else if(config.buildmodule == "app")
    {
        args.push('-package');
        args.push('-archive');
        args.push('-archivedirectory="'+ config.archivedirectory +'"');
        args.push('-distribution');
        args.push('-nodebuginfo');
        args.push('-manifests');
        args.push('-skipbuildeditor');
        args.push('-platform='+ config.platform);
        args.push('-SkipCookingEditorContent');
        args.push('-nocompileuat');
        if(config.buildtype == "server"){
            args.push('-server');
            args.push('-noclient'); 
            args.push('-serverconfig='+config.buildconfig);   
            args.push('-target='+config.servertargetname);
        }
         else {
            args.push('-clientconfig='+config.buildconfig);
            args.push('-installed','-target='+config.projectname);
        }
    }

    return new Promise((resolve, reject) => {
        const builder = spawn(command, args);

        builder.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });

        builder.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });

        builder.on('error', (error) => {
            console.log(`error: ${error.message}`);
            reject(error);
        });

        builder.on("close", code => {
            console.log(`child process exited with code ${code}`);
            resolve();
        });
    });
}

module.exports= {
    buildApplication
}
