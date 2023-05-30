function getKeys(commandName, commandlinevalues={}){
    let keys = [];
    if(commandName == "client"){
        keys = [
            "projectbasepath",
            "platform",
            "unrealbasepath",
            "archivedirectory",
            "buildconfig",
            "buildtype",
            "projectname"
        ];   
    }
    else if(commandName == "plugin")
    {
        keys = [
            "projectbasepath",
            "platform",
            "unrealbasepath",
            "archivedirectory",
            "buildconfig",
            "buildtype",
            "pluginname"
        ];   
    }
    else if(commandName == "server")
    {
        keys = [
            "projectbasepath",
            "platform",
            "unrealbasepath",
            "archivedirectory",
            "buildconfig",
            "buildtype",
            "servertargetname"
        ];   
    
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