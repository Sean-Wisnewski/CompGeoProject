import React, { useState, useEffect, useRef } from 'react';
import {getDiagonals, splitPoints, split_to_chains} from "../trianglation/monotoneTriangulation";

// Path2D for a Heart SVG
const heartSVG = "M1045 2224 c-291 -34 -488 -122 -678 -303 -442 -422 -459 -1112 -38 -1554 438 -459 1160 -457 1596 4 326 344 394 864 168 1279 -113 208 -307 386 -521 481 -165 72 -379 110 -527 93z\""
const SVG_PATH = new Path2D(heartSVG);

// Scaling Constants for Canvas
const SCALE = 0.005;
const Y_OFFSET = -15;
const WINDOW_FRACTION=1.0;

const FUNKIFY = false;
export const canvasWidth = window.innerWidth * WINDOW_FRACTION;
export const canvasHeight = window.innerHeight * WINDOW_FRACTION;

export function draw(ctx, location){
    // console.log("attempting to draw")
    if (FUNKIFY){
        ctx.fillStyle = 'green';
    }else{
        ctx.fillStyle = 'black';
    }
    ctx.save();
    ctx.scale(SCALE, SCALE);
    ctx.translate(((location.x - (window.innerWidth * (1.0 - WINDOW_FRACTION)/2)) / SCALE), (location.y/ SCALE) - Y_OFFSET * 100);
    ctx.rotate(225 * Math.PI / 180);
    ctx.fill(SVG_PATH);
    // .restore(): Canvas 2D API restores the most recently saved canvas state
    ctx.restore();
};

export function drawline(ctx, start, end, color="black"){
    // console.log("attempting to draw")
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.stroke();
    // .restore(): Canvas 2D API restores the most recently saved canvas state
    ctx.restore();
};

function checkMonotonicity(pts) {
    console.log("Checking:",pts)
    //   // these are created in sorted order, so the monotonicity will always be true....
    // let all_pts = split_to_chains()
    let [upper, lower] = splitPoints(pts)

    //upper.sort((a,b) => (a.pt.x > b.pt.x) ? 1 : -1)
    //lower.sort((a,b) => (a.pt.x > b.pt.x) ? 1 : -1)
    //console.log(upper)
    //console.log(lower)
    // console.log("upper", upper)
    for(var i = 0; i < upper.length-1; i++) {
        if (upper[i].x > upper[i+1].x) {
            return false
        }
    }
    // console.log("lower", lower      )
    for(var i = 0; i < lower.length-1; i++) {
        if (lower[i].x > lower[i+1].x) {
            return false
        }
    }
    return true
}

export function useCanvas(addPoints, variables){
    const canvasRef = useRef(null);

    useEffect(()=>{
        const canvasObj = canvasRef.current;
        const ctx = canvasObj.getContext('2d');
        // clear the canvas area before rendering the coordinates held in state
        ctx.clearRect( 0,0, canvasWidth, canvasHeight );
        let isMonotone;
        if (variables.coordinates.length > 2) {
          isMonotone = checkMonotonicity(variables.coordinates);
            console.log("isMonotone", isMonotone)
        }
        else {
          isMonotone = true;
        }

        if (!isMonotone) {
          let planes = document.getElementsByClassName('App-canvas');
          console.log(planes)
          for(let i = 0; i < planes.length; i++) {
            console.log("changing color")
            planes[i].style.backgroundColor='red'
          }

        }

        // draw all coordinates held in state
        let color;
        if (FUNKIFY){
            color = 'green';
        }else{
            color = 'black';
        }
        variables.coordinates.forEach((coordinate)=>{draw(ctx, coordinate)});
        if (variables.coordinates.length > 1) {
            for (let i = 0; i < variables.coordinates.length - 1; i++) {
                drawline(ctx, variables.coordinates[i], variables.coordinates[i + 1], color);
            }
            drawline(ctx, variables.coordinates[variables.coordinates.length - 1], variables.coordinates[0], color);
        }

        if (FUNKIFY){
            color = 'red';
        }else{
            color = 'green';
        }
        if (variables.diagonals.length >= 0){
            for (const diag of variables.diagonals){
                drawline(ctx, diag.pt0, diag.pt1, color);
            }
        }

    });

    return [ canvasRef, canvasWidth, canvasHeight ];
}
