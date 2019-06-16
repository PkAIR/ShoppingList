const electron = require('electron');
const url = require('url');
const path = require('path');


const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', function() {
        app.quit();
    });
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Shopping List Item'
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.on('close', function() {
        addWindow = null;
    });
};

ipcMain.on('item:add', function(e, item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
            label: 'Add Item',
            accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
            click() {
                createAddWindow();
            }
        },
        {
            label: 'Clear Items',
            accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
            click() {
                mainWindow.webContents.send('item:clear');
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}];

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
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