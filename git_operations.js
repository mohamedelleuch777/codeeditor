const { exec } = require("child_process");

function ShellExecute(cmd) {
    return new Promise((resolve) => {
        exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            resolve(false);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
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

function GIT_Add() {}
function GIT_Commit() {}
function GIT_Push() {}

async function main() {
    await ShellExecute(`git status`);
    await ShellExecute(`git add .`);
    await ShellExecute(`git commit -m"git operations v1"`);
}


main()