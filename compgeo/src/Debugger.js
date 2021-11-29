import React, {useState} from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import {useCanvas} from "./hooks/useCanvas";
import { waitUntil } from 'async-wait-until';

import Pseudocode from "./pseudocode/pseudocode";
import Description from "./Description"
import {getDiagonals} from "./trianglation/monotoneTriangulation";
const DELAY_DEFAULT = 100;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function Debugger(){
    const [coordinates, setCoordinates] = useState([]);
    const [diagonals, setDiagonals] = useState([]);
    const [addPoints, setAddPoints] = useState(true);
    const [tags, setTags] = useState(new Map());
    const [stepping, setStepping] = useState(false);
    const [step, setStep] = useState(false);

    const [delay, setDelay] = useState(DELAY_DEFAULT);
    const [width, setWidth] = useState(0);

    const [canvasRef, canvasWidth, canvasHeight ] = useCanvas(addPoints, coordinates, diagonals);

    function tagOn(tag){
        tags.set(tag, true);
        setTags(new Map(tags));
        // console.log(tags);
    }

    async function pause(tag){
        await sleep(delay);
    }

    function tagOff(tag){
        tags.set(tag, false);
        setTags(new Map(tags));
        // console.log(tags);
    }

    const pushDiag = (diag) => {
        diagonals.push(diag);
        setDiagonals([...diagonals]);
    }

    const clearDiag = () => {
        setDiagonals([])
    }

    const process = () => {
        getDiagonals(coordinates, tagOn, tagOff, pause, setDiagonals, pushDiag, clearDiag, setAddPoints);
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
        <div className="pane-1">
            <canvas
                className="App-canvas"
                ref={canvasRef}
                width={canvasWidth - width - 8}
                height={canvasHeight - 4}
                onClick={handleCanvasClick} />
        </div>
        <div className="pane-2">
            <Pseudocode run={process} clear={handleClearCanvas} step={Step} tags={tags}
                        delay={delay} setDelay={setDelay}
                        stepping={stepping} setStepping={setStepping}/>
            <Description />
        </div>
    </SplitterLayout>;
}

export default Debugger;
