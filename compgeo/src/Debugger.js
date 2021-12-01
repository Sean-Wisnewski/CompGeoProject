import React, {useState} from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import {useCanvas} from "./hooks/useCanvas";
import { waitUntil } from 'async-wait-until';

import Pseudocode from "./pseudocode/pseudocode";
import Description from "./Description"
import {getDiagonals} from "./trianglation/monotoneTriangulation";


function Debugger(){

    const [visualVariables, setVisualVariables] = useState({
        coordinates:[],
        diagonals:[],
        stepping:false,
    });
    const [addPoints, setAddPoints] = useState(true);

    const [width, setWidth] = useState(0);

    const variables = {...visualVariables};

    const updateVisualVariables = () => {
        console.log(variables)
        setVisualVariables({...variables});
    }
    const setCoordinates = (value)=>{
        variables.coordinates = value;
    }

    const [canvasRef, canvasWidth, canvasHeight ] = useCanvas(addPoints, visualVariables);


    const handleCanvasClick=(event)=>{
        if (addPoints) {
            const currentCoord = {x: event.clientX, y: event.clientY};
            variables.coordinates.push(currentCoord);
            updateVisualVariables();
        }
    };

    const handleClearCanvas=(event)=>{
        variables.coordinates = [];
        variables.diagonals = [];
        let planes = document.getElementsByClassName('App-canvas');
        console.log(planes)
        for(var i = 0; i < planes.length; i++) {
          console.log("changing color")
          planes[i].style.backgroundColor='white'
        }
        updateVisualVariables();

    };

    const onSecondaryPaneSizeChange = (width) => {
        setWidth(width);
    }

    // const Step = () => {
    //     // console.log("Stepping")
    //     setStep(true);
    // }

    return <SplitterLayout
        // onDragStart={onDragStart} onDragEnd={onDragEnd}
        onSecondaryPaneSizeChange = {onSecondaryPaneSizeChange}>
        <div className="pane-1" id='pane-1'>
            <canvas
                className="App-canvas"
                ref={canvasRef}
                width={canvasWidth - width - 8}
                height={canvasHeight - 4}
                onClick={handleCanvasClick} />
        </div>
        <div className="pane-2">
            <Pseudocode clear={handleClearCanvas}
                        variables={variables} updateVisualVariables={updateVisualVariables}
                        setAddPoints = {setAddPoints} addPoints={addPoints}/>
            <Description />
        </div>
    </SplitterLayout>;
}

export default Debugger;
