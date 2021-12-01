import React, {useState} from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import {useCanvas} from "./hooks/useCanvas";
import { waitUntil } from 'async-wait-until';

import Pseudocode from "./pseudocode/pseudocode";
import Description from "./Description"
import {getDiagonals} from "./trianglation/monotoneTriangulation";
const DELAY_DEFAULT = 300;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function Debugger(){

    const [visualVariables, setVisualVariables] = useState({coordinates:[], diagonals:[]});
    const [runPointer, setRunPointer] = useState(-1);
    const [addPoints, setAddPoints] = useState(true);
    const [tags, setTags] = useState(new Map());
    const [stepping, setStepping] = useState(false);
    const [step, setStep] = useState(false);
    const [delay, setDelay] = useState(DELAY_DEFAULT);
    const [width, setWidth] = useState(0);

    const variables = {...visualVariables};

    const updateVisualVariables = () => {
        setVisualVariables({...variables});
    }
    const setDiagonals = (value)=>{
        variables.diagonals = value;
    }
    const setCoordinates = (value)=>{
        variables.coordinates = value;
    }

    const [canvasRef, canvasWidth, canvasHeight ] = useCanvas(addPoints, visualVariables);

    async function pause(){
        await sleep(delay);
    }

    function tagOff(tag){
        tags.set(tag, false);
        setTags(new Map(tags));
        // console.log(tags);
    }

    const handleCanvasClick=(event)=>{
        if (addPoints) {
            const currentCoord = {x: event.clientX, y: event.clientY};
            setCoordinates([...visualVariables.coordinates, currentCoord]);
            updateVisualVariables();
        }
    };

    const handleClearCanvas=(event)=>{
        setCoordinates([]);
        setDiagonals([]);
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

    const Step = () => {
        // console.log("Stepping")
        setStep(true);
    }

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
            <Pseudocode clear={handleClearCanvas} step={Step} tags={tags}
                        delay={delay} setDelay={setDelay}
                        variables={variables} updateVisualVariables={updateVisualVariables}
                        setAddPoints = {setAddPoints}
                        stepping={stepping} setStepping={setStepping} />
            <Description />
        </div>
    </SplitterLayout>;
}

export default Debugger;
