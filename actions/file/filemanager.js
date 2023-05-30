const fse = require('fs-extra');

async function getpluginfolder(options){
   if(options.localplugin){ 
       await moveplugintoproject(options);
   } 
}

async function moveplugintoproject(options){
    if(options.localplugin){
        const parts = options.localplugin.split("/");
        const lastIndex = parts[parts.length - 1] === "" ? parts.length - 2 : parts.length - 1;
        const FolderName = parts[lastIndex];
        fse.ensureDirSync(options.projectbasepath + "/Plugins/" + FolderName)
        const pluginexists = await fse.pathExists(options.projectbasepath + "/Plugins/" + FolderName)
        if(pluginexists){
            const localexists = await fse.pathExists(options.localplugin)
            if(localexists){
                fse.moveSync(options.localplugin, options.projectbasepath + "/Plugins/" + FolderName, { overwrite: true });
            }
        }
    }
}

async function removepluginfolder(options){
    if(options.localplugin){
        const parts = options.localplugin.split("/");
        const lastIndex = parts[parts.length - 1] === "" ? parts.length - 2 : parts.length - 1;
        const FolderName = parts[lastIndex];
        fse.moveSync(options.projectbasepath + "/Plugins/" + FolderName, options.localplugin, { overwrite: true });
    }
}

module.exports = {
    getpluginfolder,
    removepluginfolder
}