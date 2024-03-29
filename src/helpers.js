
const settingsFile  = "data.json";
var fs              = require('fs');
const { GIT_GetUserName, GIT_SetUserName } = require('./git_operations');

const writeToJsonFile = (path, key, value) => {
    // Read the file and parse its contents as JSON
    let jsonData = {};
    try {
      const fileContents = fs.readFileSync(path, 'utf-8');
      jsonData = JSON.parse(fileContents);
    } catch (error) {
      // If file doesn't exist, catch error and create an empty JSON object
    }
  
    // Update the JSON object with the new key-value pair
    jsonData[key] = value;
  
    // Write the updated JSON object to the file
    fs.writeFileSync(settingsFile, JSON.stringify(jsonData, null, "\t"));
}

const readFromJsonFile = (path, key) => {
    // Read the file and parse its contents as JSON
    let jsonData = {};
    try {
      const fileContents = fs.readFileSync(path, 'utf-8');
      jsonData = JSON.parse(fileContents);
    } catch (error) {
      // If file doesn't exist or is empty, catch error and return null
      console.log("ffffffffffffffffffffffffffffffffffffffff");
      return null;
    }

    // Return the value for the specified key
    return jsonData[key] || null;
}

const writeSetting = (key, value) => {
  writeToJsonFile(settingsFile, key, value)
}

const readSetting = (key) => {
  return readFromJsonFile(settingsFile, key)
}

const generateCommitLogComponent = async (limit,offset) => {
    let res = await GIT_ListCommits(limit,offset);
    res = res.message.split('\t');
    res = res.join('').replace(/'/gm,'"').replace(/\n/gm,"");
    res = res.substr(0, res.lastIndexOf('}') + 1);
    res = '['+res+']';
    res = res.replace('[[','[');
    return JSON.parse(res);
}

const updateLogParams = () => {
  return new Promise ( (resolve) => {
    let 
    limit = readSetting("logLimit"),
    offset = readSetting("logOffset");
    Swal.fire({
        title: 'Enter Limit and Offset Values',
        html: '<span>Limit</span><input type="text" id="limit" placeholder="Limit" value="'+limit+'" class="swal2-input"><br>' +
              '<span>Offset</span><input type="text" id="offset" placeholder="Offset" value="'+offset+'" class="swal2-input">',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const limit = document.getElementById('limit').value;
          const offset = document.getElementById('offset').value;
      
          // Check if both limit and offset are entered
          if (limit && offset) {
            return { limit: limit, offset: offset };
          } else {
            Swal.showValidationMessage('Please enter both limit and offset values.');
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
        // Check if user clicked OK and both values are entered
        if (result.isConfirmed && result.value) {
            writeSetting("logLimit", result.value.limit);
            writeSetting("logOffset", result.value.offset);
        }
        resolve(true);
    });
  }) ;
}


// Define the function to show the popup
function CheckGitUser() {
  return new Promise (async (resolve) => {
    let usernm = readSetting("username");
    if( usernm && usernm!="") {
      resolve(true)
      return;
    }
    usernm = await ShellExecute(`git config --global user.name`);
    if( usernm && usernm.message!="") {
      writeSetting("username",usernm.message.replace('\n',''))
      resolve(true)
      return;
    }
    Swal.fire({
      title: 'Enter your Git username:',
      input: 'text',
      inputPlaceholder: 'Username',
      confirmButtonText: 'Submit',
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        // Check if the username is empty
        if (!value) {
          return 'Please enter your Git username';
        }
      }
    }).then(async (result) => {
      // Check if the user clicked the "Submit" button
      if (result.isConfirmed) {
        // Get the Git username from the input field
        const gitUsername = result.value;
        
        // Do something with the Git username (e.g., log it to the console)
        console.log('Git username:', gitUsername);
  
        let res = { success: true, message: ''}
        while (!res.succes || (res.success && res.message == '')) {
            res = await GIT_GetUserName();
            if(!res.succes || (res.success && res.message == '')) {
                // Call the function to show the popup
                // await CheckGitUser();
                res = await GIT_SetUserName(gitUsername)
            }
            writeSetting("username",gitUsername)
            resolve(true);
        }
      } else {
        // The user closed the popup without submitting a Git username
        console.log('Popup closed');
      }
      
      // Show the popup again if the Git username is empty
      if (!result.value) {
        return await CheckGitUser();
      }
    });
  });
}

const encodeBase64 = (data) => {
    return Buffer.from(data).toString('base64');
}

const decodeBase64 = (data) => {
    return Buffer.from(data, 'base64').toString('ascii');
}

function emptyDir(directory) {
    fs.readdirSync(directory).forEach(f => fs.rmSync(`${directory}/${f}`));
}

function sortList() {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("fiction-list");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    // Loop through all list-items:
    for (i = 0; i < (b.length - 1); i++) {
      // start by saying there should be no switching:
      shouldSwitch = false;
      /* check if the next item should
      switch place with the current item: */
      if ( parseInt(b[i].getAttribute('fiction-id')) > parseInt(b[i+1].getAttribute('fiction-id'))) {
        /* if next item is alphabetically
        lower than current item, mark as a switch
        and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

const isJS_CodeSafeToSave = (code, asyncFunc, functionName) => {
  let newCode = `
  ${asyncFunc?"async ":""}function ${functionName}(){
    ${code}
  }`;
  try {
    new Function(newCode);
    return {succes:true}; // no syntax errors
  } catch (e) {
    return {
      success: false,
      message: e
    }; // syntax error found
  }
}

function minifyJs(source) {
  // Remove single-line comments
  source = source.replace(/\/\/.*$/gm, '');

  // Remove multi-line comments
  source = source.replace(/\/\*[\s\S]*?\*\//gm, '');

  // Remove extra whitespace
  source = source.replace(/\s+/g, ' ');

  // Remove semicolons before closing braces
  source = source.replace(/;\s*}/gm, '}');

  // Remove semicolons at the end of the source
  source = source.replace(/;\s*$/gm, '');

  return source;
}

module.exports = {
  writeSetting,
  readSetting,
  generateCommitLogComponent,
  updateLogParams,
  CheckGitUser,
  encodeBase64,
  decodeBase64,
  emptyDir,
  sortList,
  isJS_CodeSafeToSave,
  minifyJs
}
