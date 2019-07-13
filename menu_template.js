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

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        accelerator: onMac() ? 'Command+I' : 'Ctrl+I',
        submenu: [{
                label: 'Toggle DevTools',
                click(_item, focusedWindows) {
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
                click(_item, focusedWindows) {
                    focusedWindows.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}

function onMac() {
    return process.platform == 'darwin';
}