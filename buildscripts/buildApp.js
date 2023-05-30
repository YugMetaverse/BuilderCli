const { spawn } = require("child_process");
const { getConfig } = require("../configuration/config");
const buildlib = require("../helpers/lib");

async function buildApplication(config){

    const command = buildlib.getUnrealUATPath(config.unrealbasepath);
    const args = [
    'BuildCookRun',
    '-nop4',
    '-utf8output',
    '-nocompileeditor',
    '-skipbuildeditor',
    '-cook',
    '-project="'+ config.projectbasepath +'/'+config.projectname+'.uproject"',
    '-platform='+ config.platform,
    '-SkipCookingEditorContent',
    '-stage',
    '-archive',
    '-package',
    '-build',
    '-pak',
    '-compressed',
    '-archivedirectory="'+ config.archivedirectory +'"',
    '-distribution',
    '-manifests',
    '-nodebuginfo',
    '-nocompile',
    '-nocompileuat',
    ];

    if(config.buildtype === "server"){
        args.push('-server','-noclient', '-serverconfig='+config.buildconfig);
    } else {
        args.push('-clientconfig='+config.buildconfig);
    }

    if(config.buildtype != "server"){
        args.push('-installed','-target='+config.projectname);
    } else {
        args.push('-target='+config.servertargetname);
    }
    
    const builder = spawn(command, args);

    builder.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });

    builder.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });

    builder.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });

    builder.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });
}

module.exports= {
    buildApplication
}
