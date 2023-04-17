
let isMac = false;

if (process.platform == 'darwin') {
    isMac = true;
}





const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        { role: 'user_refresh', label: "Reload", click: (e) => handleMenuActions(e), accelerator: isMac ? 'Alt+Cmd+R' : 'Alt+Ctrl+R'  },
        { role: 'user_safe_refresh', label: "Safe Reload", click: (e) => handleMenuActions(e), accelerator: isMac ? 'Alt+Cmd+T' : 'Alt+Ctrl+T'  },
        { type: 'separator' },
        { role: 'user_save', label: "Save", click: (e) => handleMenuActions(e), accelerator: isMac ? 'Cmd+S' : 'Ctrl+S' },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: "Themes",
      submenu: [
        { label: "Light", click: (e) => handleMenuActions(e) },
        { label: "One dark", click: (e) => handleMenuActions(e) },
        { label: "One dark highlight style", click: (e) => handleMenuActions(e) },
        { label: "One dark theme", click: (e) => handleMenuActions(e) }
      ]
    },
    {
      label: "Fiction",
      submenu: [
        { label: "Create", click: (e) => handleMenuActions(e) },
        { label: "Remove", click: (e) => handleMenuActions(e) },
        { label: "Rename", click: (e) => handleMenuActions(e) },
        { label: "Set ON/OFF Test Mode", click: (e) => handleMenuActions(e) },
        { label: "Generate Test Link", click: (e) => handleMenuActions(e) }
      ]
    },
    {
      label: "Developement Test Server",
      submenu: [
        { label: "Start Development Server (DTS)", click: (e) => handleMenuActions(e) },
        { label: "Stop Development Server (DTS)", click: (e) => handleMenuActions(e) },
      ]
    },
    {
      label: "GIT Operations",
      submenu: [
        { label: "Commit Code", click: (e) => handleMenuActions(e) },
        { label: "Push Code", click: (e) => handleMenuActions(e) },
        { label: "Pull Code", click: (e) => handleMenuActions(e) },
        { type: 'separator' },
        { label: "Refresh Commit List", click: (e) => handleMenuActions(e) },
        { label: "Update Log Seach Param", click: (e) => handleMenuActions(e) },
      ]
    },
    {
      label: "Deploy",
      submenu: [
        { label: "Deploy to server", click: (e) => handleMenuActions(e) },
        { type: 'separator' },
        { label: "Settings", click: (e) => handleMenuActions(e) },
      ]
    },
    {
      label: "Export",
      submenu: [
        { label: "Export to new format text", click: (e) => handleMenuActions(e) },
        { label: "Export to new format base64", click: (e) => handleMenuActions(e) }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      role: 'help',
      label: '?',
      submenu: [
        { label: 'About', click: (e) => handleMenuActions(e) },
      ]
    }
  ]

/*

const args = process.argv;
if(!args.includes("--debug")) { // if not debug mode:
  // remove menu item: View -> Reload
  // remove menu item: View -> Force Reload
  // remove menu item: View -> Toggle Developer Tools
  template[2].submenu.splice(3,1);  // separator
  template[2].submenu.splice(2,1);  // Toggle Developer Tools
  template[2].submenu.splice(1,1);  // Force Reload
  template[2].submenu.splice(0,1);  // Reload
}
*/

let mainWindow ;

setTimeout(() => {
  // delay this until the window finish it s initialization process
  const { BrowserWindow, Menu } = require('electron');
  mainWindow = BrowserWindow.getAllWindows()[0];
  
}, 500);

function handleMenuActions(evt) {
  switch(evt.label) {
      case "Save":
          mainWindow.webContents.send('save');
      break;
      case "Reload":
          mainWindow.webContents.send('refresh');
      break;
      case "Safe Reload":
          mainWindow.webContents.send('safe_refresh');
      break;
      case "Create":
          mainWindow.webContents.send('create');
      break;
      case "Remove":
          mainWindow.webContents.send('remove');
      break;
      case "Rename":
          mainWindow.webContents.send('rename');
      break;
      case "Set ON/OFF Test Mode":
          mainWindow.webContents.send('set_test_mode');
      break;
      case "Generate Test Link":
          mainWindow.webContents.send('generate_test_link');
      break;
      case "Start Development Server (DTS)":
          mainWindow.webContents.send('start_dev_server');
      break;
      case "Stop Development Server (DTS)":
          mainWindow.webContents.send('stop_dev_server');
      break;
      case "Commit Code":
          mainWindow.webContents.send('git_commit');
      break;
      case "Push Code":
          mainWindow.webContents.send('git_push');
      break;
      case "Pull Code":
          mainWindow.webContents.send('git_pull');
      break;
      case "Refresh Commit List":
          mainWindow.webContents.send('git_log');
      break;
      case "Update Log Seach Param":
          mainWindow.webContents.send('git_log_update_params');
      break;
      case "Deploy to server":
          mainWindow.webContents.send('deploy_to_server');
      break;
      case "About":
        mainWindow.webContents.send('about_codeeditor');
      break;
      case "Light":
        mainWindow.webContents.send('theme0');
      break;
      case "One dark":
        mainWindow.webContents.send('theme1');
      break;
      case "One dark highlight style":
        mainWindow.webContents.send('theme2');
      break;
      case "One dark theme":
        mainWindow.webContents.send('theme3');
      break;
      case "Export to new format text":
        mainWindow.webContents.send('export');
      break;
      case "Export to new format base64":
        mainWindow.webContents.send('export64');
      break;
  }
}

module.exports = {
    template
}