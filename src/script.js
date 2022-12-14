

var fs      = require('fs');
let data = fs.readFileSync('data.json');
let settings = JSON.parse(data);
const { serverGetFunc, Log } = require('../server');
const { GIT_Status, GIT_Add, GIT_Commit, GIT_Push } = require('../git_operations');


TEST_MODE_COLOR                 = settings.testModeColor;
PROD_MODE_COLOR                 = settings.prodModeColor;






function setEditorBackgroundColor(color) {
    return; // cancel editor coloring
    document.querySelector('#editor .cm-scroller .cm-content').style.backgroundColor=color;
}


let previousMethodStartingPosition = 0;
let methodId = 0;

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

function extractClassMethod(classCode,match) {
    let startPosition = match.index;
    let endDeclarationPosition = classCode.indexOf("{",startPosition);
    let methodName = classCode.substring(startPosition,endDeclarationPosition);
    let isAsync = methodName.includes("async");
    let event = methodName.split('(')[1].split(')')[0] ;
    event = event !== '' ? event : null
    methodName = methodName.split('(')[0].replaceAll('async','').replaceAll('\t','').replaceAll('\n','').replaceAll('\r','').replaceAll(' ','');
    let endPosition = getMethodBody(classCode,startPosition);
    // console.log("++++++++++",endPosition);
    let methodBody = "";
    methodBody = classCode.substring(endDeclarationPosition+1, endPosition);
    let tst = getTestModeData(methodBody);
    tst && (methodBody = methodBody.replace(tst.value,''));
    methodBody = removeLastInstance(methodBody,"\nthis.methodsEndedExecutionCount++;\n");
    methodBody = removeLastInstance(methodBody,"\r\nthis.methodsEndedExecutionCount++;\r\n");
    let method = {
        id: methodId,
        event: event,
        startPosition: startPosition,
        endPosition: endPosition,
        name: methodName,
        body: methodBody,
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
    ulHtml += `\n\t\t<li class="fiction-item ${methObj.isAsync?"async":"sync"} ${methObj.testMode?"test":""}" fiction-id=${methObj.id} onclick="handleItemSelection(event)">${methObj.name}</li>`;
    ul.innerHTML = ulHtml;
}

function Compile(sourceCode,className) {
    window.methodsObject = {};
    methodId = 0;
    methodsObject.name = className;
    window.brutFile = sourceCode;
    var ss = `^class\\s*${className}\\s*{\\s*`;
    ss = new RegExp(ss, "gm");
    let match = ss.exec(sourceCode)
    let startPosition = match.index;
    ss = new RegExp("// ###___END_OF_CLASS___###", "gm");
    match = ss.exec(sourceCode);
    let endPosition = match.index;
    window.methodsObject.startPosition = startPosition;
    window.methodsObject.endPosition = endPosition;
    let classCode = sourceCode.substring(startPosition,endPosition+4);
    var re = /[^\t*]\b(?!function\b).*?\b\s*\w*\s*\(\w*\)\s*\{/gm
    methodList = [];
    while ((match = re.exec(classCode)) != null) {
        let tempMeth = extractClassMethod(classCode,match);
        // remove parse function from code:------------------------------
        let count = tempMeth.endPosition+1 - tempMeth.startPosition;
        let emptySpace = " ".repeat(count);
        classCode = classCode.substring(0,tempMeth.startPosition) + emptySpace + classCode.substring(tempMeth.endPosition+1);
        //---------------------------------------------------------------
        // remove return char \n and \r from the beginning and the end of the class code ------------------------
        if(tempMeth.body[0] === '\n' || tempMeth.body[0] === '\r') tempMeth.body = tempMeth.body.substring(1);
        if(tempMeth.body[tempMeth.body.length-1] === '\n' || tempMeth.body[tempMeth.body.length-1] === '\r') tempMeth.body = tempMeth.body.substring(0, tempMeth.body.length-1);
        // ------------------------------------------------------------------------------------------------------
        window.methodList.push(tempMeth);
        addFictionList(tempMeth)
    }
    window.methodsObject.methodList = methodList;
    Swal.fire({
        title: 'Info!',
        text: 'The Script Lib has been loaded',
        icon: 'success',
        confirmButtonText: 'OK'
      })
}

function loadCodeInEditor(editor, code) {
    editor.innerHTML='';
    window.view = new EditorView({
        doc: code,
        extensions: [
            EditorView.updateListener.of(window.onEditorInput),
            basicSetup, javascript(), javascriptLanguage.data.of({
              autocomplete: jsCompletion
          })],
        parent: editor
    });
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
    let items = document.getElementsByClassName('fiction-item');
    for(let i=0; i<items.length; i++) {
        items[i] && items[i].classList.remove("active");
    }
    evt.target.classList.add("active");
    let fictionId = evt.target.getAttribute('fiction-id');
    window.openedMethodId = fictionId;
    let code = methodsObject.methodList[fictionId].body;
    loadCodeInEditor(document.getElementById('editor'), code);
    if(methodsObject.methodList[fictionId].testMode) {
        setEditorBackgroundColor(TEST_MODE_COLOR)
    } else {
        setEditorBackgroundColor(PROD_MODE_COLOR)
    }
};


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
        

function createOutputFile() {
    var fs      = require('fs');
    let mainSource = window.brutFile;
    let filePart1 = mainSource.substring(0,methodsObject.startPosition);
    let filePart2 = "class " + methodsObject.name + " { \n\r";
    let filePart3 = /*"\r\n\r\n\r\n" +*/ mainSource.substring(methodsObject.endPosition);
    filePart3 = filePart3.substring(0,filePart3.lastIndexOf("$(window).ready(() => {"));
    methodsObject.methodList.forEach(element => {
        filePart2 += element.isAsync ? "async " : "" ;
        filePart2 += element.name + "(" + (element.event?element.event:"") + ") {";
        filePart2 += element.testMode ? element.testMode.value :  "";
	element.body = removeExtraWhiteSpaceFromFunctionBody(element.body, ['\n', '\r']);
        if(element.body[0]!=='\n' || element.body[0]!=='\r') filePart2+='\n';
        filePart2 += element.body;
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

    filePart3 += "$(window).ready(() => {\n\r";
    methodsObject.methodList.forEach(element => {
        let objName = settings.class.charAt(0).toLowerCase() + settings.class.slice(1);
        element.name !== 'constructor' && (filePart3 +=  objName + "." + element.name + "()\n\r");
    });    filePart3 += `
})
if(window.localStorage.debug==='true') {
    console.warn("SCRIPT LIB END EXECUTION TIME: ", new Date().getTime());
    console.warn("SCRIPT LIB TOOK SYNCHRONOUSLY: ", new Date().getTime(), "MILLISECONDS");
}
`;
    //filePart1 = "\nif(window.localStorage.debug==='true')console.warn(\"SCRIPT LIB START TIME: \", new Date().getTime());\n"+ filePart1
    let outFile = filePart1 + filePart2 + filePart3;
    fs.writeFile(settings.path, outFile, "utf8", function(err) {
        const min = 300, max = 750;
        let timeout = Math.random() * (max - min) + min;
        popupAutoClose();
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
                Swal.fire({
                    title: 'Info!',
                    text: 'The Script Lib has been Saved',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
            }
        }, timeout);
    })
}

async function selectFile() {
    // empty fiction list
    let fictionList = document.getElementById('fiction-list');
    fictionList.innerHTML = '';
    // empty edior
    let editor = document.getElementById('editor');
    editor.innerHTML = '';


    // let file = await dialogFileSelector();
    // let file = "../script_lib.js";
    let file = settings.path;
    fs.readFile(file, "utf8",function(error, data){
        startPosition = data.indexOf("class " + settings.class + " {");
        Compile(data,settings.class);
        Log("OPEN: "+file);
    });
}

function scriptLibRefreshFromFile() {
    selectFile();
    setTimeout(() => {
        selectFile();
    }, 300);
}

function popupAutoClose(time) {
    let timerInterval
    Swal.fire({
    title: 'Saving Script Lib!',
    html: 'Remaining time <b></b> milliseconds.',
    timer: time,
    timerProgressBar: true,
    didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
        }, 100)
    },
    willClose: () => {
        clearInterval(timerInterval)
    }
    }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
        console.log('File was saved successfully')
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
                    testMode: {
                        uuid: newUUID,
                        value: `if (!scriptLib.runThisFunctionOnlyInTestMode("${newUUID}")) return;`
                    }
                }
                methodsObject.methodList.push(newMethod);
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
                text: "https://www.mediamarkt.com.tr/?SCRIPT_LIB_TEST_UUID=" + methodsObject.methodList[res].testMode.uuid,
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

async function gitPushCode() {
    if(await GIT_Status()) {
        Swal.fire({
            title: 'Error!',
            text: 'Nothing to commit!',
            icon: 'error',
            confirmButtonText: 'OK'
        })
        return;
    }
    await GIT_Add()
    let result = await Swal.fire({
        title: "Rename!",
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
    }
    let re = await GIT_Commit(result.value);
    const regex = /\d* file changed, \d* insertion(s*)\(\+\), \d* deletion(s*)\(-\)/gm;
    if(!regex.exec(re.message)){
        Swal.fire({
            title: 'Error!',
            text: 'Commit did\'t work',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
    re = await GIT_Push();
}


const { ipcRenderer } = require('electron');

ipcRenderer.on('save', (evt, msg) => createOutputFile());
ipcRenderer.on('refresh', (evt, msg) => scriptLibRefreshFromFile());
ipcRenderer.on('create', (evt, msg) => createMethod());
ipcRenderer.on('remove', (evt, msg) => removeMethod());
ipcRenderer.on('rename', (evt, msg) => renameMethod());
ipcRenderer.on('set_test_mode', (evt, msg) => setTestMode());
ipcRenderer.on('generate_test_link', (evt, msg) => generateTestLink());
ipcRenderer.on('start_dev_server', (evt, msg) => startDevServer());
ipcRenderer.on('stop_dev_server', (evt, msg) => stopDevServer());
ipcRenderer.on('git_push', (evt, msg) => gitPushCode());
ipcRenderer.on('git_pull', (evt, msg) => gitPullCode());

