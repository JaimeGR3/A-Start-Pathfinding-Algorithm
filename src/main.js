const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execFile } = require('child_process');  

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 750,
        minWidth: 800,
        minHeight: 750,
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
            await runAStar(array, start, goal, win);
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

function runAStar(array, start, goal, win) {
    return new Promise((resolve, reject) => {
        const exeFilePath = path.join(__dirname, 'lib', 'dist', 'a_star.exe');
        //const exeFilePath = path.join(__dirname, 'lib', 'a_star.py');
        //const pythonProcess = execFile('python', [path.join(__dirname, 'lib', 'a_star.py'), JSON.stringify(array), start, goal]);
        const pythonProcess = execFile(exeFilePath, [JSON.stringify(array), start, goal]);
        pythonProcess.stdout.on('data', (data) => {
            try {
                console.log(`From Python in main.js: ${data.toString()}`);
                const processedData = JSON.parse(data.toString());
                // Enviar los nodos procesados al front-end en tiempo real
                if (win) {
                    console.log('Sending processed data to front-end:', processedData);
                    win.webContents.send('update-processed', processedData);
                }
            } catch (err) {
                console.error('Error parsing processed data:', err);
            }
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python process closed with code ${code}`);
            resolve();
        });

        pythonProcess.on('error', (error) => {
            console.error(`Execution error: ${error.message}`);
            reject(error);
        });
    });
}