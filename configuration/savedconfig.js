const fs = require('fs');

async function getSavedConfig(savedConfigName) {
    await fs.promises.mkdir('./config', { recursive: true })
    if (!fs.existsSync('./config/'+savedConfigName+'.json')) {
        return {};
    }
    const data = await fs.promises.readFile("./config/"+savedConfigName+".json", "utf8");
    let existingconfigData = JSON.parse(data);
    return existingconfigData;
}

async function saveSavedConfig(savedConfigName, configData) {
    await fs.promises.mkdir('./config', { recursive: true })
    await fs.promises.writeFile("./config/"+savedConfigName+".json", JSON.stringify(configData, null, 4));
}

module.exports = {
    getSavedConfig,
    saveSavedConfig
}