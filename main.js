/*
    Facilitas Calculator
    App Controller
    Handles control of the app through Electron.
*/

/// Imports
const { app, BrowserWindow } = require('electron');

/// Functions
// Creates a new window
function createWindow() {
    // Create the window
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load the index html
    win.loadFile('index.html');

    // Open dev tools
    win.webContents.openDevTools();
}

/// App Initlization
// Wait for the app to be ready and open the initial window
app.whenReady().then(createWindow);

// Handle quit conditions
app.on('window-all-closed', () => {
    // Leave open on Mac to match native
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle activation conditions
app.on('activate', () => {
    // Check if the inital window needs to be made again
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    };
});

// TODO: The real functionality