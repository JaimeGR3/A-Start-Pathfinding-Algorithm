import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Dopdown from '../components/Dopdown';
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

    const handleRunAlgorithm = async () => {
        try {
            setMessage('')
            resetPathCells();
            const result = await window.electron.runAStarAlgorithm(grid, start, goal);
            if (result) {
                setPath(result[0]);
                setNeighbors(result[1])
            } else {
                setPath([]);
                setNeighbors([])
            }
        } catch (err) {
            console.error('Error running A*:', err);
        }
    };

    const resetPathCells = () => {
        const updatedGrid = grid.map(row =>
            row.map(cell => (cell === 2 || cell === 3 ? 0 : cell))
        );
        setGrid(updatedGrid);
    };
    useEffect(() => {
        resetPathCells();

        const updatedGrid = grid.map((row, x) =>
            row.map((cell, y) => {
                const isPathCell = path.some(([px, py]) => px === x && py === y);
                const isProcessedCell = neighbors.some(([nx, ny]) => nx === x && ny === y);

                if (isPathCell) return 2
                if (isProcessedCell) return 3
                return cell;
            })
        );

        setGrid(updatedGrid);
    }, [path, neighbors]);

    const generateArray = () => {
        const array = Array(axisX).fill().map(() => Array(axisY).fill(0));
        return array;
    };

    const toggleCell = (x, y) => {
        const updatedGrid = [...grid];

        updatedGrid[x][y] = updatedGrid[x][y] === 1 ? 0 : 1;
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
                        <span className='dopdown-title'>X:</span>
                        <input
                            id="axisX"
                            type="number"
                            min="1"
                            value={axisX}
                            onChange={handleAxisX}
                        />
                    </div>
                    <div className='imput-container'>
                        <span className='dopdown-title'>Y:</span>
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
                <section className='message-section'>
                    <button onClick={handleRunAlgorithm}>Run A Star Algorithm</button>
                    <span className='message'>{message}</span>
                </section>
                <section className="grid-container">
                    {grid.map((row, x) => (
                        <div key={x} className="row">
                            {row.map((cell, y) => (
                                <div
                                    key={`${x}-${y}`}
                                    className={`cell ${cell === 1 ? 'blocked' : ''} ${cell === 2 ? 'path' : ''} ${cell === 3 ? 'processed' : ''}`}
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
