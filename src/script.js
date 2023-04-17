

var fs      = require('fs');
const path = require('path');
let data = fs.readFileSync('data.json');
let settings = JSON.parse(data);
const { serverGetFunc, Log } = require('../server');
const { GIT_Status, GIT_Add, GIT_Commit, GIT_Push, GIT_Pull, GIT_ListCommits } = require('./git_operations');
const { ipcRenderer } = require('electron');
const { generateCommitLogComponent, updateLogParams, CheckGitUser,
        encodeBase64, decodeBase64, emptyDir, sortList
      } = require('./helpers');


TEST_MODE_COLOR                 = settings.testModeColor;
PROD_MODE_COLOR                 = settings.prodModeColor;






function setEditorBackgroundColor(color) {
    return; // cancel editor coloring
    document.querySelector('#editor .cm-scroller .cm-content').style.backgroundColor=color;
}


let previousMethodStartingPosition = 0;
let methodId = 0;

function searchFicion() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("fiction-list");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function getMethodBody(classCode, startPos) {
    let notInsideComment = true;
    let notInsideDoubleQuotes = true;
    let notInsideSingleQuotes = true;
    let notInsideApostrophe = true;
    let previousChar = '';
    let openedCurleyBraceCount = 0;
    let firstCurlyBracePos = classCode.indexOf('{',startPos);
    for(let i=startPos; i<classCode.length; i++) {
        if(classCode[i]==='/' && previousChar==='/' && notInsideDoubleQuotes && notInsideSingleQuotes && notInsideApostrophe) {
            notInsideComment = false;
        }
        if(classCode[i]==='"' && previousChar!=='\\' && notInsideComment && notInsideSingleQuotes && notInsideApostrophe) {
            notInsideDoubleQuotes = !notInsideDoubleQuotes;
        }
        if(classCode[i]==="'" && previousChar!=='\\' && notInsideComment && notInsideDoubleQuotes && notInsideApostrophe) {
            notInsideSingleQuotes = !notInsideSingleQuotes;
        }
        if(classCode[i]==="`" && previousChar!=='\\' && notInsideComment && notInsideDoubleQuotes && notInsideSingleQuotes) {
            notInsideApostrophe = !notInsideApostrophe;
        }
        if(notInsideComment) {
            if(classCode[i]==='{') openedCurleyBraceCount++;
            if(classCode[i]==='}') openedCurleyBraceCount--;
            if(openedCurleyBraceCount===0 && i>firstCurlyBracePos) {
                return i;
            }
        } else {
            if(classCode[i]==='\n' && !notInsideComment) {
                notInsideComment = true;
            }
        }
        previousChar = classCode[i];
    }
}

function getTestModeData(bodyCode) {
    // var re = /if \(!scriptLib\.runThisFunctionOnlyInTestMode\("[a-zA-Z0-9]*-[a-zA-Z0-9]*-[a-zA-Z0-9]*-[a-zA-Z0-9]*-[a-zA-Z0-9]*"\)\) return;/gm // old
    var re = /if\s*\(\s*!\s*scriptLib\s*\.\s*runThisFunctionOnlyInTestMode\s*\(\s*"[a-zA-Z0-9]*-[a-zA-Z0-9]*-[a-zA-Z0-9]*-[a-zA-Z0-9]*-[a-zA-Z0-9]*"\s*\)\s*\)\s*return\s*;/gm
    let match = re.exec(bodyCode);
    if(match) {
        let uuid = match[0];
        uuid = uuid.replace('if (!scriptLib.runThisFunctionOnlyInTestMode("','').replace('")) return;','');
        return {
            uuid: uuid,
            value: match[0]
        }
    }
    return null;
}

function extractClassMethod(file,match) {
    let fileName = file.name.split('.')
    fileName = fileName.slice(0,-1)
    fileName = fileName.join('')
    const rank = fileName.split(',')[0]
    const methodName = fileName.split(',')[2]
    const isAsync = fileName.split(',')[1]=="async"?true:false;
    const tst = fileName.split(',')[3]=="null"?false:fileName.split(',')[3];
    const method = {
        id: rank,
        name: methodName,
        body: file.body,
        isAsync: isAsync,
        testMode: tst
    }
    previousMethodStartingPosition = startPosition;
    methodId++;

    return method;
}

