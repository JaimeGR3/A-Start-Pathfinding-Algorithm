const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execFile } = require('child_process');  

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 700,
        minWidth: 800,
        minHeight: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });
    //win.loadFile(path.join(__dirname, '../build', 'index.html'));
    win.loadURL('http://localhost:3000');

    return win;
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('run-a-star', async (event, array, start, goal) => {
        try {
            const result = await runAStar(array, start, goal);
            return result;
        } catch (err) {
            console.error('Error running A*:', err);
            return null;
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
});

function runAStar(array, start, goal) {
    return new Promise((resolve, reject) => {
        const exeFilePath = path.join(__dirname, 'lib', 'dist', 'a_star.exe');

        execFile(exeFilePath, [JSON.stringify(array), start, goal], (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`Executable error: ${stderr}`);
                reject(stderr);
                return;
            }
            try {
                resolve(JSON.parse(stdout.toString()));
            } catch (parseError) {
                reject(`JSON parse error: ${parseError}`);
            }
        });
    });
}