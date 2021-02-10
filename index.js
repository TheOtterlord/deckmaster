const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { autoUpdater } = require("electron-updater");
const discordRPC = require('discord-rpc');

const clientId = '794611884316950559';
discordRPC.register(clientId);
const rpc = new discordRPC.Client({ transport: 'ipc' });

const startTimestamp = new Date();

let win;

function createWindow() {
  win = new BrowserWindow({
    icon: 'favicon.ico',
    show: false,
    backgroundColor: '#202020',
    frame: false,
    titleBarStyle: 'hidden',
    minWidth: 640,
    minHeight: 480,
    webPreferences: {
      webgl: true,
      webSecurity: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      // the default of `contextIsolation` is deprecated and will be changing from false to true in a future release of Electron.
      // when deprecated, remove `nodeIntegration: true` but keep this
      contextIsolation: false
    }
  });

  // open links in native browser
  win.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  // Load the web app
  var index_path = path.join(__dirname, 'index.html');
  win.loadURL(url.format({
    pathname: index_path,
    protocol: 'file:',
    slashes: true
  }));

  ipcMain.on('update', () => {
    autoUpdater.quitAndInstall();
  });

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("cmd", process.argv);
  });

  // Once loaded, show the screen
  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
    win.maximize();
    win.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function sendStatusToWindow(text) {
  win.webContents.send('message', text);
}

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('update-downloaded');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('update-available');
});

autoUpdater.on('download-progress', (progressObj) => {
  sendStatusToWindow('progress:' + Math.round(progressObj.percent));
});

function updateActivity() {
  if (!rpc) return;
  rpc.setActivity({
    details: `Deck building`,
    // state: '',
    largeImageKey: 'main-icon',
    largeImageText: 'Yu-Gi-Oh!',
    startTimestamp,
    instance: false,
  });
}

rpc.on('connected', () => {
  win.webContents.send("discord", true);
});

rpc.on('disconnected', () => {
  win.webContents.send("discord", false);
});

rpc.on('ready', () => {
  updateActivity();
  setTimeout(updateActivity, 60e3);
});

rpc.login({ clientId }).catch(console.error);
