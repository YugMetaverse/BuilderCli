const simpleGit = require('simple-git');
const {getConfig} = require('../lib/config');

async function SwitchBranch(branch)
{
    let config = getConfig("gitOps");
    const git = simpleGit('/Users/utkarshshukla/Unreal/BuilderCli', { config: [] });
    let gitstatus = await git.status();
    if (gitstatus.current === branch){
        return true;
    }
    if(gitstatus.modified.length >0)
    {
        await git.add('./*').commit('Changes')
    }
    let remotes = await git.listRemote(['--heads', '--tags']);
    if(remotes.include('refs/heads/npm'))
    {
        console.log("npm branch exists");
    }
    
}

module.exports = SwitchBranch;