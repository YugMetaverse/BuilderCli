function getKeys(commandlinevalues={}){
    let keys = [];
    if(commandlinevalues.commandname == 'build')
    {
        let commandType = commandlinevalues.buildtype;
        let commandModule = commandlinevalues.buildmodule;

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
            keys.push("stagingdirectory");
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
                keys.push("builddocker");
                keys.push("publishdocker");
            }
        }
        
        
        if(commandlinevalues.gitswitch){
            keys.push("branch");
            keys.push("tag");
        }
        if(commandlinevalues.remote){
            keys.push("repourl");
        }
        
    }
    else if (commandlinevalues.commandname == 'run'){
        keys.push("buildappdownloaddir");
        keys.push("platform");
    }
    return keys;
}

module.exports = getKeys;