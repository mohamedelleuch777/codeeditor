const { ShellExecute, ShellExecute2 } = require("./shell");

async function GIT_Status() {
    // nothing to commit, working tree clean
    let result = await ShellExecute(`git  status`);
    if(result.success) {
        if(result.message.includes('nothing to commit, working tree clean')) {
            return true;
        }
    }
    return false;
}
async function GIT_Add() {
    await ShellExecute(`git add .`);
    return true;
}
async function GIT_Commit(msg="no comment passed -default message!") {
    return await ShellExecute(`git commit -m"${msg}"`);
}

async function GIT_Push() {
    return await ShellExecute(`git push`);
}

async function GIT_Pull() {
    return await ShellExecute(`git pull`);
}

async function GIT_ListCommits(limit, offset=0) {
    

    const cmd = `git log --date=format-local:\"%Y-%m-%d %H:%M:%S\" --skip=${offset} -${limit} --pretty=\"format;%h;%ad;%an;%s\"`;

    try {
        return await ShellExecute2(cmd);
    }
    catch (err) {
        console.log(err);
        return err;
    };
    // return await ShellExecute(`git log --date=format-local:"%Y-%m-%d %H:%M:%S" --skip=${offset}  -${limit} --pretty="{ %x0A'id': '%h',%x0A 'date': '%ad', %x0A 'author': '%an', %x0A 'commit': '%s' %x0A}, %x09"`);
}

module.exports = {
    GIT_Status,
    GIT_Add,
    GIT_Commit,
    GIT_Push,
    GIT_Pull,
    GIT_ListCommits
}
/*
async function main() {
     await ShellExecute(`git pull origin master`);
    await ShellExecute(`git status`);
    await ShellExecute(`git add .`);
    await ShellExecute(`git commit -m"git operations v1"`);
    await ShellExecute(`git push origin master`); 
    FTP_Connect();
    
}

FTP_Connect = () => {
    const {SocksClient} = require('socks');
    const jsftp = require("jsftp");

    const ftp = new jsftp({
    host: 'localhost',
    port: 3333,
    user: 'user',
    pass: 'password',
    createSocket: ({port, host}, firstAction) => {
        return SocksClient.createConnection({
        proxy: {
            ipaddress: '159.203.75.200',
            port: 1080,
            type: 5
        },

        command: 'connect',

        destination: {
            host,
            port
        }
        })
    }
    })
}

*/