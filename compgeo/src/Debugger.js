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

function l2_dist(pt0, pt1) {
    return Math.sqrt(l2_dist_square(pt0, pt1))
}
function l2_dist_square(pt0, pt1) {
    return Math.pow((pt0.x-pt1.x), 2)+Math.pow((pt0.y-pt1.y), 2)
}

function segment_distance(p1, p2, newp) {
    const l2 = l2_dist_square(p1, p2);
    console.log("l2", l2)
    if (l2 === 0.0) return l2_dist(p1, newp);
    const t = Math.max(0, Math.min(1, ((newp.x - p1.x)*(p2.x - p1.x)+(newp.y - p1.y)*(p2.y - p1.y))/ l2));
    const projection = {x:p1.x + t * (p2.x - p1.x), y:p1.y + t * (p2.y - p1.y)};  // Projection falls on the segment
    console.log("projection", projection)
    return l2_dist(newp, projection);
}

function find_insertion_point(coords, new_coord) {
    console.log(coords)
    let index = coords.length;
    let dist = segment_distance(coords[coords.length-1], coords[0], new_coord)
    console.log(dist)
    for (let i = 0; i+1 < coords.length; i++) {
        let d = segment_distance(coords[i], coords[i+1], new_coord);
        console.log(d)
        if (d < dist) {
            index = i+1;
            dist = d
            console.log("new index",index)
        }
    }
    return index
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
            if (coordinates.length > 2){
                let new_index = find_insertion_point(coordinates, currentCoord)
                console.log(new_index)
                coordinates.splice(new_index, 0, currentCoord)
                setCoordinates([...coordinates]);
            }
            else{
              setCoordinates([...coordinates, currentCoord]);
            }
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
            <Pseudocode run={process} clear={handleClearCanvas} step={Step} tags={tags}
                        delay={delay} setDelay={setDelay}
                        stepping={stepping} setStepping={setStepping}/>
            <Description />
        </div>
    </SplitterLayout>;
}

export default Debugger;