function removeLastInstance(mainStr, badtext) {
    var charpos = mainStr.lastIndexOf(badtext);
    if (charpos<0) return mainStr;
    ptone = mainStr.substring(0,charpos);
    pttwo = mainStr.substring(charpos+(badtext.length));
    return (ptone+pttwo);
}

function addFictionList(methObj) {
    let ul = document.getElementById("fiction-list");
    let ulHtml = ul.innerHTML;
    ulHtml += `\n\t\t<li class="fiction-item ${methObj.isAsync?"async":"sync"} ${methObj.modified?"modified":""} ${methObj.testMode?"test":""}" fiction-id=${methObj.id} onclick="handleItemSelection(event)">${methObj.name}</li>`;
    ul.innerHTML = ulHtml;
}

function Compile(safe) {
    window.methodsObject = {};
    methodId = 0;
    const sourceDir = settings.gitPath+"src\\";
    let fileList = fs.readdirSync(sourceDir);
    methodList = [];
    fileList.forEach(( filePath ) => {
        let funcCode = fs.readFileSync(sourceDir+filePath, 'utf-8');
        // remove parse function from code:------------------------------
        const decryptedFilename = decodeBase64(filePath);
        const reg = /[^\t*]\b(?!function\b).*?\b\s*\w*\s*\(\w*\)\s*\{/gm
        const file = {
            name: filePath,
            body: funcCode
        }
        tempMeth = extractClassMethod(file,reg)
        tempMeth.modified = false;
        if(!safe) {
            window.methodList.push(tempMeth);
        } else {
            if(window.methodsObjectSaved.methodList[window.methodList.length].modified) {
                tempMeth = window.methodsObjectSaved.methodList[window.methodList.length];
                tempMeth.modified = true;
                window.methodList.push(tempMeth);
            } else {
                window.methodList.push(tempMeth);
            }
        }
        addFictionList(tempMeth)
    })
    //sortList()
    window.methodsObject.methodList = methodList;
}

function loadCodeInEditor( code) {
    clearEditor();
    setEditorText(code)
}

const handleItemSelection = (evt) => {
    if(evt.clientX<=30) {
        clickedOnBefore(evt);
    } else {
        selectFictionFromList(evt);
    }
}

const clickedOnBefore = (evt) => {
    Swal.fire({
        title: 'Set Function Sync/Async mode',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Async',
        denyButtonText: 'Sync',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'btn-async',
          denyButton: 'btn-sync',
        }
      }).then((result) => {
        if (result.isConfirmed) {
            methodsObject.methodList[evt.target.getAttribute("fiction-id")].isAsync = true;
            Swal.fire('Async mode has been activated for this function', '', 'success')
        } else if (result.isDenied) {
            methodsObject.methodList[evt.target.getAttribute("fiction-id")].isAsync = false;
            Swal.fire('Sync mode has been activated for this function', '', 'success')
        }
      })
}

const selectFictionFromList = (evt) => {
    setlectLineList(evt);
    let fictionId = evt.target.getAttribute('fiction-id');
    window.openedMethodId = fictionId;
    let code = methodsObject.methodList[fictionId].body;
    loadCodeInEditor(code);
    if(methodsObject.methodList[fictionId].testMode) {
        setEditorBackgroundColor(TEST_MODE_COLOR)
    } else {
        setEditorBackgroundColor(PROD_MODE_COLOR)
    }
};

const setlectLineList = (param) => {
    if(param) {
        if(param.target) {
            let items = document.getElementsByClassName('fiction-item');
            for(let i=0; i<items.length; i++) {
                items[i] && items[i].classList.remove("active");
            }
            param.target.classList.add("active");
        } else {
            let items = document.getElementsByClassName('fiction-item');
            for(let i=0; i<items.length; i++) {
                items[i] && items[i].classList.remove("active");
            }
            items[parseInt(openedMethodId)].classList.add("active");
        }
    }
}

