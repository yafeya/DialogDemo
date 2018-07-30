
const electron = require('electron');
const ChildProcess = require('child_process');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const glob = require('glob')
const path = require('path')
const os = require('os');
const ipc = electron.ipcMain;
const Menu = electron.Menu
const localshortcut = require('electron-localshortcut');
const settings = require('electron-settings');

let mainWindow;
let debug = false;
let quitApp = true;
let title = 'Keysight Connection Expert';

function isMac() {
    return process.mas || os.platform() == "darwin";
}
function isLinux() {
    return os.platform() == 'linux';
}
function isWindows() {
    return os.platform() == 'win32';
}


function initialize() {

    loadModules();

    function createWindow() {

        const winSetting = settings.get('main-window');

        let options = {
            width: 1280,
            height: 800,
            minWidth: 460,
            name: 'mainWindow',
            backgroundColor: '#eceff4',
            icon: `${__dirname}/assets/app-icon/win/app.ico`,
            title: title
            // webPreferences: { nodeIntegration: false }  // this is a magic switch t avoid jQuery loading issue. But, don't use it if we need node APIs
        };


        if (isMac()) {
            app.setName(title);
            //options.titleBarStyle = 'hidden';
            options.icon = `${__dirname}/assets/app-icon/png/app.png`;
        } else {
            //options.frame = false;       
            options.icon = `${__dirname}/assets/app-icon/png/app.png`;
        }

        mainWindow = new BrowserWindow(options);

        if (winSetting) {
            mainWindow.setBounds(winSetting);
        }
        mainWindow.loadURL(`file://${__dirname}/index.html`);

        let contents = mainWindow.webContents;

        mainWindow.on('close', (e) => {
            let bounds = mainWindow.getBounds();
            settings.set('main-window', bounds);

            if (quitApp) {

                mainWindow = null;
            } else {
                e.preventDefault();
                contents.send('mw:command', 'Exit');
                mainWindow.hide();
            }
        });

        mainWindow.once('ready-to-show', () => {
            // console.timeEnd('init')
            // localshortcut.unregisterAll(mainWindow);
        });


        if (debug) {
            contents.openDevTools();
        }
        // hide main menu
        Menu.setApplicationMenu(null);

        localshortcut.register(mainWindow, 'Ctrl+Shift+I', () => {
            mainWindow.toggleDevTools();
        });
    }

    app.on('ready', createWindow);

    app.on('window-all-closed', function () {
        if (process.platform != 'darwin') {
            app.quit();
        }
    });

    app.on('activate', function () {
        if (mainWindow == null) {
            createWindow();
        }
    });

    app.on('before-quit', function (e) {
        quitApp = true;
    });

    ipc.on('kce:minimize', () => {
        mainWindow.minimize();
    });
    ipc.on('kce:maximize', () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });
    ipc.on('kce:exit', () => {
        quitApp = true;
        app.quit();
    });
}

function loadModules() {
    try {
        let dir = path.join(__dirname, './electron/electron-main/*.js');
        console.log(dir);
        let files = glob.sync(dir);
        files.forEach(function (file) {
            console.log(file);
            require(file);
        });

    } catch (error) {
        console.log(error);
    }
};


// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
    case '--squirrel-obsolete':
    case '--squirrel-updated':
        app.quit()
        break
    default:
        initialize()
}