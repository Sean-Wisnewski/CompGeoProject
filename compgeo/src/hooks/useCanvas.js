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
  // make a copy
  let sorted_pts = pts.slice(0, pts.length);
  sorted_pts.sort((a, b) => (a.x > b.x) ? 1 : -1)
  //console.log(sorted_pts)
  let local_mins = 0;
  let n = pts.length;
  // js is dumb as shit, the "modulo" operator is actually just remainder, and doesn't
  // handle negative numbers correctly
  const modulo = (a, n) => ((a % n) + n) % n
  for (var i = 0; i < pts.length -1; i++) {
    let pt_x = pts[i].x
    let pt_x_p_1 = pts[modulo((i+1), n)].x
    let pt_x_m_1 = pts[modulo((i-1), n)].x
    //console.log(pt_x)
    //console.log(pt_x_p_1)
    //console.log(pt_x_m_1)
    if (pt_x < pt_x_p_1 && pt_x < pt_x_m_1) {
      local_mins++;
    }
  }
  console.log(local_mins)
  if (local_mins == 1) {
    console.log("monotone");
    return true;
  }
  else {
    console.log("not monotone");
    return false;

  }
}

export function useCanvas(addPoints, coordinates, diagonals){
    const canvasRef = useRef(null);

    useEffect(()=>{
        const canvasObj = canvasRef.current;
        const ctx = canvasObj.getContext('2d');
        // clear the canvas area before rendering the coordinates held in state
        ctx.clearRect( 0,0, canvasWidth, canvasHeight );
        var isMonotone;
        if (coordinates.length > 2) {
          isMonotone = checkMonotonicity(coordinates);
        }
        else {
          isMonotone = true;
        }

        if (!isMonotone) {
          let planes = document.getElementsByClassName('App-canvas');
          console.log(planes)
          for(var i = 0; i < planes.length; i++) {
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
        coordinates.forEach((coordinate)=>{draw(ctx, coordinate)});
        if (coordinates.length > 1) {
            for (let i = 0; i < coordinates.length - 1; i++) {
                drawline(ctx, coordinates[i], coordinates[i + 1], color);
            }
            drawline(ctx, coordinates[coordinates.length - 1], coordinates[0], color);
        }

        if (FUNKIFY){
            color = 'red';
        }else{
            color = 'green';
        }
        if (diagonals.length >= 0){
            for (const diag of diagonals){
                drawline(ctx, diag.pt0, diag.pt1, color);
            }
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

        // let all_pts = split_to_chains(coordinates);
        // console.log("All out");
        // console.log(all_pts)
        // if (all_pts.length > 1) {
        //     for (let i = 0; i < all_pts.length - 1; i++) {
        //         drawline(ctx, all_pts[i].pt, all_pts[i + 1].pt, "orange");
        //     }
        // }

    });

    return [ canvasRef, canvasWidth, canvasHeight ];
}
