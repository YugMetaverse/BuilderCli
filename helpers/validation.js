function validatebuildcli(options)
{
    if(options.branch && options.tag)
    {
      console.log("Error: Please specify only one of branch or tag");
      process.exit(1);
    }
    if(options.buildmodule == "plugin" && !options.pluginname)
    {
      console.log("Error: Please specify plugin name");
      process.exit(1);
    }
    if(options.localplugin && options.remoteplugin)
    {
      console.log("Error: Please specify only one of localplugin or remoteplugin");
      process.exit(1);
    }

}

function validateplugicli(options){

}

module.exports = {
    validatebuildcli,
    validateplugicli
}