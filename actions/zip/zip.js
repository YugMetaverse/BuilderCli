const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const {convertUnrealPlatformNametoFolderPlatformName } = require('../../helpers/lib');

async function zipAppFolder(options){
    const buildPackPath = getappBuildFolderPath(options);
    let zipFile = path.join(options.archivedirectory, `${convertUnrealPlatformNametoFolderPlatformName(options.platform)}.zip`);
    return new Promise((resolve, reject) => {
        let output = fs.createWriteStream(zipFile);
        let archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        archive.on('update', (progress) => {
            console.log(`Archiving: ${progress.percent}% done`);
          });
        output.on('close', function () {
            console.log('Archive Created '+archive.pointer() + ' total bytes');
            resolve(zipFile);
        });
        archive.on('error', function (err) {
            console.log('Zip Creation Error'+ err);
            reject(err);
        });
        archive.pipe(output);
        archive.directory(buildPackPath, false);
        archive.finalize();
    });
}

async function removeZipApplication(options){
    const buildPackPath =getappBuildFolderPath(options);
    let zipFile = `${buildPackPath}.zip`;
    fs.rmSync(zipFile);
}

function getappBuildFolderPath(options){
    let platform = convertUnrealPlatformNametoFolderPlatformName(options.platform);
    const buildPackPath = path.join(options.archivedirectory, platform);
    return buildPackPath;
}

module.exports = {
    zipAppFolder,
    removeZipApplication
};