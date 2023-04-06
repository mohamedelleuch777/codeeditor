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



function ShellExecute2(cmd) {
  return new Promise((resolve) => {
    try {
      exec(cmd, { cwd: path_.resolve(settings.gitPath) }, (error, stdout, stderr) => {
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
          const logs = stdout
            .split('\n')
            .filter(log => !!log)
            .map(log => {
              log = log.replace(/'/gm,'%');
              const logInfo = log.split(';');
              const id = logInfo[1];
              const date = logInfo[2];
              const author = logInfo[3];
              const commit = logInfo[4];
              return {
                id,
                date,
                author,
                commit
              };
            });
          const jsonLogs = JSON.stringify(logs);
          resolve({
            success: true,
            message: jsonLogs
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
    ShellExecute,
    ShellExecute2
}