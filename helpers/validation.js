function validatebuildcli(options)
{
    if(options.branch && options.tag)
    {
      console.log("Error: Please specify only one of branch or tag");
      process.exit(1);
    }
}

function validateplugicli(options){

}

module.exports = {
    validatebuildcli,
    validateplugicli
}