function removeExtraWhiteSpaceFromFunctionBody(source, whiteSpaceChar) {
	let res = "", started = false;
	for (let i=0; i<source.length; i++) {
		let c = source[i];
		if((!whiteSpaceChar.includes(c)) || started) {
			res += c;
			if(!started) {
				started = true;
			}
		}
	}
	let res_opposite = "";
    	started = false;
	for (let i=res.length-1; i>=0; i--) {
		let c = res[i];
		if((!whiteSpaceChar.includes(c)) || started) {
			res_opposite = c + res_opposite;
			if(!started) {
				started = true;
			}
		}
	}
	return  res_opposite;
}

async function createOutputFile() { // onSave
    var fs      = require('fs');
    let filePart1 = await fs.readFileSync("static1.js");
    let filePart2 = "class " + settings.class + " { \n\r";
    let filePart3 = /*"\r\n\r\n\r\n" +*/ await fs.readFileSync("static2.js");
    emptyDir(settings.gitPath+"src\\");
    methodsObject.methodList.forEach((element) => {
        filePart2 += element.isAsync ? "async " : "" ;
        filePart2 += element.name + "(" + (element.event?element.event:"") + ") {";
        filePart2 += element.testMode ? `if (!scriptLib.runThisFunctionOnlyInTestMode("${element.testMode}")) return;` :  "";
	element.body = removeExtraWhiteSpaceFromFunctionBody(element.body, ['\n', '\r']);
        if(element.body[0]!=='\n' || element.body[0]!=='\r') filePart2+='\n';
        filePart2 += element.body;
        const fileName = `${element.id},${element.isAsync ? "async" : "null"},${element.name},${element.testMode=="" ? "null" : element.testMode}.js`;
        const filePath = `${settings.gitPath}src\\${encodeBase64(fileName)}`;
        fs.writeFileSync(filePath,element.body);
        if(element.body[element.body.length-1]!=='\n' || element.body[element.body.length-1]!=='\r') filePart2+='\n';
        filePart2 += `
this.methodsEndedExecutionCount++;
}
/*
######################################################################################################################################
function ended
######################################################################################################################################
*/
`;
    });
    filePart2 += `
}
`; // class closing               scriptLibFunctions.

    filePart3 += "$(window).on('onWaitingForFictionsStart', () => {\n\r";
    methodsObject.methodList.forEach(element => {
        let objName = settings.class.charAt(0).toLowerCase() + settings.class.slice(1);
        element.name !== 'constructor' && (filePart3 +=  objName + "." + element.name + "()\n\r");
    });    filePart3 += `

/*
scriptLib measure performace
*/
if(window.localStorage.debug==='true') {
    window.scriptLibEndTime = new Date().getTime();
    console.warn("SCRIPT LIB END EXECUTION TIME: ", scriptLibEndTime);
    console.warn("SCRIPT LIB TOOK SYNCHRONOUSLY: ", scriptLibEndTime - scriptLibStartTime, "MILLISECONDS");
}

})

window.scriptLibFunctions = new ScriptLibFunctions();
`;
    let items = document.getElementsByClassName('fiction-item');
    for(let i=0; i<items.length; i++) {
        items[i] && items[i].classList.remove("modified");
    }
    //filePart1 = "\nif(window.localStorage.debug==='true')console.warn(\"SCRIPT LIB START TIME: \", new Date().getTime());\n"+ filePart1
    let outFile = filePart1 + filePart2 + filePart3;
    fs.writeFile(settings.path, outFile, "utf8", function(err) {
        const min = 300, max = 750;
        let timeout = Math.random() * (max - min) + min;
        popupAutoClose("Saving Script Lib!",9999999999999);
        setTimeout(() => {
            if(err){
                Swal.fire({
                    title: 'Error!',
                    text: 'The Script Lib has not been Saved',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            } else {
                Log("SAVED: "+settings.path);
                /*
                Swal.fire({
                    title: 'Info!',
                    text: 'The Script Lib has been Saved',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                */
                popupAutoClose("",1);
            }
        }, timeout);
    })
}

function clearEditor() {
    window.editor.dispatch({
        changes: {
            from: 0,
            to: window.editor.state.doc.length,
            insert: ''
        }
    });
}

function setEditorText(txt) {
    window.editor.dispatch({
        changes: {
            from: 0,
            to: window.editor.state.doc.length,
            insert: txt
        }
    });
}

async function selectFile(safe=false) {
    // empty fiction list
    let fictionList = document.getElementById('fiction-list');
    fictionList.innerHTML = '';
    // empty edior
    let editor = document.querySelector('.CodeMirror');
    clearEditor()


    Compile(safe);
    if(typeof openedMethodId !== 'undefined') {
        let code = methodsObject.methodList[openedMethodId].body;
        setlectLineList(openedMethodId)
        loadCodeInEditor(code);
    }
    window.methodsObjectSaved = window.methodsObject;
    if(safe) {
        Log("Safe Open");
    } else {
        Log("Force Open");
    }
}

function scriptLibRefreshFromFile() {
    selectFile();
    setTimeout(() => {
        selectFile();
    }, 300);
}

function scriptLibSafeReloadFromFile() {
    selectFile(true);
    setTimeout(() => {
        selectFile(true);
    }, 300);
}

function popupAutoClose(title,time) {
    let timerInterval
    Swal.fire({
    title: title,
    html: 'Please wait until the operation finishes',
    timer: time,
    timerProgressBar: true,
    didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
            b && (b.textContent = Swal.getTimerLeft());
        }, 100)
    },
    willClose: () => {
        clearInterval(timerInterval)
    }
    }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
        console.log('loading popup closed')
    }
    })
}

