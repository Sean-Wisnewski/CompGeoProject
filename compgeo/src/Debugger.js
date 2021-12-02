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
  return Math.sqrt(Math.pow((pt0.x-pt1.x), 2)+Math.pow((pt0.y-pt1.y), 2))
}

function find_insertion_point(coords, new_coord) {
  //console.log(new_coord)
  var coords_with_dists = []
  for (let i = 0; i < coords.length; i++) {
    let pt = coords[i]
    coords_with_dists.push([i, l2_dist(pt, new_coord)])
  }
  //console.log(coords_with_dists)
  coords_with_dists.sort((a,b) => (a[1] > b[1]) ? 1 : -1)
  let fixed_coords = []
  console.log(coords_with_dists)
  for (let i = 0; i < coords.length; i++) {
    if (i != coords_with_dists[0][0] && i != coords_with_dists[1][0]){
      fixed_coords.push(coords[i])
    }
  }
  fixed_coords.push(coords[coords_with_dists[0][0]])
  fixed_coords.push(new_coord)
  fixed_coords.push(coords[coords_with_dists[1][0]])
  console.log(fixed_coords)
  return fixed_coords
  //let dists = coords.map(function (pt) {
   // return l2_dist(pt, new_coord)
  //})
  //dists.sort((a,b) => (a > b) ? 1 : -1)
  //console.log(dists)
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
            if (coordinates.length > 1){
              let new_coords = find_insertion_point(coordinates, currentCoord)
              setCoordinates(new_coords);
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
