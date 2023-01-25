const { ShellExecute } = require("./shell");

let commandLine = document.querySelector('input.terminal');


const handleKeyPress = async (event) => {
    switch(event.code) {
        case 'NumpadEnter':
        case 'Enter':
            await runCommand();
        break;
    }
}


const runCommand = async () => {
    let cmd = commandLine.value;
    commandLine.value = '';
    console.log(cmd);
    Log(cmd);
    let response = await ShellExecute(cmd);
    console.log(response.success);
    let lineList = response.message.replaceAll('\r','').split('\n');
    lineList.forEach(element => {
        Log(element);
    });
    setTimeout(() => {
        commandLine.focus();
    }, 150);
}




commandLine.addEventListener('keypress', handleKeyPress);


