import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Dopdown from '../components/Dopdown';
import SettingInfo from '../components/SettingInfo'
import '../css/main.css';
export default function Main() {
    const [axisX, setAxisX] = useState();
    const [axisY, setAxisY] = useState();
    const [coordinates, setCoordinates] = useState([]);
    const [grid, setGrid] = useState([]);
    const [start, setStart] = useState('(0,0)')
    const [goal, setGoal] = useState('(0,0)')
    const [path, setPath] = useState([]);
    const [neighbors, setNeighbors] = useState([])
    const [message, setMessage] = useState('')
    const [terrain, setTerrain] = useState(0)
    const obstacles = [
        { content: "Blocked (Red)", value: 0 },
        { content: "Road (Gray)", value: 1 },
        { content: "Gravel (Brown)", value: 2 },
        { content: "Sand (Yellow)", value: 3 },
        { content: "Grass (Green)", value: 2.5 },
        { content: "Shallow Water (Light Blue)", value: 3 },
        { content: "Moderate Water (Blue)", value: 4 },
        { content: "Deep Water (Dark Blue)", value: 6 },
        { content: "Stream (Turquoise)", value: 3 },
        { content: "Swamp (Olive Green)", value: 5 },
        { content: "Flood (Brownish Blue)", value: 8 },
        { content: "Mud (Dark Brown)", value: 4 },
        { content: "Mountain (Grayish Brown)", value: 5 },
        { content: "Forest (Dark Green)", value: 4 },
        { content: "Dirt (Light Brown)", value: 2 },
        { content: "Bridge (Wooden Brown)", value: 1.1 }
    ];


    useEffect(() => {
        generateCoordinates(axisX, axisY);
        const array = generateArray();
        setGrid(array)
    }, [axisX, axisY]);

    useEffect(() => {
        setAxisX(10)
        setAxisY(10)
    }, []);

    const generateCoordinates = (x, y) => {
        const newCoordinates = [];
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                newCoordinates.push({
                    value: `(${i},${j})`,
                    content: `(${i},${j})`
                });
            }
        }
        setCoordinates(newCoordinates);
    };

    const handleAxisX = (e) => {
        let x = Number(e.target.value)
        if (x > 400) {
            x = 400
        }
        if (x === 0) {
            x = 1
        }
        setAxisX(x)
    }
    const handleAxisY = (e) => {
        let y = Number(e.target.value)
        if (y > 400) {
            y = 400
        }
        if (y === 0) {
            y = 1 
        }
        setAxisY(y)
    }

    const handleGoal = (event) => {
        setGoal(event.target.value)
    };

    const handleStart = (event) => {
        setStart(event.target.value)
    };
    
    const handleTerrain = (event) => {
        setTerrain(Number(event.target.value));
    };

    const handleRunAlgorithm = async () => {
        try {
            const [startX, startY] = start.replace(/[()]/g, "").split(",").map(Number);
            const [goalX, goalY] = goal.replace(/[()]/g, "").split(",").map(Number);

            if (grid[startX][startY] === 0 || grid[goalX][goalY] === 0) {
                setMessage('Start or Goal is in a blocked cell');
                return;
            }

            setMessage('')
            resetPathCells();
            console.log(grid)
            console.log(start, goal)
            const result = await window.electron.runAStarAlgorithm(grid, start, goal);
            if (result) {
                setPath(result[0]);
                setNeighbors(result[1])
            } else {
                setPath([]);
                setNeighbors([])
            }
        } catch (err) {
            setMessage('Error running A*:', err);
        }
    };

    const resetPathCells = () => {
        const updatedGrid = grid.map(row =>
            row.map(cell => (cell === 11 || cell === 12 ? 1 : cell))
        );
        setGrid(updatedGrid);
    };
    useEffect(() => {
        resetPathCells();

        const updatedGrid = grid.map((row, x) =>
            row.map((cell, y) => {
                const isPathCell = path.some(([px, py]) => px === x && py === y);
                const isProcessedCell = neighbors.some(([nx, ny]) => nx === x && ny === y);

                if (isPathCell) return 11
                if (isProcessedCell) return 12
                return cell;
            })
        );

        setGrid(updatedGrid);
    }, [path, neighbors]);

    const generateArray = () => {
        const array = Array(axisX).fill().map(() => Array(axisY).fill(1));
        return array;
    };

    const getClassNameForCell = (cellValue) => {
        switch (cellValue) {
            case 11:
                return 'path'; // Path (Blue)
            case 12:
                return 'processed'; // Processed (Yellow)
            case 0:
                return 'blocked'; // Blocked (Red)
            case 1:
                return ''; // Road (Gray)
            case 2:
                return 'gravel'; // Gravel (Brown)
            case 3:
                return 'sand'; // Sand (Yellow)
            case 2.5:
                return 'grass'; // Grass (Green)
            case 3:
                return 'shallow-water'; // Shallow Water (Light Blue)
            case 4:
                return 'moderate-water'; // Moderate Water (Blue)
            case 6:
                return 'deep-water'; // Deep Water (Dark Blue)
            case 3.1:
                return 'stream'; // Stream (Turquoise)
            case 5:
                return 'swamp'; // Swamp (Olive Green)
            case 8:
                return 'flood'; // Flood (Brownish Blue)
            case 4.1:
                return 'mud'; // Mud (Dark Brown)
            case 5.1:
                return 'mountain'; // Mountain (Grayish Brown)
            case 4.2:
                return 'forest'; // Forest (Dark Green)
            case 2.2:
                return 'dirt'; // Dirt (Light Brown)
            case 1.1:
                return 'bridge'; // Bridge (Wooden Brown)
            default:
                return ''; // Default case if no match
        }
    };


    const toggleCell = (x, y) => {
        const updatedGrid = [...grid];
        console.log(terrain)
        console.log(grid)
        updatedGrid[x][y] = terrain;
        setGrid(updatedGrid);
        setMessage('To see the path changes, click on "Run A Star Algorithm"')
    };

    return (
        <div className="conteiner">
            <Helmet>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>A Star</title>
            </Helmet>
            <main className="main-content">
                <section className='array_size_section'>
                    <div className='imput-container'>
                        <span className='dopdown-title'>X</span>
                        <SettingInfo />
                        <input
                            id="axisX"
                            type="number"
                            min="1"
                            value={axisX}
                            onChange={handleAxisX}
                        />
                    </div>
                    <div className='imput-container'>
                        <span className='dopdown-title'>Y</span>
                        <SettingInfo />
                        <input
                            id="axisY"
                            type="number"
                            min="1"
                            value={axisY}
                            onChange={handleAxisY}
                        />
                    </div>
                </section>
                <section className='dropdown-section'>
                    <Dopdown title="Start" data={coordinates} onChange={handleStart} />
                    <Dopdown title="Goal" data={coordinates} onChange={handleGoal} />
                </section>
                <Dopdown title="Terrain" data={obstacles} onChange={handleTerrain} />
                <section className='message-section'>
                    <div>

                    </div>
                    <button onClick={handleRunAlgorithm}>Run A Star Algorithm</button>
                    <span className='message'>{message}</span>
                </section>
                <section className="grid-container">
                    {grid.map((row, x) => (
                        <div key={x} className="row">
                            {row.map((cell, y) => (
                                <div
                                    key={`${x}-${y}`}
                                    className={`cell ${getClassNameForCell(cell)}`}
                                    onClick={() => toggleCell(x, y)}
                                >
                                    <span className="cell-text">{`(${x},${y})`}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
