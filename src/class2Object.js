
let methodId = 0;

function classToObject(sourceCode, className) {
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
    let classCode = sourceCode.substring(startPosition,endPosition+4);
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
    return methods2ObjectList;
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


module.exports = {
    classToObject
}
  