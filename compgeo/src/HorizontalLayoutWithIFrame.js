import React, {useState} from "react";
import ReactDOM from "react-dom";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import {useCanvas} from "./hooks/useCanvas";

import Pseudocode from "./pseudocode/pseudocode";

function HorizontalLayoutWithIFrame(){
    const [dragging, setDragging] = useState(false);
    const [width, setWidth] = useState(0);

    const [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight ] = useCanvas();

    const handleCanvasClick=(event)=>{
        const currentCoord = { x: event.clientX, y: event.clientY };
        setCoordinates([...coordinates, currentCoord]);
    };

    const handleClearCanvas=(event)=>{
        setCoordinates([]);
    };

    const onDragStart = () => {
        setDragging(true);
    };

    const onDragEnd = () => {
        setDragging(false);
    };
    
    const onSecondaryPaneSizeChange = (f) => {
        console.log(f);
        setWidth(f);
    }

    const renderDetailLinks = () => {
        return (
            <div>
                Refer to the following pages for details:
                <ul>
                    <li>
                        <a href="https://github.com/zesik/react-splitter-layout/blob/master/example/javascripts/components/HorizontalLayoutWithIFrame.jsx">
                            Source code of this page
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/zesik/react-splitter-layout/issues/7">
                            Another way
                        </a>
                    </li>
                </ul>
            </div>
        );
    };
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
            <Pseudocode />
        </div>
    </SplitterLayout>;
}

export default HorizontalLayoutWithIFrame;