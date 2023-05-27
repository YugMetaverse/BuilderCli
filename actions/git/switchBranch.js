const simpleGit = require('simple-git');
const {getConfig} = require('../../configuration/config');

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
        throw new Error('You have uncommitted changes');
        // await git.add('./*').commit('Changes')
    }
    
    let localbranch = await git.branchLocal();
    if(localbranch.all.includes(branch))
    {
        await git.checkout(branch);
        return;
    }
    else {
        let remotes = await git.listRemote(['--heads']);
        if(remotes.includes('refs/heads/'+branch))
        {
            await git.checkout('origin/'+branch);
            return;
        }
        throw new Error('Branch Not Present');
    }
}

module.exports = SwitchBranch;