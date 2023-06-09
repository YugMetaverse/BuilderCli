const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');
const colors = require('ansi-colors');
const {convertUnrealPlatformNametoFolderPlatformName } = require('../../helpers/lib');

function getTotalSize(directory) {
    let totalSize = 0;
  
    const files = fs.readdirSync(directory);
  
    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
  
      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        totalSize += getTotalSize(filePath);
      }
    });
  
    return totalSize;
  }

async function zipAppFolder(options){
    const buildPackPath = getappBuildFolderPath(options);
    const totalSize = getTotalSize(buildPackPath);

    const progressBar = new cliProgress.SingleBar({
        format: 'Zip Progress |' + colors.cyan('{bar}') + '| {percentage}% | ETA: {eta}s | {value}/{total}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '-',
        hideCursor: true
    });
    progressBar.start(totalSize, 0);
    
    let zipFile = path.join(options.archivedirectory, `${convertUnrealPlatformNametoFolderPlatformName(options)}.zip`);
    return new Promise((resolve, reject) => {
        let output = fs.createWriteStream(zipFile);
        let archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        archive.on("progress", (progress) => {
            progressBar.update(progress.fs.processedBytes);
            // const percentage = (progress.fs.processedBytes / totalSize) * 100;
            // process.stdout.write(`\rArchiving: ${percentage.toFixed(2)}% done`);
          });          
        output.on('close', function () {
            progressBar.stop();
            console.log('\n\nArchive Created '+archive.pointer() + ' total bytes');
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
    let platform = convertUnrealPlatformNametoFolderPlatformName(options);
    const buildPackPath = path.join(options.archivedirectory, platform);
    return buildPackPath;
}

module.exports = {
    zipAppFolder,
    removeZipApplication
};