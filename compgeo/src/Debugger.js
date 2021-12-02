import React, {useState} from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import {useCanvas} from "./hooks/useCanvas";
import Pseudocode from "./pseudocode/pseudocode";
import Description from "./Description"


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
        setVisualVariables({...variables});
    }
    const setCoordinates = (value)=>{
        variables.coordinates = value;
    }

    const [canvasRef, canvasWidth, canvasHeight ] = useCanvas(addPoints, visualVariables);

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

    const handleCanvasClick=(event)=>{
        if (addPoints) {
            const currentCoord = {x: event.clientX, y: event.clientY};
            if (variables.coordinates.length > 2){
                let index = find_insertion_point(variables.coordinates, currentCoord)
                variables.coordinates.splice(index, 0, currentCoord);
            }else {
                variables.coordinates.push(currentCoord);
            }
            updateVisualVariables();
        }
    };

    const handleClearCanvas=()=>{
        variables.coordinates = [];
        variables.diagonals = [];
        let planes = document.getElementsByClassName('App-canvas');
        console.log(planes)
        for(var i = 0; i < planes.length; i++) {
          console.log("changing color")
          planes[i].style.backgroundColor='white'
        }
        updateVisualVariables();
        setAddPoints(true);

    };

    const onSecondaryPaneSizeChange = (width) => {
        setWidth(width);
    }

    return <SplitterLayout
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
