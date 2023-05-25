function getKeys(commandName, commandlinevalues={}){
    let keys = [];
    if(commandName="buildApp"){
        keys = [
            "projectpath",
            "platform"
        ];   
    }
    if(commandlinevalues.gitswitch){
        keys.push("branch");
        keys.push("tag")
    }
    if(commandlinevalues.remote){
        keys.push("repourl");
    }
    return keys;
}

module.exports = getKeys;