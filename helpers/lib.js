function getUnrealExePath(basepath) {
    let unrealexepath;
    if(process.platform === 'win32'){
        unrealexepath = basepath + '/Engine/Binaries/Win64/UnrealEditor.exe';
    }
    else if(process.platform === 'linux'){
        unrealexepath = basepath + '/Engine/Binaries/Linux/UnrealEditor';
    }
    else if(process.platform === 'darwin'){
        unrealexepath = basepath +'/Engine/Binaries/Mac/UnrealEditor.app/Contents/MacOS/UnrealEditor';
    }
    return unrealexepath;
}

function getUnrealUATPath(basepath)
{
    let UATPath;
    if(process.platform === 'win32'){
        UATPath = basepath +'/Engine/Build/BatchFiles/RunUAT.bat';
    }
    else if(process.platform === 'linux'){
        UATPath = basepath +'/Engine/Build/BatchFiles/RunUAT.sh';
    }
    else if(process.platform === 'darwin'){
        UATPath = basepath +'/Engine/Build/BatchFiles/RunUAT.command';
    }
    return UATPath;
}

function convertUnrealPlatformNametoFolderPlatformName(options)
{
    if(options.platform == 'win64'){
        return 'Windows';
    }
    else if(options.platform == 'Linux' && options.buildtype == 'server'){
        return 'LinuxServer';
    }
    else{
        return options.platform;
    }    
}

module.exports = {
    getUnrealExePath,
    getUnrealUATPath,
    convertUnrealPlatformNametoFolderPlatformName
}