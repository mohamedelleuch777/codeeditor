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
    Log("<b>$Terminal&#9654; </b><i style=\"color:#c42;font-weight:bold;\">"+cmd+"</i>", "#53e549");
    let response = await ShellExecute(cmd);
    console.log(response.success);
    let lineList = response.message.replaceAll('\r','').split('\n');
    lineList.forEach(element => {
        if(element!="")
            Log(element, "#ffedc0");
    });
    setTimeout(() => {
        commandLine.focus();
    }, 150);
}




commandLine.addEventListener('keypress', handleKeyPress);


