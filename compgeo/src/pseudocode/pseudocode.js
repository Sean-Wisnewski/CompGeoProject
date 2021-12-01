import CodeBlock from "../trianglation/CodeBlock";
import Heap from 'heap-js';
import Stack from 'stackjs'

import {useState} from "react";
import {getDiagonals, LineSegment, visible} from "../trianglation/monotoneTriangulation";

function Markable({ tag, children ,tags}){
    if (tags.get(tag)){
        return (<p><mark>{children}</mark></p>);
    }
    return (<p>{children}</p>);
}

function Pseudocode({step, clear, tags, delay, setDelay, stepping,
                        setStepping, variables, updateVisualVariables, setAddPoints}){


    const handleChange = (event)=> {
        console.log(event)
        setDelay(Math.abs(parseInt(event.target.value)));
    }
    const handleCheck = (event)=> {
        console.log(event)
        setStepping(event.target.checked);
    }

    const blocks = [
        new CodeBlock(
            (variables, runPointer)=> {
                variables.stack = new Stack();
                return runPointer + 1;
            },
            "Initialize a stack"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.stack.push(0);
                variables.stack.push(1);
                return runPointer+1;
            },
            "Add index 0 and 1 to the top of the stack"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.diagonals = [];
                return runPointer+1;
            },
            "Initialize an empty list of diagonals"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.j = 2;
                return runPointer + 1;
            }),

        new CodeBlock(
            (variables, runPointer)=> {
                if (variables.j < variables.pts.length - 1){
                    variables.j = variables.j + 1;
                    return runPointer + 1;
                }
                return runPointer + 12;
            },
            "For each point J in the polygon starting with the third point stopping after the second to last point"),

        new CodeBlock(
            (variables, runPointer)=> {
                if (variables.pts[variables.stack.peek()].chain !== variables.pts[variables.j].chain){
                    return runPointer + 1;
                }
                return runPointer + 4;
            },
            "\t\tIf the point at the top of the stack is on the same chain as J"),

        new CodeBlock(
            (variables, runPointer)=> {
                if (variables.stack.size() > 1) {
                    return runPointer + 1;
                }
                return runPointer + 2;
            },
            "\t\t\t\tWhile there are at least 2 points on the stack"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.u = variables.stack.pop();
                variables.diagonals.push(new LineSegment(
                    variables.pts[variables.u].pt,
                    variables.pts[variables.j].pt));
                return runPointer - 1;
            },
            "\t\t\t\t\t\tPop a point U off the top of the stack and add a diagonal from U to J"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.stack = new Stack();
                return runPointer + 8;
            },
            "\t\t\t\tClear the stack, then Push the point before J and J onto the stack"),

        new CodeBlock(
            (variables, runPointer)=> {
                return runPointer + 1;
            },
            "\t\tOtherwise"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.u = variables.stack.pop();
                variables.u_l = variables.u;
                return runPointer + 1;
            },
            "\t\t\t\tPop a point off the top of the stack and set U and UL to that point"),

        new CodeBlock(
            (variables, runPointer)=> {
                if ((!variables.stack.isEmpty()) && visible(variables.pts, variables.j, variables.u) ) {
                    return runPointer + 1;
                }
                return runPointer + 4;
            },
            "\t\t\t\tWhile the stack is not empty and U is visible from J"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.diagonals.push(new LineSegment(variables.pts[variables.u].pt, variables.pts[variables.j].pt));
                return runPointer + 1;
            },
            "\t\t\t\t\t\tAdd a diagonal from U to J"),

        new CodeBlock(
            (variables, runPointer)=> {
                if (!variables.stack.isEmpty()) {
                    return runPointer + 1;
                }
                return runPointer + 2;
            },
            "\t\t\t\t\t\tIf the stack is not empty"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.u = variables.stack.pop();
                return runPointer + 1;
            },
            "\t\t\t\t\t\t\t\tSet U to a point popped off the top of the stack"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.stack.push(variables.u_l);
                variables.stack.push(variables.j);
                return runPointer + 1;
            },
            "\t\t\t\tPush UL and then J onto the stack"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.stack.pop()
                return runPointer + 1;
            },
            "Pop the top off the stack and ignore it"),

        new CodeBlock(
            (variables, runPointer)=> {
                if (variables.stack.size() > 1) {
                    return runPointer + 1;
                }
                return runPointer + 3;
            },
            "While the stack has more than one point on it"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.u = variables.stack.pop();
                return runPointer + 1;
            },
            "\t\tSet U to a point popped off the top of the stack"),

        new CodeBlock(
            (variables, runPointer)=> {
                variables.diagonals.push(new LineSegment(variables.pts[variables.u].pt, variables.pts[variables.pts.length-1].pt));
                return runPointer + 1;
            },
            "\t\tAdd a diagonal from U to the last point in the list of points"),

        new CodeBlock(
            (variables, runPointer)=> {
                return -1;
            }),

    ]


    const process = () => {
        getDiagonals(variables, setAddPoints);
        updateVisualVariables();
    }

    return (
        <div>
            <div>
                <button onClick={process}>Run</button>
                {/*<button onClick={step}>Step</button>*/}
                <button onClick={clear}>Clear</button>
                <input type="text" pattern="[0-9]*"
                       id="delay" name="delay"
                       onInput={handleChange} value={delay} />
                {/*<label > Stepping mode </label>*/}
            {/*    <input type="checkbox"*/}
            {/*           id="stepping" name="stepping" onInput={handleCheck} value={stepping}/>*/}
            </div>
            <div>
                {blocks.map((block) => block.render())}



            </div>
        </div>);
}
export default Pseudocode;