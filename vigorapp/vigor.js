const logger = require('simple-node-logger').createSimpleLogger();

logger.setLevel('debug');

const {app, BrowserWindow} = require('electron');

const path = require('path');
const url = require('url');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;


function readSettings() {

    var DEFAULT_WIDTH = 800;
    var DEFAULT_HEIGHT = 600;

    function validateSettings(loadedSettings) {
        if (loadedSettings == null) {
            loadedSettings = {};
        }

        if (loadedSettings.width == null) {
            loadedSettings.width = DEFAULT_WIDTH;
        }
        if (loadedSettings.height == null) {
            loadedSettings.height = DEFAULT_HEIGHT;
        }

        return loadedSettings;
    }

    const jsonFile = require('jsonfile');
    const settingsFile = path.join(__dirname, 'settings/settings.json');

    var loadedSettings = jsonFile.readFileSync(settingsFile);

    logger.debug(loadedSettings);

    const settings = validateSettings(loadedSettings);

    logger.debug(settings);

    return settings;
}

const settings = readSettings();

function createWindow(settings) {
// Create the browser window.
// Read from settings file

    win = new BrowserWindow({
        width: settings.width,
        height: settings.height
    });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});
