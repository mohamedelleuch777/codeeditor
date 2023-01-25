const { exec } = require("child_process");
const path_         = require('path');

function ShellExecute(cmd) {
    return new Promise((resolve) => {
        try {
            exec(cmd, {cwd: path_.resolve(settings.gitPath)}, (error, stdout, stderr) => {
                if (error) {
                    console.log(`Error_____: ${error.message}`);
                    resolve({
                        success: false,
                        message: error.message
                    });
                    return;
                }
                if (stderr) {
                    console.log(`stderr_____: ${stderr}`);
                    resolve({
                        success: false,
                        message: stderr
                    });
                    return;
                }
                if (stdout === "" || stdout) {
                    console.log(`${stdout}`);
                    resolve({
                        success: true,
                        message: stdout
                    });
                }
            });
        } catch (err) {
            console.log(`catcherr_____: ${err}`);
            resolve({
                success: false,
                message: err
            });
        }
    });
}

module.exports = {
    ShellExecute
}