
/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Wed Mar 16 2022 @ 12:25
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
 if (window.localStorage.debug === 'true') {
    window.scriptLibStartTime = new Date().getTime();
    console.warn("SCRIPT LIB START TIME: ", window.scriptLibStartTime);
}

function die(msg = "") {
    throw msg != "" ? msg : "dead!!!";
}
if (window.isLibLoaded) {
    console.warn("Script Lib was already loaded");
    die();
}
console.info(
    "%c Script Lib was loaded successfully! ",
    "background: #222; color: #bada55"
);
window.isLibLoaded = true;
window.block3DaysFunc = false;

function fix_jQueryDollarSign() {
    // This function will fix jquery dollar dign problem temporary

    console.log("started jquery fixer");
    let startTime = new Date().getTime();
    let hwd = setInterval(() => {
        $ = jQuery;
        if (startTime + 20000 <= new Date().getTime()) {
            clearInterval(hwd);
            console.log("jquery fixer finished after 20 seconds");
        }
    }, 1);
}
// fix_jQueryDollarSign();

/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Thu Mar 24 2022 @ 16:25
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
