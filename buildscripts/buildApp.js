const { spawn } = require("child_process");
const { getConfig } = require("../configuration/config");

function buildApplication(){
    const config = getConfig();
    
    const command = '/Users/Shared/Epic Games/UE_5.1/Engine/Build/BatchFiles/RunUAT.command';
    const args = [
    'BuildCookRun',
    '-nop4',
    '-utf8output',
    '-nocompileeditor',
    '-skipbuildeditor',
    '-cook',
    '-project="'+ config.projectPath +'/YugGAS.uproject"',
    '-target=YugGAS',
    '-unrealexe="/Users/Shared/Epic Games/UE_5.1/Engine/Binaries/Mac/UnrealEditor.app/Contents/MacOS/UnrealEditor"',
    '-platform='+ config.platform,
    '-SkipCookingEditorContent',
    '-installed',
    '-stage',
    '-archive',
    '-package',
    '-build',
    '-pak',
    '-compressed',
    '-archivedirectory="/Users/utkarshshukla/Desktop/Indialand"',
    '-distribution',
    '-manifests',
    '-clientconfig=Shipping',
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

module.exports= {
    buildApplication
}
