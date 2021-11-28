import React, {useState} from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import {useCanvas} from "./hooks/useCanvas";

import Pseudocode from "./pseudocode/pseudocode";
import {getDiagonals} from "./trianglation/monotoneTriangulation";

function Debugger(){
    const [coordinates, setCoordinates] = useState([]);
    const [diagonals, setDiagonals] = useState([]);
    const [addPoints, setAddPoints] = useState(true);
    const [tags, setTags] = useState(new Map());
    const [dragging, setDragging] = useState(false);

    const [delay, setDelay] = useState(1000);
    const [width, setWidth] = useState(0);

    const [canvasRef, canvasWidth, canvasHeight ] = useCanvas(addPoints, coordinates, diagonals);

    const toggleTag = (tag) =>{
        if (tags.has(tag)) {
            tags.set(tag, !tags.get(tag))
        }else{
            tags.set(tag, true)
        }
        setTags(new Map(tags));
        console.log(tags);
    }

    const process = () => {
        setAddPoints(false);
        getDiagonals(coordinates, toggleTag, setDiagonals, delay);
        setAddPoints(true);
    }

    const handleCanvasClick=(event)=>{
        if (addPoints) {
            const currentCoord = {x: event.clientX, y: event.clientY};
            setCoordinates([...coordinates, currentCoord]);
        }
    };

    const handleClearCanvas=(event)=>{
        setCoordinates([]);
        setDiagonals([]);
    };

    const onDragStart = () => {
        setDragging(true);
    };

    const onDragEnd = () => {
        setDragging(false);
    };
    
    const onSecondaryPaneSizeChange = (width) => {
        setWidth(width);
    }

    return <SplitterLayout onDragStart={onDragStart} onDragEnd={onDragEnd} onSecondaryPaneSizeChange = {onSecondaryPaneSizeChange}>
        <div className="pane-1">
            <canvas
                className="App-canvas"
                ref={canvasRef}
                width={canvasWidth - width - 8}
                height={canvasHeight - 8}
                onClick={handleCanvasClick} />
        </div>
        <div className="pane-2">
            {/*<h2>2nd Pane</h2>*/}
            <Pseudocode run={process} clear={handleClearCanvas} tags={tags} delay={delay} setDelay={setDelay}/>
        </div>
    </SplitterLayout>;
}

export default Debugger;