
let methodId = 0;


function getClassSourceCode(sourceCode, className) {
    
    methods2Object = {};
    methodId = 0;
    methods2Object.name = className;
    brutFile = sourceCode;
    var ss = `^\\s*class\\s*${className}\\s*{\\s*`;
    ss = new RegExp(ss, "gm");
    let match = ss.exec(sourceCode)
    let startPosition = match.index;
    ss = new RegExp("// ###___END_OF_CLASS___###", "gm");
    match = ss.exec(sourceCode);
    let endPosition = match.index;
    methods2Object.startPosition = startPosition;
    methods2Object.endPosition = endPosition;
    return sourceCode.substring(startPosition,endPosition+4);
}

function classToObjectOld(sourceCode, className) {
    try {
        let classCode = getClassSourceCode(sourceCode, className)
        var re = /[^\t*]\b(?!function\b).*?\b\s*\w*\s*\(\w*\)\s*\{/gm
        methods2ObjectList = [];
        while ((match = re.exec(classCode)) != null) {
            let tempMeth = class2ObjReadMethod(classCode,match);
            // remove parse function from code:------------------------------
            let count = tempMeth.endPosition+1 - tempMeth.startPosition;
            let emptySpace = " ".repeat(count);
            classCode = classCode.substring(0,tempMeth.startPosition) + emptySpace + classCode.substring(tempMeth.endPosition+1);
            //---------------------------------------------------------------
            // remove return char \n and \r from the beginning and the end of the class code ------------------------
            if(tempMeth.body[0] === '\n' || tempMeth.body[0] === '\r') tempMeth.body = tempMeth.body.substring(1);
            if(tempMeth.body[tempMeth.body.length-1] === '\n' || tempMeth.body[tempMeth.body.length-1] === '\r') tempMeth.body = tempMeth.body.substring(0, tempMeth.body.length-1);
            // ------------------------------------------------------------------------------------------------------
            tempMeth.modified = false;
            // a method processed: ***********
            methods2ObjectList.push(tempMeth);
            //******************************* */
        }
        $(window).ready( () => {
            const helperSelected = (e) => {
                let txt = e.currentTarget.innerText;
                insertTextAtCursor("scriptLib."+txt+"(");
            }
            window.helperSelected = helperSelected;
            let listUL = $('#right-toolbar .helpers-list');
            let listLI = methods2ObjectList.map( i => i.name).sort().map( i => `<li class="list-item" onclick="helperSelected(event)">${i}</li>`).join('\n');
            listUL.html(listLI);
        });
        return methods2ObjectList;
    } catch (err) {
        return [];
    }
}


function class2ObjReadMethod(classCode,match) {
    let startPosition = match.index;
    let endDeclarationPosition = classCode.indexOf("{",startPosition);
    let methodName = classCode.substring(startPosition,endDeclarationPosition);
    let isAsync = methodName.includes("async");
    let args = methodName.split('(')[1].split(')')[0] ;
    args = args !== '' ? args : null
    methodName = methodName.split('(')[0].replaceAll('async','').replaceAll('\t','').replaceAll('\n','').replaceAll('\r','').replaceAll(' ','');
    let endPosition = getMethodBody(classCode,startPosition);
    // console.log("++++++++++",endPosition);
    let methodBody = "";
    methodBody = classCode.substring(endDeclarationPosition+1, endPosition);
    let method = {
        id: methodId,
        args: args,
        startPosition: startPosition,
        endPosition: endPosition,
        name: methodName,
        body: methodBody,
        isAsync: isAsync
    }
    previousMethodStartingPosition = startPosition;
    methodId++;
    return method;
}

// ##########################################################################################################################

function classToObject(sourceCode, className) {
    // Get the class source code
    const classSource = getClassSourceCode(sourceCode, className);
    window.dataLayer = [{ pageType: "Home" }];
    window.mcs = { user: "" };
    // Evaluate the class code to define the class and create an instance of it
    eval(classSource);
    const objectName = className.charAt(0).toLowerCase() + className.slice(1);
    const instance = eval(`${objectName}`);
  
    // Get the list of method names for the instance
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
  
    // Create an array to hold the method objects
    const methodObjects = [];
  
    // Iterate over the method names and create method objects
    methodNames.forEach((methodName) => {
      // Get the function body as a string
      const methodBody = instance[methodName].toString();
  
      // Determine if the function is async
      const isAsync = methodBody.startsWith("async ");
  
      // Get the start and end positions of the function body
      const startPos = methodBody.indexOf("{") + 1;
      const endPos = methodBody.lastIndexOf("}");
  
      // Get the function arguments as an array
      const argsMatch = methodBody.match(/\((.*?)\)/);
      const args = argsMatch ? argsMatch[1].split(",").map((arg) => arg.trim()) : [];
  
      // Create a method object and add it to the array
      const method = {
        id: methodName,
        args: args,
        startPosition: startPos,
        endPosition: endPos,
        name: methodName,
        body: methodBody,
        isAsync: isAsync,
      };
      methodObjects.push(method);
    });
  





    
    $(window).ready( () => {
        const helperSelected = (e) => {
            let txt = e.currentTarget.innerText;
            insertTextAtCursor("scriptLib."+txt+"(");
        }
        window.helperSelected = helperSelected;
        let listUL = $('#right-toolbar .helpers-list');
        let listLI = methodObjects.map( i => i.name).sort().map( i => `<li class="list-item" onclick="helperSelected(event)">${i}</li>`).join('\n');
        listUL.html(listLI);
    });
    // Return the array of method objects
    return methodObjects;
  }
  



module.exports = {
    classToObjectOld,
    classToObject
}
  