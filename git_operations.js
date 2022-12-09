const { exec } = require("child_process");

function ShellExecute(cmd) {
    return new Promise((resolve) => {
        exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`O93OD_FAM_____: ${error.message}`);
            resolve(false);
            return;
        }
        if (stderr) {
            console.log(`stderr_____: ${stderr}`);
            resolve(false);
            return;
        }
        if (stdout !== "") {
            console.log(`${stdout}`);
        }
        resolve(true);
        });
    });
}

async function GIT_Status() {
    console.log(await ShellExecute(`git status`));
}
async function GIT_Add() {
    await ShellExecute(`git add .`);
}
async function GIT_Commit(msg="empty") {
    await ShellExecute(`git commit -m"${msg}"`);
}
async function GIT_Push() {
    await ShellExecute(`git push`);
}

module.exports = {
    GIT_Status,
    GIT_Add,
    GIT_Commit,
    GIT_Push,
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