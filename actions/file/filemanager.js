const fse = require('fs-extra');
const path = require('path');

async function getpluginfolder(options){
   if(options.localplugin){ 
       await moveplugintoproject(options);
   } 
}

async function moveplugintoproject(options){
    if(options.localplugin){
        const parts = options.localplugin.split(path.sep);
        const lastIndex = parts[parts.length - 1] === "" ? parts.length - 2 : parts.length - 1;
        const FolderName = parts[lastIndex];
        let pluginpath = path.join(options.projectbasepath, "Plugins", FolderName );
        fse.ensureDirSync(pluginpath);
        const pluginexists = await fse.pathExists(pluginpath)
        if(pluginexists){
            const localexists = await fse.pathExists(options.localplugin)
            if(localexists){
                fse.moveSync(options.localplugin, pluginpath, { overwrite: true });
            }
        }
    }
}

async function removepluginfolder(options){
    if(options.path localplugin){
        const parts = options.localplugin.split("/");
        const lastIndex = parts[parts.length - 1] === "" ? parts.length - 2 : parts.length - 1;
        const FolderName = parts[lastIndex];
        fse.moveSync(path.join(options.projectbasepath, "Plugins", FolderName ), options.localplugin, { overwrite: true });
    }
}

module.exports = {
    getpluginfolder,
    removepluginfolder
}