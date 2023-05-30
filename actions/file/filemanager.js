const fse = require('fs-extra');

function getpluginfolder(options){
   if(options.localplugin){ 
       moveplugintoproject(options);
   } 
}

function moveplugintoproject(options){
    if(options.localplugin){
        const parts = options.localplugin.split("/");
        const lastIndex = parts[parts.length - 1] === "" ? parts.length - 2 : parts.length - 1;
        const FolderName = parts[lastIndex];
        fs.ensureDirSync(options.localplugin);
        fs.ensureDirSync(options.projectbasepath + "/Plugins/" + FolderName)
        fs.moveSync(options.localplugin, options.projectbasepath + "/Plugins/" + FolderName, { overwrite: true });
    }
}

function removepluginfolder(options){
    if(options.localplugin){
        const parts = options.localplugin.split("/");
        const lastIndex = parts[parts.length - 1] === "" ? parts.length - 2 : parts.length - 1;
        const FolderName = parts[lastIndex];
        fs.moveSync(options.projectbasepath + "/Plugins/" + FolderName, options.localplugin, { overwrite: true });
    }
}

module.exports = {
    getpluginfolder,
    removepluginfolder
}