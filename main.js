const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

process.env.NODE_ENV = 'test';

let mainWindow;
let addWindow;

// Main method
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('focus', function() {
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        Menu.setApplicationMenu(mainMenu);
    });

    mainWindow.on('closed', function() {
        app.quit();
    });
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Shopping List Item',
        parent: mainWindow,
        modal: true
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.on('focus', function() {
        const addMenu = Menu.buildFromTemplate(secondaryMenuTemplate);
        Menu.setApplicationMenu(addMenu);
    });

    addWindow.on('close', function() {
        addWindow = null;
    });
};

const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
            label: 'Add Item',
            accelerator: onMac() ? 'Command+N' : 'Ctrl+N',
            click() {
                createAddWindow();
            }
        },
        {
            label: 'Clear Items',
            accelerator: onMac() ? 'Command+W' : 'Ctrl+W',
            click() {
                mainWindow.webContents.send('item:clear');
            }
        },
        {
            label: 'Quit',
            accelerator: onMac() ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}];

const secondaryMenuTemplate = [{
    label: 'File',
    submenu: [{
        label: 'Quit',
        accelerator: onMac() ? 'Command+Q' : 'Ctrl+Q',
        click() {
            app.quit();
        }
    }]
}];

if (onMac()) {
    mainMenuTemplate.unshift({});
    secondaryMenuTemplate.unshift({});
}

// Dev mode handler
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        accelerator: onMac() ? 'Command+I' : 'Ctrl+I',
        submenu: [{
                label: 'Toggle DevTools',
                click(item, focusedWindows) {
                    focusedWindows.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });

    secondaryMenuTemplate.push({
        label: 'Developer Tools',
        accelerator: onMac() ? 'Command+I' : 'Ctrl+I',
        submenu: [{
                label: 'Toggle DevTools',
                click(item, focusedWindows) {
                    focusedWindows.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}

// Base check method for a platform
function onMac() {
    return process.platform == 'darwin';
}

// Main logic for sending values
ipcMain.on('item:add', function(e, item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})