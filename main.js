const electron = require('electron');
const ToDoList = require('./models/todo_list');
const url = require('url');
const path = require('path');
const fs = require('fs');
const os = require('os');

const { app, BrowserWindow, Menu, ipcMain } = electron;
const PATH_TO_FILE = 'assets/items.txt';

global.toDoList = new ToDoList([]);
readItemsFromFile();

process.env.NODE_ENV = 'test';

let mainWindow;
let addWindow;

// Main method
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.show();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('items:upload', global.toDoList);
    });

    mainWindow.on('focus', () => {
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        Menu.setApplicationMenu(mainMenu);
    });

    mainWindow.on('closed', () => {
        app.quit();
    });
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Shopping List Item',
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.on('focus', () => {
        const addMenu = Menu.buildFromTemplate(secondaryMenuTemplate);
        Menu.setApplicationMenu(addMenu);
    });

    addWindow.on('close', () => {
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
    mainMenuTemplate.unshift({ label: '' });
    secondaryMenuTemplate.unshift({ label: '' });
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

ipcMain.on('item:add', (e, item) => {
    mainWindow.webContents.send('item:add', item);
    global.toDoList.addItem(item);
    writeItemsToFile(global.toDoList.getToDoList())
    addWindow.close();
})

ipcMain.on('items:flush', (e, item) => {
    global.toDoList.deleteToDoList();
    writeItemsToFile(global.toDoList.getToDoList())
})

ipcMain.on('item:delete', (e, item) => {
    global.toDoList.deleteItem(item);
    writeItemsToFile(global.toDoList.getToDoList())
})

function readItemsFromFile() {
    fs.readFile(PATH_TO_FILE, { encoding: 'utf-8' }, (err, data) => {
        if (err) throw error;

        let dataArray = (data.split(os.EOL)).filter((elem) => {
            return elem.trim();
        });

        dataArray.forEach((elem) => {
            global.toDoList.addItem(elem);
        });
    });
}

function writeItemsToFile() {
    const updatedData = global.toDoList.getToDoList().join(os.EOL);
    fs.writeFile(PATH_TO_FILE, updatedData, (err) => {
        if (err) throw err;
    });
}