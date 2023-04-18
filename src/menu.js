
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
        { label: "3024-day", click: (e) => handleMenuActions(e) },
        { label: "3024-night", click: (e) => handleMenuActions(e) },
        { label: "abbott", click: (e) => handleMenuActions(e) },
        { label: "abcdef", click: (e) => handleMenuActions(e) },
        { label: "ambiance", click: (e) => handleMenuActions(e) },
        { label: "ayu-dark", click: (e) => handleMenuActions(e) },
        { label: "ayu-mirage", click: (e) => handleMenuActions(e) },
        { label: "base16-dark", click: (e) => handleMenuActions(e) },
        { label: "bespin", click: (e) => handleMenuActions(e) },
        { label: "base16-light", click: (e) => handleMenuActions(e) },
        { label: "blackboard", click: (e) => handleMenuActions(e) },
        { label: "cobalt", click: (e) => handleMenuActions(e) },
        { label: "colorforth", click: (e) => handleMenuActions(e) },
        { label: "dracula", click: (e) => handleMenuActions(e) },
        { label: "duotone-dark", click: (e) => handleMenuActions(e) },
        { label: "duotone-light", click: (e) => handleMenuActions(e) },
        { label: "eclipse", click: (e) => handleMenuActions(e) },
        { label: "elegant", click: (e) => handleMenuActions(e) },
        { label: "erlang-dark", click: (e) => handleMenuActions(e) },
        { label: "gruvbox-dark", click: (e) => handleMenuActions(e) },
        { label: "hopscotch", click: (e) => handleMenuActions(e) },
        { label: "icecoder", click: (e) => handleMenuActions(e) },
        { label: "isotope", click: (e) => handleMenuActions(e) },
        { label: "juejin", click: (e) => handleMenuActions(e) },
        { label: "lesser-dark", click: (e) => handleMenuActions(e) },
        { label: "liquibyte", click: (e) => handleMenuActions(e) },
        { label: "lucario", click: (e) => handleMenuActions(e) },
        { label: "material", click: (e) => handleMenuActions(e) },
        { label: "material-darker", click: (e) => handleMenuActions(e) },
        { label: "material-palenight", click: (e) => handleMenuActions(e) },
        { label: "material-ocean", click: (e) => handleMenuActions(e) },
        { label: "mbo", click: (e) => handleMenuActions(e) },
        { label: "mdn-like", click: (e) => handleMenuActions(e) },
        { label: "midnight", click: (e) => handleMenuActions(e) },
        { label: "monokai", click: (e) => handleMenuActions(e) },
        { label: "moxer", click: (e) => handleMenuActions(e) },
        { label: "neat", click: (e) => handleMenuActions(e) },
        { label: "neo", click: (e) => handleMenuActions(e) },
        { label: "night", click: (e) => handleMenuActions(e) },
        { label: "nord", click: (e) => handleMenuActions(e) },
        { label: "oceanic-next", click: (e) => handleMenuActions(e) },
        { label: "panda-syntax", click: (e) => handleMenuActions(e) },
        { label: "paraiso-dark", click: (e) => handleMenuActions(e) },
        { label: "paraiso-light", click: (e) => handleMenuActions(e) },
        { label: "pastel-on-dark", click: (e) => handleMenuActions(e) },
        { label: "railscasts", click: (e) => handleMenuActions(e) },
        { label: "rubyblue", click: (e) => handleMenuActions(e) },
        { label: "seti", click: (e) => handleMenuActions(e) },
        { label: "shadowfox", click: (e) => handleMenuActions(e) },
        { label: "solarized", click: (e) => handleMenuActions(e) },
        { label: "the-matrix", click: (e) => handleMenuActions(e) },
        { label: "tomorrow-night-bright", click: (e) => handleMenuActions(e) },
        { label: "tomorrow-night-eighties", click: (e) => handleMenuActions(e) },
        { label: "ttcn", click: (e) => handleMenuActions(e) },
        { label: "twilight", click: (e) => handleMenuActions(e) },
        { label: "vibrant-ink", click: (e) => handleMenuActions(e) },
        { label: "xq-dark", click: (e) => handleMenuActions(e) },
        { label: "xq-light", click: (e) => handleMenuActions(e) },
        { label: "yeti", click: (e) => handleMenuActions(e) },
        { label: "idea", click: (e) => handleMenuActions(e) },
        { label: "darcula", click: (e) => handleMenuActions(e) },
        { label: "yonce", click: (e) => handleMenuActions(e) },
        { label: "zenburn", click: (e) => handleMenuActions(e) }
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
      default:
      mainWindow.webContents.send("theme", evt.label);
  }
}

module.exports = {
    template
}