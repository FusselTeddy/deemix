const { app, BrowserWindow, globalShortcut, ipcMain, shell, dialog, Menu} = require('electron')
const contextMenu = require('electron-context-menu')
const WindowStateManager = require('electron-window-state-manager')
const path = require('path')

const PORT = process.env.PORT || '6595'

function isDev() {
  return process.argv[2] == '--dev';
}

let win
const windowState = new WindowStateManager('mainWindow', {
  defaultWidth: 800,
  defaultHeight: 600
})

function createWindow () {
  require('./server/dist/app.js')
  win = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.setMenu(null)

  if (isDev()){
    globalShortcut.register('f5', function() {
      win.reload()
    })
    globalShortcut.register('f12', function() {
      win.webContents.openDevTools()
    })
  }

  // Open links in external browser
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault()
    shell.openExternal(url)
  })

  win.loadURL(`http://localhost:${PORT}`)

  if (windowState.maximized) {
    win.maximize();
  }

  win.on('close', (event)=>{
    windowState.saveState(win);
  })
}

app.whenReady().then(() => {
  createWindow()
  contextMenu({
    showLookUpSelection: false,
    showSearchWithGoogle: false,
    showInspectElement: false
  })

  // Only one istance per time
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('openDownloadsFolder', (event)=>{
  const { downloadLocation } = require('./server/dist/main.js').settings
  shell.openPath(downloadLocation)
})

ipcMain.on('selectDownloadFolder', async (event, downloadLocation)=>{
  let path = await dialog.showOpenDialog(win, {
    defaultPath: downloadLocation,
    properties: ["openDirectory", "createDirectory"]
  })
  if (path.filePaths[0]) win.webContents.send("downloadFolderSelected", path.filePaths[0])
})
