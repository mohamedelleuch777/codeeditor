
// code here will be executed before all other things

var fs      = require('fs');
const data = fs.readFileSync('data.json');
const settings = JSON.parse(data);


const generateUuidV4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const checkCodeEditorId = () => {
    console.log(settings);
}



checkCodeEditorId();