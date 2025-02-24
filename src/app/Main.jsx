import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Dopdown from '../components/Dopdown';
import SettingInfo from '../components/SettingInfo';
import '../css/main.css';

export default function Main() {
    const [axisX, setAxisX] = useState();
    const [axisY, setAxisY] = useState();
    const [coordinates, setCoordinates] = useState([]);
    const [grid, setGrid] = useState([]);
    const [pathGrid, setPathGrid] = useState([]);
    const [start, setStart] = useState('(0,0)');
    const [goal, setGoal] = useState('(0,0)');
    const [path, setPath] = useState([]);
    const [neighbors, setNeighbors] = useState([]);
    const [message, setMessage] = useState('');
    const [terrain, setTerrain] = useState(0);
    const [result, setResult] = useState(false);
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
        setGrid(array);
        setPathGrid(array)
    }, [axisX, axisY]);

    useEffect(() => {
        setAxisX(10);
        setAxisY(10);
    }, []);

    useEffect(() => {
        window.electron.ipcRenderer.on('update-processed', (data) => {
            if (data[0] === '11') {
                if (data[1] === null) {
                    setMessage('No path found');
                    setNeighbors([]);
                } else {
                    setPath(data[1]);
                }
            } else if (data[0] === '12') {
                setNeighbors((prevNeighbors) => [...prevNeighbors, data[1]]);
            }
        });
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
        let x = Number(e.target.value);
        if (x > 400) {
            x = 400;
        }
        if (x === 0) {
            x = 1;
        }
        setAxisX(x);
    };

    const handleAxisY = (e) => {
        let y = Number(e.target.value);
        if (y > 400) {
            y = 400;
        }
        if (y === 0) {
            y = 1;
        }
        setAxisY(y);
    };

    const handleGoal = (event) => {
        setGoal(event.target.value);
    };

    const handleStart = (event) => {
        setStart(event.target.value);
    };

    const handleTerrain = (event) => {
        setTerrain(Number(event.target.value));
    };

    const generateArray = () => {
        const array = Array(axisX).fill().map(() => Array(axisY).fill(1));
        return array;
    };

    const handleResult = () => {
        setResult(!result)
    }

    const getClassNameForCell = (cellValue) => {
        switch (cellValue) {
            case 0:
                return 'blocked';
            case 1:
                return 'road';
            case 2:
                return 'gravel';
            case 3:
                return 'sand';
            case 2.5:
                return 'grass';
            case 3:
                return 'shallow-water';
            case 4:
                return 'moderate-water';
            case 6:
                return 'deep-water';
            case 5:
                return 'stream';
            case 8:
                return 'swamp';
            case 4.1:
                return 'mud';
            case 5.1:
                return 'mountain';
            case 4.2:
                return 'forest';
            case 2.2:
                return 'dirt';
            case 1.1:
                return 'bridge';
            default:
                return '';
        }
    };


    const toggleCell = (x, y) => {
        const updatedGrid = [...grid];

        updatedGrid[x][y] = terrain;
        setGrid(updatedGrid);
        setMessage('To see the path changes, click on "Run A Star Algorithm"')
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
            setPath([])
            setNeighbors([])
            await window.electron.runAStarAlgorithm(grid, start, goal);

        } catch (err) {
            setMessage('Error running A*:', err);
        }
    };

    useEffect(() => {
        if (path.length > 0 || neighbors.length > 0) {
            const updatedGrid = grid.map((row, x) =>
                row.map((cell, y) => {
                    const isPathCell = path.some(([px, py]) => px === x && py === y);
                    const isProcessedCell = neighbors.some(([nx, ny]) => nx === x && ny === y);

                    if (isPathCell) return 11; // Path
                    if (isProcessedCell) return 12; // Processed (neighbor cells)
                    return cell; // Default cell value
                })
            );
            setPathGrid(updatedGrid); // Actualiza pathGrid con el nuevo mapa
        }
    }, [path, neighbors, grid]); // Dependencias: path, neighbors y grid


    return (
        <div className="conteiner">
            <Helmet>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>A Star</title>
            </Helmet>
            <main className="main-content">
                <section className="array_size_section">
                    <div className="imput-container">
                        <span className="dopdown-title">X</span>
                        <SettingInfo />
                        <input
                            id="axisX"
                            type="number"
                            min="1"
                            value={axisX}
                            onChange={handleAxisX}
                        />
                    </div>
                    <div className="imput-container">
                        <span className="dopdown-title">Y</span>
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
                <section className="dropdown-section">
                    <Dopdown title="Start" data={coordinates} onChange={handleStart} />
                    <Dopdown title="Terrain" data={obstacles} onChange={handleTerrain} />
                    <Dopdown title="Goal" data={coordinates} onChange={handleGoal} />
                </section>
                <section className="message-section">
                        <button onClick={handleRunAlgorithm}>Run A Star Algorithm</button>
                    <span className="message">{message}</span>
                </section>
                <section className='grid-container' style={{ position: 'relative' }}>
                    {grid.map((row, x) => (
                        <div key={x} className="row">
                            {row.map((cell, y) => (
                                <div
                                    key={`${x}-${y}`}
                                    className={`cell ${getClassNameForCell(cell)}`}
                                    onClick={() => toggleCell(x, y)}
                                    style={{ position: 'relative' }} // Para permitir que los elementos hijos se posicionen dentro
                                >
                                    <span className="cell-text">{`(${x},${y})`}</span>
                                    {start === `(${x},${y})` && (
                                        <span
                                            className="start-marker"
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                fontSize: '25px',
                                                fontWeight: 'bold',
                                                color: 'orange',
                                                zIndex: 40
                                            }}
                                        >
                                            S
                                        </span>
                                    )}

                                    {/* Mostrar "G" si es la celda de meta */}
                                    {goal === `(${x},${y})` && (
                                        <span
                                            className="goal-marker"
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                fontSize: '25px',
                                                fontWeight: 'bold',
                                                color: 'yellow',
                                                zIndex: 40
                                            }}
                                        >
                                            G
                                        </span>
                                    )}
                                    {neighbors.some(([px, py]) => px === x && py === y) && (
                                        <div
                                            className="circle"
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                width: '12px',
                                                height: '12px',
                                                backgroundColor: '#90ee90',
                                                borderRadius: '50%',
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        ></div>
                                    )}
                                    {/* Solo dibujar el círculo si la celda está en el path */}
                                    {path.some(([px, py]) => px === x && py === y) && (
                                        <div
                                            className="circle"
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                width: '12px',
                                                height: '12px',
                                                backgroundColor: '#74b9ff',
                                                borderRadius: '50%',
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        ></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </section>

            </main>
        </div>
    );
}
