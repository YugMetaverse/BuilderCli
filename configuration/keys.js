function getKeys(commandlinevalues={}){
    let commandType = commandlinevalues.buildtype;
    let commandModule = commandlinevalues.buildmodule;
    let keys = [];

    // Always Necessary Variables
    keys.push("unrealbasepath");
    keys.push("projectname");
    keys.push("projectbasepath");
    keys.push("buildconfig");
    keys.push("buildmodule");
    keys.push("buildtype");
    keys.push("platform");
    

    if(commandModule === "release"){
        keys.push("buildmodule");
        keys.push("releaseversion");
        keys.push("stagingdirectory");

    }
    else if(commandModule === "plugin"){
        keys.push("pluginname");
        keys.push("releaseversion");
        keys.push("upload");
        if(commandlinevalues.localplugin || !commandlinevalues.remoteplugin){
            keys.push("localplugin");
        } else if(commandlinevalues.remoteplugin){
            keys.push("remoteplugin");
        }
    }
    else if(commandModule === "app"){
        keys.push("buildmodule");
        keys.push("archivedirectory");
        keys.push("upload");
        if(commandType === "client"){
            
        }
        if(commandType === "plugin")
        {
            keys.push("pluginname");
        }
        if(commandType === "server")
        {
            keys.push("servertargetname");   
        }
    }
    
    
    if(commandlinevalues.gitswitch){
        keys.push("branch");
        keys.push("tag");
    }
    if(commandlinevalues.remote){
        keys.push("repourl");
    }
    return keys;
}

module.exports = getKeys;