function createMethod() {
    newUUID = generateUuidV4();
    let fictionList = document.querySelectorAll("#fiction-list li");
    function addItemToFictionList(name) {
        let newItem = document.createElement("li");
        newItem.classList.add("fiction-item");
        newItem.setAttribute("fiction-id",fictionList.length);
        newItem.innerText = name;
        newItem.setAttribute("onclick","selectFictionFromList(event)");
        document.querySelector("#fiction-list").appendChild(newItem)
    }
    Swal.fire({
        title: "Create!",
        text: "Write a new name to that new ficiton:",
        input: 'text',
        showCancelButton: true
    }).then((result) => {
        if (result.value) {
            let exist = methodsObject.methodList.filter(a => a.name==result.value).length > 0;
            if(exist) {
                Swal.fire({
                    title: 'Error!',
                    text: 'The name is already taken',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            } else {
                let newMethod = {
                    id: fictionList.length,
                    //startPosition: 29,
                    //endPosition: 107,
                    name: result.value,
                    body: "// This is the new fiction:",
                    async: false,
                    testMode: newUUID
                }
                methodsObject.methodList.push(newMethod);
                const count = methodsObject.methodList.length;
                const fileName = `${settings.gitPath}src\\${count},null,${newMethod.name},${newUUID}.js`;
                const filePath = `${settings.gitPath}src\\${encodeBase64(fileName)}`;
                fs.writeFileSync(filePath,"");
                addItemToFictionList(result.value);
            }
        }
    });
}

function removeMethod() {
    let fictionList = document.querySelectorAll("#fiction-list li");
    let res = -1;
    fictionList.forEach( (it,i) => {
        let classList = it.classList;
        if([...classList].includes('active')) {
            res = i;
        }
    });
    if(res===-1) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select an item to delete',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    } else {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'error',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            methodsObject.methodList.splice(res,1);
            fictionList[res].outerHTML = '';
            Swal.fire(
              'Deleted!',
              'The fiction has been deleted.',
              'success'
            )
          }
        })
    }
}

