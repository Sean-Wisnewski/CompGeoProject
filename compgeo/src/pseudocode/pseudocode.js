import CodeBlock from "../trianglation/CodeBlock";
import Heap from 'heap-js';
import Stack from 'stackjs'

import {useState} from "react";
import {getDiagonals, LineSegment, split_to_chains, visible} from "../trianglation/monotoneTriangulation";
import {DELAY_DEFAULT} from "../CONSTANTS";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function Pseudocode({variables, updateVisualVariables, setAddPoints, addPoints, clear}){
    let [runPointer, setRunPointer] = useState(-1);
    let rp = runPointer;
    const [delay, setDelay] = useState(DELAY_DEFAULT);

    const handleChange = (event)=> {
        console.log(event)
        setDelay(Math.abs(parseInt(event.target.value)));
    }

    async function pause(){
        await sleep(delay);
    }

    const handleCheck = (event)=> {
        console.log(event)
        variables.stepping = (!event.target.checked);
        updateVisualVariables()
    }

    const blocks = [
        // Block 0
        new CodeBlock(
            (variables, runPointer)=> {
                variables.stack = new Stack();
                return runPointer + 1;
            },
            "Initialize a stack"),

        // Block 1
        new CodeBlock(
            (variables, runPointer)=> {
                variables.stack.push(0);
                variables.stack.push(1);
                return runPointer + 1;
            },
            "Add index 0 and 1 to the top of the stack"),

        // Block 2
        new CodeBlock(
            (variables, runPointer)=> {
                variables.diagonals = [];
                return runPointer+1;
            },
            "Initialize an empty list of diagonals"),

        // Block 3
        new CodeBlock(
            (variables, runPointer)=> {
                variables.j = 1;
                return runPointer + 1;
            }),

        // Block 4
        new CodeBlock(
            (variables, runPointer)=> {
                if (variables.j < variables.pts.length - 1){
                    variables.j = variables.j + 1;
                    return runPointer + 1;
                }
                return runPointer + 12;
            },
            "For each point J in the polygon starting with the third point stopping after the second to last point"),

        // Block 5
        new CodeBlock(
            (variables, runPointer)=> {
                console.log(variables.pts)
                console.log(variables.stack.peek())
                console.log(variables.j)
                console.log(variables.pts[variables.stack.peek()].chain)
                console.log(variables.pts[variables.j].chain)
                if (variables.pts[variables.stack.peek()].chain !== variables.pts[variables.j].chain){
                    return runPointer + 1;
                }else{
                    return runPointer + 4;
                }
            },
            "\t\tIf the point at the top of the stack is on the same chain as J"),

        // Block 6
        new CodeBlock(
            (variables, runPointer)=> {
                if (variables.stack.size() > 1) {
                    return runPointer + 1;
                }
                return runPointer + 2;
            },
            "\t\t\t\tWhile there are at least 2 points on the stack"),

        // Block 7
        new CodeBlock(
            (variables, runPointer)=> {
                variables.u = variables.stack.pop();
                variables.diagonals.push(new LineSegment(
                    variables.pts[variables.u].pt,
                    variables.pts[variables.j].pt));
                return runPointer - 1;
            },
            "\t\t\t\t\t\tPop a point U off the top of the stack and add a diagonal from U to J"),

        // Block 8
        new CodeBlock(
            (variables, runPointer)=> {
                variables.stack = new Stack();
                variables.stack.push(variables.j - 1);
                variables.stack.push(variables.j);
                return runPointer + -4;
            },
            "\t\t\t\tClear the stack, then Push the point before J and J onto the stack"),

        // Block 9
        new CodeBlock(
            (variables, runPointer)=> {
                return runPointer + 1;
            },
            "\t\tOtherwise"),

        // Block 10
        new CodeBlock(
            (variables, runPointer)=> {
                variables.u = variables.stack.pop();
                variables.u_l = variables.u;
                return runPointer + 1;
            },
            "\t\t\t\tPop a point off the top of the stack and set U and UL to that point"),

        // Block 11
        new CodeBlock(
            (variables, runPointer)=> {
                if ((!variables.stack.isEmpty()) && visible(variables.pts, variables.j, variables.u) ) {
                    return runPointer + 1;
                }
                return runPointer + 4;
            },
            "\t\t\t\tWhile the stack is not empty and U is visible from J"),

        // Block 12
        new CodeBlock(
            (variables, runPointer)=> {
                variables.diagonals.push(new LineSegment(
                    variables.pts[variables.u].pt,
                    variables.pts[variables.j].pt));
                return runPointer + 1;
            },
            "\t\t\t\t\t\tAdd a diagonal from U to J"),

        // Block 13
        new CodeBlock(
            (variables, runPointer)=> {
                if (!variables.stack.isEmpty()) {
                    return runPointer + 1;
                }
                return runPointer - 2;
            },
            "\t\t\t\t\t\tIf the stack is not empty"),

        // Block 14
        new CodeBlock(
            (variables, runPointer)=> {
                variables.u = variables.stack.pop();
                return runPointer - 3;
            },
            "\t\t\t\t\t\t\t\tSet U to a point popped off the top of the stack"),

        // Block 15
        new CodeBlock(
            (variables, runPointer)=> {
                variables.stack.push(variables.u_l);
                variables.stack.push(variables.j);
                return runPointer - 11;
            },
            "\t\t\t\tPush UL and then J onto the stack"),

        // Block 16
        new CodeBlock(
            (variables, runPointer)=> {
                variables.stack.pop()
                return runPointer + 1;
            },
            "Pop the top off the stack and ignore it"),

        // Block 17
        new CodeBlock(
            (variables, runPointer)=> {
                if (variables.stack.size() > 1) {
                    return runPointer + 1;
                }
                return runPointer + 3;
            },
            "While the stack has more than one point on it"),

        // Block 18
        new CodeBlock(
            (variables, runPointer)=> {
                variables.u = variables.stack.pop();
                return runPointer + 1;
            },
            "\t\tSet U to a point popped off the top of the stack"),

        // Block 19
        new CodeBlock(
            (variables, runPointer)=> {
                variables.diagonals.push(new LineSegment(variables.pts[variables.u].pt, variables.pts[variables.pts.length-1].pt));
                return runPointer + 1;
            },
            "\t\tAdd a diagonal from U to the last point in the list of points"),

        // Block 20
        new CodeBlock(
            (variables, runPointer)=> {
                return -1;
            }),

    ]

    const setRP = (value) => {
        rp = value;
        setRunPointer(rp);
    }

    function start() {
        if (variables.coordinates.length >= 4){
            if (true) {
                variables.pts = split_to_chains(variables.coordinates);
                setAddPoints(false);
                setRP(0);
                updateVisualVariables();
                process();
            }else {
                variables.pts = split_to_chains(variables.coordinates);
                getDiagonals(variables, setAddPoints);
                updateVisualVariables();
                console.log("finished");
            }
        }
    }
    async function process(){
        // console.log("Start Processing")
        if (rp >= 0 && rp < blocks.length) {
            // console.log("RunPointer:", runPointer);
            console.log("rp:", rp);
            let nrp = blocks[rp].run(variables, rp);
            // console.log("New RunPointer:", nrp);
            if (blocks[rp].pseudocode != null){
                await pause()
            }
            setRP(nrp);
            updateVisualVariables();
            if (rp >= 0  && (blocks[rp].pseudocode == null || (!variables.stepping))){
                await process();
            }
        } else if (!addPoints) {
            setAddPoints(true);
        }
        // getDiagonals(variables, setAddPoints);
        console.log("Finished");
    }
    // process();


    return (
        <div>
            <div>
                <button onClick={start}>Run</button>
                <button onClick={process}>Step</button>
                <button onClick={clear}>Clear</button>
                <button onClick={()=>{
                    variables.stepping = false;
                    updateVisualVariables();
                    console.log(variables)
                    process()}
                }>Continue</button>
                <input type="text" pattern="[0-9]*"
                       id="delay" name="delay"
                       onInput={handleChange} value={delay} />
                <label > Stepping mode </label>
                <input type="checkbox"
                       id="stepping" name="stepping" onInput={handleCheck}  checked={variables.stepping}/>
            </div>
            <div>
                {blocks.map((block, index) => {
                    if (index === runPointer){
                        return block.renderMarked()
                    }else{
                        return block.render()
                    }
                })}
            </div>
        </div>);
}
export default Pseudocode;