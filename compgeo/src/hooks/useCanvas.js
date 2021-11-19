import React, { useState, useEffect, useRef } from 'react';
import {getDiagonals, splitPoints} from "../monotoneTriangulation";

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
    console.log("attempting to draw")
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
    console.log("attempting to draw")
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.stroke();
    // .restore(): Canvas 2D API restores the most recently saved canvas state
    ctx.restore();
};

export function useCanvas(){
    const canvasRef = useRef(null);
    const [coordinates, setCoordinates] = useState([]);

    useEffect(()=>{
        const canvasObj = canvasRef.current;
        const ctx = canvasObj.getContext('2d');
        // clear the canvas area before rendering the coordinates held in state
        ctx.clearRect( 0,0, canvasWidth, canvasHeight );

        // draw all coordinates held in state
        let color;
        if (FUNKIFY){
            color = 'green';
        }else{
            color = 'black';
        }
        coordinates.forEach((coordinate)=>{draw(ctx, coordinate)});
        if (coordinates.length > 1) {
            for (let i = 0; i < coordinates.length - 1; i++) {
                drawline(ctx, coordinates[i], coordinates[i + 1], color);
            }
            drawline(ctx, coordinates[coordinates.length - 1], coordinates[0], color);
        }

        // var [bot_points, top_points] = splitPoints(coordinates);
        // if (top_points.length > 1) {
        //     for (let i = 0; i < top_points.length - 1; i++) {
        //         drawline(ctx, top_points[i], top_points[i + 1], "red");
        //     }
        //     drawline(ctx, top_points[top_points.length - 1], top_points[0], "red");
        // }
        // if (bot_points.length > 1) {
        //     for (let i = 0; i < bot_points.length - 1; i++) {
        //         drawline(ctx, bot_points[i], bot_points[i + 1], "blue");
        //     }
        //     console.log(bot_points)
        //     drawline(ctx, bot_points[bot_points.length - 1], bot_points[0],"blue");
        // }
        if (FUNKIFY){
            color = 'red';
        }else{
            color = 'red';
        }
        if (coordinates.length >= 4){
            let diagonals = getDiagonals(coordinates);
            for (const diag of diagonals){
                drawline(ctx, diag.pt0, diag.pt1, color);
            }
        }
    });

    return [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight ];
}