function renameMethod() {
    let fictionList = document.querySelectorAll("#fiction-list li");
    let res = -1;
    fictionList.forEach( (it,i) => {
        let classList = it.classList;
        if([...classList].includes('active')) {
            res = i;
        }
    });
    if(res===-1) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select an item to rename',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    } else {
        Swal.fire({
            title: "Rename!",
            text: "Write a new name here:",
            input: 'text',
            showCancelButton: true,
            inputAttributes: {
              placeholder: methodsObject.methodList[res].name
            }
        }).then((result) => {
            if (result.value) {
                fictionList[res].innerText = result.value;
                methodsObject.methodList[res].name = result.value;
            }
        });
    }
    
}

function setTestMode() {
    newUUID = generateUuidV4();
    let fictionList = document.querySelectorAll("#fiction-list li");
    let res = -1;
    fictionList.forEach( (it,i) => {
        let classList = it.classList;
        if([...classList].includes('active')) {
            res = i;
        }
    });
    if(res===-1) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select an item to rename',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    } else {
        Swal.fire({
            title: 'Set Test Mode ON or OFF',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Turn ON',
            denyButtonText: 'Turn OFF',
            customClass: {
              cancelButton: '',
              confirmButton: 'success',
              denyButton: 'error',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                let newTestMode = {
                    uuid: newUUID,
                    value: `if (!scriptLib.runThisFunctionOnlyInTestMode("${newUUID}")) return;`
                }
                methodsObject.methodList[res].testMode = newTestMode;
                setEditorBackgroundColor(TEST_MODE_COLOR);
                Swal.fire('You are under test mode', '', 'success')
            } else if (result.isDenied) {
                methodsObject.methodList[res].testMode = null;
                setEditorBackgroundColor(PROD_MODE_COLOR)
                Swal.fire('You are now on PRODUCTION MODE', '', 'warning')
            }
        })
    }
}

function generateTestLink () {
    let fictionList = document.querySelectorAll("#fiction-list li");
    let res = -1;
    fictionList.forEach( (it,i) => {
        let classList = it.classList;
        if([...classList].includes('active')) {
            res = i;
        }
    });
    if(res===-1) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select an item to generate its test link',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    } else {
        if(methodsObject.methodList[res].testMode) {
            Swal.fire({
                title: 'Test Link Generated!',
                text: "https://www.mediamarkt.com.tr/?SCRIPT_LIB_TEST_UUID=" + methodsObject.methodList[res].testMode,
                icon: 'success',
                confirmButtonText: 'OK'
            })
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'This fiction\'s test mode is off. You need to turn it on first',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
        
    }
}


const express = require('express');
const { off } = require('process');
const port = 6695;
const app = express();
let serverInstance;
app.get("*", serverGetFunc );

function startDevServer() {
    serverInstance = app.listen(port, "", function(err) {
        try {
            console.log("... port %d in %s mode", port, app.settings.env);
            Log("Server is running on local machine on port: "+port);
            document.getElementById("logList").style.backgroundColor = "#fff"
        } catch (err) {
            console.log("error server");
        }
    });
}

function stopDevServer() {
    serverInstance.close();
    Log("The server was stopped");
    document.getElementById("logList").style.backgroundColor = "#ccc"
}

function generateUuidV4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

