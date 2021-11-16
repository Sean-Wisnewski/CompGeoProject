import { useCanvas } from './hooks/useCanvas';
import './App.css';

function App() {
    const [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight ] = useCanvas();

    const handleCanvasClick=(event)=>{
        // on each click get current mouse location
        const currentCoord = { x: event.clientX, y: event.clientY };
        // add the newest mouse location to an array in state
        setCoordinates([...coordinates, currentCoord]);
    };

    const handleClearCanvas=(event)=>{
        setCoordinates([]);
    };
  return (
    <main className="App">
        <canvas
            className="App-canvas"
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onClick={handleCanvasClick} />
    </main>
  );
}

export default App;
