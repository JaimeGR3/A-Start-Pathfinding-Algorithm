# A Star Pathfinding App

## Overview
This is a desktop application that integrates an optimized A Star pathfinding algorithm. The app provides fast and efficient route calculations for grid structures, offering a clean and interactive interface to test and explore pathfinding solutions in real-time.

## Technologies Used
- **Electron**: For building the desktop application.
- **React**: For creating the user interface.
- **Node.js**: Backend logic and process management.
- **Python**: Pathfinding algorithm backend.
- **PyInstaller**: Used to compile the Python backend.

## Features
- Fast and optimized A* pathfinding algorithm.
- Interactive grid for real-time testing.
- Cross-platform compatibility via Electron.

---

## Development Setup

### Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (latest version recommended)
- [Python 3](https://www.python.org/downloads/) (Ensure it is added to the system path)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/JaimeGR3/PROYECTO_A.git
   cd PROYECTO_A
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Package the Python backend:
   ```bash
   cd src/lib
   python -m PyInstaller --onefile a_star.py
   ```
   If PyInstaller is not installed, you can install it by running:
    ```bash
   pip install pyinstaller
   ```
   This will generate an executable `a_star.exe` in the `dist` folder.

### Running the App in Development
To start the application in development mode:
```bash
npm electron-serve
```

The Electron app will launch, showing the interactive grid for pathfinding tests.

---
<!--
## Building the App for Production

To create an executable version of the app:

1. Build the React frontend:
```bash
npm run build
```

2. Navigate to the `./build/index.html` file and ensure the resource paths are relative. Modify the following lines as
shown below:
```html
<script defer="defer" src="./static/js/main.1fabf1f2.js"></script>
<link href="./static/css/main.36b3283a.css" rel="stylesheet">
```

3. Package the Electron application:
```bash
npm run make
```

The packaged app can be found in the `out` directory.

---
-->
## Usage

1. Launch the application.
2. Define the starting and goal points on the grid.
3. Click "Run A\*" to calculate the optimal path.
4. The path will be highlighted in real-time on the grid.
5. Click on grid cells to place or remove obstacles dynamically; the path will update automatically based on the
changes.

### Color Legend
- **Blue**: The optimal path.
- **Green**: Nodes considered when calculating the path.
- **Red**: Blocked cells (obstacles).

---


## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

## License
This project has no license.

