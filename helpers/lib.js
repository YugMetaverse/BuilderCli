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

module.exports = {
    getUnrealExePath
}