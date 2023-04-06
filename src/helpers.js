
const settingsFile = "data.json";

const writeSetting = (key, value) => {
    // Read the file and parse its contents as JSON
    let jsonData = {};
    try {
      const fileContents = fs.readFileSync(settingsFile, 'utf-8');
      jsonData = JSON.parse(fileContents);
    } catch (error) {
      // If file doesn't exist, catch error and create an empty JSON object
    }
  
    // Update the JSON object with the new key-value pair
    jsonData[key] = value;
  
    // Write the updated JSON object to the file
    fs.writeFileSync(settingsFile, JSON.stringify(jsonData, null, "\t"));
}

const readSetting = (key) => {
    // Read the file and parse its contents as JSON
    let jsonData = {};
    try {
      const fileContents = fs.readFileSync(settingsFile, 'utf-8');
      jsonData = JSON.parse(fileContents);
    } catch (error) {
      // If file doesn't exist or is empty, catch error and return null
      console.log("ffffffffffffffffffffffffffffffffffffffff");
      return null;
    }

    // Return the value for the specified key
    return jsonData[key] || null;
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

module.exports = {
  writeSetting,
  readSetting,
  generateCommitLogComponent,
  updateLogParams
}
