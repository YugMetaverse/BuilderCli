const { spawn } = require("child_process");

async function buildPlugin(config){
    
    const command = config.unrealbasepath +'/Engine/Build/BatchFiles/RunUAT.command';
    const args = [
    'BuildCookRun',
    '-nop4',
    '-utf8output',
    '-nocompileeditor',
    '-skipbuildeditor',
    '-cook',
    '-project="'+ config.projectbasepath +'/'+config.projectname+'.uproject"',
    '-target='+config.projectname,
    '-platform='+ config.platform,
    '-SkipCookingEditorContent',
    '-installed',
    '-stage',
    '-archive',
    '-package',
    '-build',
    '-pak',
    '-compressed',
    '-archivedirectory="'+ config.archivedirectory +'"',
    '-distribution',
    '-manifests',
    '-clientconfig='+config.buildconfig,
    '-nodebuginfo',
    '-nocompile',
    '-nocompileuat',
    ];

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

module.exports= buildPlugin;

