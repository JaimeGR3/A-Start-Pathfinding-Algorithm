const { contextBridge, ipcRenderer } = require('electron');

// Usar contextBridge para exponer funciones de IPC de forma segura
contextBridge.exposeInMainWorld('electron', {
    // Esta función ejecutará el algoritmo A* en Python
    runAStarAlgorithm: (array, start, goal) => {
        // Enviar los datos y puntos de inicio y fin al proceso principal (Python)
        return ipcRenderer.invoke('run-a-star', array, start, goal);
    }
});