async function gitCommitCode() {
    Log("Commiting & Pushing The Code with GIT");
    if(await GIT_Status()) {
        Swal.fire({
            title: 'Error!',
            text: 'Nothing to commit!',
            icon: 'error',
            confirmButtonText: 'OK'
        })
        Log("Nothing to commit!");
        return;
    }
    // ######################################################################
    // #                          Updating Version                          #
    // ######################################################################
    const shift = 2; // second version
    let newVersion = await gitLogCommits();
    newVersion = newVersion.length + 1;
    let minorVersion = newVersion % 10;
    let middleVersion = parseInt(newVersion/10)%100
    let majorVersion = parseInt(newVersion/1000) + shift
    let stringVersion = `${majorVersion}.${middleVersion}.${minorVersion}`;
    let fileContent = `window.scriptLib_version = "${stringVersion}";`
    // settings.gitPath
    fs.writeFileSync(settings.gitPath+"version.js", fileContent, "utf8")
    // ######################################################################
    await GIT_Add()
    let result = await Swal.fire({
        title: "Commit!",
        text: "Write message to the commit here:",
        input: 'text',
        showCancelButton: true,
        inputAttributes: {
          placeholder: '-m "${message}"'
        }
    })
    if (!result.value) {
        Swal.fire({
            title: 'Error!',
            text: 'Cannot commit without a message',
            icon: 'error',
            confirmButtonText: 'OK'
        })
        Log("Cannot commit without a message");
        return;
    }
    popupAutoClose("Commiting & Pushing The Code with GIT");
    let re = await GIT_Commit(result.value);
    const regex = /\d* file[s]? changed, \d* insertion[s]?\(\+\), \d* deletion[s]?\(-\)/gm;
    if(!regex.exec(re.message)){
        Swal.fire({
            title: 'Error!',
            text: 'Commit did\'t work',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
    else if(re.message.indexOf('[rejected]')>-1) {
        Swal.fire({
            title: 'Error!',
            text: 'Push did\'t work',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    } 
    else {
        Log("Commited as: "+result.value);
        popupAutoClose("",1)
    }
}

async function gitPushCode() {
    await CheckGitUser()
    re = await GIT_Push();
    Log("Pushed to remote.");
}

const gitPullCode = async () => {
    await CheckGitUser()
    popupAutoClose("Pulling The Code with GIT");
    Log("Pulling The Code with GIT");
    if(!await GIT_Status()) {
        Swal.fire({
            title: 'Error!',
            text: 'You have to commit your current changes to be able to pull the remote code',
            icon: 'error',
            confirmButtonText: 'OK'
        })
        Log("You have to commit your current changes to be able to pull the remote code");
        return;
    }
    let re = await GIT_Pull();
    const regex_ok = /Already up to date\./gm;
    const regex_aborted = /Please commit your changes or stash them before you merge\.\nAborting/gm;
    if(regex_ok.exec(re.message)){
        Log("Nothing to pull. Already up to date.");
    } else if(regex_aborted.exec(re.message)){
        Log("Pull was aborted. You need to commit changes first");
    } else {
        Log("Code pulled from remote repository.");
        let result = await Swal.fire({
            title: 'Do you want reload after pull?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Releoad',
            denyButtonText: 'Safe Reload',
            cancelButtonText: 'No',
            customClass: {
              actions: 'my-actions',
              confirmButton: 'order-2',
              denyButton: 'order-3',
            }
        })
        if (result.isConfirmed) {
            scriptLibRefreshFromFile();
        }
        if (result.isDenied) {
            scriptLibSafeReloadFromFile();
        }
    }
    popupAutoClose("",1)
}

const gitLogCommits = async () => {
    let 
        limit = readSetting("logLimit"),
        offset = readSetting("logOffset");
    if(!limit || !offset) {
        await updateLogParams();
        limit = readSetting("logLimit"),
        offset = readSetting("logOffset");
    }
    let result = await generateCommitLogComponent(limit,offset);
    return result;
}

const gitLogCommitsUpdateSearchParams = async () => {
    updateLogParams();
}

const aboutMe = () => {
    /**
    Preparing html and css data in variables and constants 
    */
    const styles = {
        divTitle: "display: flex; justify-content: space-around;",
        image: "width: 64px;",
        title: "line-height: 64px",
        divContent: `   text-align: left;
                        display: flex;
                        flex-direction: column;
                        height: 100px;
                        justify-content: space-between;`,
        divLicense: `   text-align: left;
                        overflow-y: scroll;
                        height: 350px;
                        padding: 20px;
                        border: solid 2px #ccc;
                        border-radius: 5px;
                        margin-top: 20px;`
    }
    
    const title =   `
    <div style="${styles.divTitle}">
        <img style="${styles.image}" src="${path.join(__dirname, 'lib\\icon.png')}" alt="logo" />
        <i style="${styles.title}">${atob("QWJvdXQgQ29kZUVkaXRvciB2IDEuMy41NA==")}</i>
    </div>
    `;

    const licenseText = `
    ${atob("UHJpdmF0ZSBVc2UgTGljZW5zZSB3aXRoIENvbW1lcmNpYWwgVXNlIFBlcm1pc3Npb24KClRoaXMgbGljZW5zZSBncmFudHMgdGhlIHVzZXIgdGhlIHJpZ2h0IHRvIHVzZSB0aGUgbGljZW5zZWQgbWF0ZXJpYWwgZm9yIHByaXZhdGUsIG5vbi1jb21tZXJjaWFsIHB1cnBvc2VzIG9ubHkuCgpUaGUgdXNlciBtYXkgbm90IGRpc3RyaWJ1dGUsIG1vZGlmeSwgb3IgdXNlIHRoZSBsaWNlbnNlZCBtYXRlcmlhbCBmb3IgY29tbWVyY2lhbCBwdXJwb3NlcyB3aXRob3V0IHRoZSBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24gb2YgdGhlIGRldmVsb3BlciBhbmQgdGhlIGZ1bGZpbGxtZW50IG9mIGFueSBjb25kaXRpb25zIHRoYXQgdGhlIGRldmVsb3BlciBtYXkgcmVxdWlyZS4gUGVybWlzc2lvbiBmb3IgY29tbWVyY2lhbCB1c2UgbWF5IGJlIG9idGFpbmVkIGJ5IGNvbnRhY3RpbmcgdGhlIGRldmVsb3BlciB0aHJvdWdoIEVtYWlsIG9yIExpbmtlZEluLgoKVGhlIHVzZXIgYWNrbm93bGVkZ2VzIHRoYXQgbm8gd2FycmFudHksIGRvY3VtZW50YXRpb24sIG9yIHN1cHBvcnQgaXMgcHJvdmlkZWQgZm9yIG5vbi1jb21tZXJjaWFsIHVzZSBvZiB0aGUgbGljZW5zZWQgbWF0ZXJpYWwuIERvY3VtZW50YXRpb24gYW5kIHN1cHBvcnQgZm9yIGNvbW1lcmNpYWwgdXNlIG1heSBiZSBwcm92aWRlZCBhdCB0aGUgZGlzY3JldGlvbiBvZiB0aGUgZGV2ZWxvcGVyLCBhbmQgbWF5IGJlIHN1YmplY3QgdG8gYWRkaXRpb25hbCBmZWVzLgoKQnkgdXNpbmcgdGhlIGxpY2Vuc2VkIG1hdGVyaWFsLCB0aGUgdXNlciBhZ3JlZXMgdG8gYmUgYm91bmQgYnkgdGhlIHRlcm1zIG9mIHRoaXMgbGljZW5zZS4KClRoZSBkZXZlbG9wZXIgc2hhbGwgbm90IGJlIGxpYWJsZSBmb3IgYW55IGRhbWFnZXMgYXJpc2luZyBvdXQgb2YgdGhlIHVzZSBvZiB0aGUgbGljZW5zZWQgbWF0ZXJpYWwuCgpJZiB5b3UgaGF2ZSBhbnkgcXVlc3Rpb25zIGFib3V0IHRoaXMgbGljZW5zZSBvciB0aGUgdGVybXMgb2YgdXNlLCBwbGVhc2UgY29udGFjdCB0aGUgZGV2ZWxvcGVyIHRocm91Z2ggRW1haWwgb3IgTGlua2VkSW4u")}
    `;

    const content = `
    <div style="${styles.divContent.replaceAll('\n','')}">
        ${atob("PGRpdj48aT5MaW5rZWRJbjogPC9pPjxhIHRhcmdldD0iX2JsYW5rIiBocmVmPSJodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vbW9oYW1lZC1lbGxldWNoLWI2MjcxMTg4Ij5Nb2hhbWVkIEVsbGV1Y2g8L2E+PC9kaXY+CiAgICAgICAgPGRpdj48aT5FbWFpbDogPC9pPjxhIHRhcmdldD0iX2JsYW5rIiBocmVmPSJtYWlsdG86dXNoZXI3bWVkQGdtYWlsLmNvbSI+dXNoZXI3bWVkQGdtYWlsLmNvbTwvYT48L2Rpdj4KICAgICAgICA8ZGl2PjxpPkdpdGh1YjogPC9pPjxhIHRhcmdldD0iX2JsYW5rIiBocmVmPSJodHRwczovL2dpdGh1Yi5jb20vbW9oYW1lZGVsbGV1Y2g3NzciPkRldmVsb3BwZXIncyBHaXRodWIgUHJvZmlsZTwvYT48L2Rpdj4KICAgICAgICA8ZGl2PjxpPkNvZGVFZGl0b3IgUmVwbzogPC9pPjxhIHRhcmdldD0iX2JsYW5rIiBocmVmPSJodHRwczovL2dpdGh1Yi5jb20vbW9oYW1lZGVsbGV1Y2g3NzcvY29kZWVkaXRvciI+UHJvamVjdCBSZXBvc2l0b3J5PC9hPjwvZGl2Pg==")}
    </div>
    <div style="${styles.divLicense.replaceAll('\n','')}">
        ${licenseText.replaceAll('\n','<br>')}
    </div>
    `;
    /**
    Showing the swal message popup
    */
    Swal.fire({
        title: title.replaceAll('\n',''), 
        html: content.replaceAll('\n',''),  
        confirmButtonText: "<u>Close</u>", 
    });
}


const collectModifiedBlocks = () => {
    let items = document.getElementsByClassName('fiction-item');
    for(let i=0; i<items.length; i++) {
        items[i] && items[i].classList.remove("modified");
    }
}

const deploy = () => {
    const { exec } = require("child_process")
    exec(settings.deployer)
}


ipcRenderer.on('save', (evt, msg) => createOutputFile());
ipcRenderer.on('refresh', (evt, msg) => scriptLibRefreshFromFile());
ipcRenderer.on('safe_refresh', (evt, msg) => scriptLibSafeReloadFromFile());
ipcRenderer.on('create', (evt, msg) => createMethod());
ipcRenderer.on('remove', (evt, msg) => removeMethod());
ipcRenderer.on('rename', (evt, msg) => renameMethod());
ipcRenderer.on('set_test_mode', (evt, msg) => setTestMode());
ipcRenderer.on('generate_test_link', (evt, msg) => generateTestLink());
ipcRenderer.on('start_dev_server', (evt, msg) => startDevServer());
ipcRenderer.on('stop_dev_server', (evt, msg) => stopDevServer());
ipcRenderer.on('git_commit', (evt, msg) => gitCommitCode());
ipcRenderer.on('git_push', (evt, msg) => gitPushCode());
ipcRenderer.on('git_pull', (evt, msg) => gitPullCode());
ipcRenderer.on('git_log', (evt, msg) => gitLogCommits());
ipcRenderer.on('git_log_update_params', (evt, msg) => gitLogCommitsUpdateSearchParams());
ipcRenderer.on('about_codeeditor', (evt, msg) => aboutMe());
ipcRenderer.on('deploy_to_server', (evt, msg) => deploy());
ipcRenderer.on('theme0', (evt, msg) => {createEditor();scriptLibRefreshFromFile();writeSetting('theme','theme0')});
ipcRenderer.on('theme1', (evt, msg) => {createEditor(oneDark);scriptLibRefreshFromFile();writeSetting('theme','theme1')});
ipcRenderer.on('theme2', (evt, msg) => {createEditor(oneDarkHighlightStyle);scriptLibRefreshFromFile();writeSetting('theme','theme2')});
ipcRenderer.on('theme3', (evt, msg) => {createEditor(oneDarkTheme);scriptLibRefreshFromFile();writeSetting('theme','theme3')});


