import Heap from 'heap-js';
import Stack from 'stackjs'
import CodeBlock from "./CodeBlock";
export class StackElement {
    constructor(pt, chain) {
        this.pt = pt;
        this.chain = chain;
    }
}
export class LineSegment {
    constructor(pt0, pt1, name) {
        if (pt0.x < pt1.x){
            this.pt0 = pt0;
            this.pt1 = pt1;
        }else{
            this.pt0 = pt1;
            this.pt1 = pt0;
        }
        this.name = name;
    }
}
export function split_to_chains(pts){
    let pt_min = pts[0];
    let pt_max = pts[0];
    let min_index = 0;
    let max_index = 0;
    for (let i = 0; i < pts.length; i++) {
        if (pts[i].x < pt_min.x){
            pt_min = pts[i];
            min_index = i;
        }
        if (pts[i].x > pt_max.x){
            pt_max = pts[i];
            max_index = i;
        }
    }
    const comparator = (pt1, pt2) => pt1.x - pt2.x;
    let upper_heap = new Heap(comparator);
    let lower_heap = new Heap(comparator);
    // console.log(max_index);
    // console.log(min_index);
    for (let i = 0; i < pts.length; i++) {
        if ((min_index <= max_index)) {
            if ((min_index < i) && (i <= max_index)) {
                upper_heap.push(pts[i]);
            } else {
                lower_heap.push(pts[i]);
            }
        }else{
            if ((min_index > i) && (i >= max_index)) {
                lower_heap.push(pts[i]);
            } else {
                upper_heap.push(pts[i]);
            }
        }
    }
    let all_pts = []
    while ((upper_heap.length > 0) && (lower_heap.length > 0)) {
        if (upper_heap.peek().x < lower_heap.peek().x) {
            all_pts.push(new StackElement(upper_heap.pop(), "upper"));
        }else{
            all_pts.push(new StackElement(lower_heap.pop(), "lower"));
        }
    }
    // console.log("all_pts")
    // console.log(all_pts)
    if (upper_heap.length > 0) {
        while (upper_heap.length > 0) {
            all_pts.push(new StackElement(upper_heap.pop(), "upper"));
        }
    }
    if (lower_heap.length > 0) {
        while (lower_heap.length > 0) {
            all_pts.push(new StackElement(lower_heap.pop(), "lower"));
        }
    }
    // console.log("all_pts final")
    // console.log(all_pts)
    return all_pts
}

export function splitPoints(polygon) {
    let pt_min = polygon[0];
    let pt_max = polygon[0];
    let min_index = 0;
    let max_index = 0;
    for (let i = 0; i < polygon.length; i++) {
        if (polygon[i].x < pt_min.x) {
            pt_min = polygon[i];
            min_index = i;
        }
        if (polygon[i].x > pt_max.x) {
            pt_max = polygon[i];
            max_index = i;
        }
    }
    let top_points = [];
    let bot_points = [];

    for (let i = min_index; i !== max_index; i = (i + 1) % polygon.length) {
        top_points.push(polygon[i])
    }
    top_points.push(polygon[max_index])

    for (let i = min_index; i !== max_index; i = (i + polygon.length - 1) % polygon.length) {
        bot_points.push(polygon[i])
    }
    bot_points.push(polygon[max_index])

    return [bot_points, top_points];
}

// export function splitPoints(polygon){
//     let all_pts = split_to_chains(polygon);
//     let top_points = [];
//     let bot_points = [];
//     for (const element of all_pts){
//         // console.log(element.chain)
//         if (element.chain === "lower"){
//             bot_points.push(element.pt);
//             // console.log("print Lower")
//         }else{
//             top_points.push(element.pt);
//             // console.log("print Upper")
//         }
//     }
//     return [bot_points, top_points];
// }

function orient_test(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

export function visible(pts, j, u) {
    for (let i=u+1; i < j; i++) {
        if (pts[i].chain === "lower" && orient_test(pts[j].pt, pts[i].pt, pts[u].pt) >= 0) {
            return false;
        } else if (pts[i].chain === "upper" && orient_test(pts[j].pt, pts[i].pt, pts[u].pt) <= 0) {
            return false;
        }
    }
    return (j - (1 + u)) > 0;
}

async function x_monotone_triangulation(variables){
    // tagOn("start-stack"); // Initialize a stack
    // await pause("start-stack");
    console.log("EPointer:", 0)
    variables.stack = new Stack();
    // tagOff("start-stack");

    // tagOn("stack-push-0"); // Add index 0 to the top of the stack
    // await pause("stack-push-0");
    console.log("EPointer:", 1)
    variables.stack.push(0);
    // tagOff("stack-push-0");

    // tagOn("stack-push-1"); // Add index 1 to the top of the stack
    // await pause("stack-push-1")
    variables.stack.push(1);
    // tagOff("stack-push-1");

    // tagOn("start-diagonals"); // Initialize an empty list of diagonals
    // await pause("start-diagonals");
    console.log("EPointer:", 2);
    variables.diagonals = [];
    // tagOff("start-diagonals");


    // for (let j=2; j < pts.length - 1; j;++) {
    console.log("EPointer:", 3);
    for (variables.j = 2; variables.j < variables.pts.length - 1; variables.j = variables.j + 1) {
        console.log("EPointer:", 4);
        console.log("EPointer:", 5);
        console.log(variables.pts)
        console.log(variables.stack.peek())
        console.log(variables.j)
        console.log(variables.pts[variables.stack.peek()].chain)
        console.log(variables.pts[variables.j].chain)
        if (variables.pts[variables.stack.peek()].chain !== variables.pts[variables.j].chain){

            console.log("EPointer:", 6);
            while (variables.stack.size() > 1) {
                // tagOn("same-chain-if-while-more-than-2"); // while there are at least 2 points on the stack
                // await pause("same-chain-if-while-more-than-2");
                // tagOff("same-chain-if-while-more-than-2");

                // tagOn("same-chain-if-while-more-than-2-add-diag"); // Pop a point U off the top of the stack and add a diagonal from U to J
                // await pause("same-chain-if-while-more-than-2-add-diag");

                console.log("EPointer:", 7);
                variables.u= variables.stack.pop();
                variables.diagonals.push(new LineSegment(variables.pts[variables.u].pt, variables.pts[variables.j].pt));
                // tagOff("same-chain-if-while-more-than-2-add-diag");
                // show_polygon_with_diagonals(stackElements, diagonals, true)
            }

            console.log("EPointer:", 8);
            variables.stack= new Stack();
            variables.stack.push(variables.j - 1);
            variables.stack.push(variables.j);
        } else {
            console.log("EPointer:", 9);
            // tagOn("same-chain-else"); // else
            // await pause("same-chain-else");
            // tagOff("same-chain-else");

            // tagOn("same-chain-else-pop"); // Pop a point U off the top of the stack
            // await pause("same-chain-else-pop");
            console.log("EPointer:", 10);
            variables.u= variables.stack.pop();
            variables.u_l= variables.u;
            // tagOff("same-chain-else-pop");


            while ((!variables.stack.isEmpty()) && visible(variables.pts, variables.j, variables.u) ) {
                console.log("EPointer:", 11);
                // tagOn("same-chain-else-while"); // while the stack is not empty and U is visible from J
                // await pause("same-chain-else-while");
                // tagOff("same-chain-else-while");

                // tagOn("same-chain-else-while-add"); // Add a diagonal from u to j
                // await pause("same-chain-else-while-add");
                console.log("EPointer:", 12);
                variables.diagonals.push(new LineSegment(
                    variables.pts[variables.u].pt,
                    variables.pts[variables.j].pt));
                // tagOff("same-chain-else-while-add");
                // show_polygon_with_diagonals(stackElements, diagonals, true)
                // tagOn("same-chain-else-while-if-not-empty");// If the stack is not empty
                // await pause("same-chain-else-while-if-not-empty");
                // tagOff("same-chain-else-while-if-not-empty");
                console.log("EPointer:", 13);
                if (!variables.stack.isEmpty()) {
                    // tagOn("same-chain-else-while-if-not-empty-popped");// Set U to a point popped off the top of the stack
                    // await pause("same-chain-else-while-if-not-empty-popped");
                    // u = variables.stack").pop();
                    console.log("EPointer:", 14);
                    variables.u = variables.stack.pop();
                    // tagOff("same-chain-else-while-if-not-empty-popped");
                }
            }
            console.log("EPointer:", 11);
            // tagOn("same-chain-else-while"); // while the stack is not empty and U is visible from J
            // await pause("same-chain-else-while");
            // tagOff("same-chain-else-while");

            // tagOn("same-chain-else-push-ul");// Push UL onto the stack
            // await pause("same-chain-else-ul");

            console.log("EPointer:", 15);
            variables.stack.push(variables.u_l);
            variables.stack.push(variables.j);
            // tagOff("same-chain-else-push-j");
        }
    }
    console.log("EPointer:", 4)

    console.log("EPointer:", 16);
    variables.stack.pop()

    while (variables.stack.size() > 1) {
        console.log("EPointer:", 17);
        // tagOn("last-while-if-not-empty"); // while the stack has more than one point on it
        // await pause("last-while-if-not-empty");
        // tagOff("last-while-if-not-empty");

        // tagOn("last-while-if-not-empty-popped");// Set U to a point popped off the top of the stack
        // await pause("last-while-if-not-empty-popped");
        console.log("EPointer:", 18);
        variables.u = variables.stack.pop();
        // tagOff("last-while-if-not-empty-popped");

        // tagOn("last-while-if-not-empty-add-diag"); // Add a diagonal from U to the last point in the list of points
        // await pause("last-while-if-not-empty-add-diag");
        console.log("EPointer:", 19);
        variables.diagonals.push(new LineSegment(
            variables.pts[variables.u].pt,
            variables.pts[variables.pts.length-1].pt));
        // tagOff("last-while-if-not-empty-add-diag");
        // show_polygon_with_diagonals(stackElements, diagonals, true)
    }
    console.log("EPointer:", 17);
    // tagOn("last-while-if-not-empty"); // while the stack has more than one point on it
    // await pause("last-while-if-not-empty");
    // tagOff("last-while-if-not-empty");
    console.log("EPointer:", 20);
}

export async function getDiagonals(variables, setAddPoints){
    // setAddPoints(false);
    // tagOn(F"split");
    // await pause("split");
    variables.pts = split_to_chains(variables.coordinates);
    // tagOff("split");
    // tagOn("diag");
    // await pause("diag");
    await x_monotone_triangulation(variables);

    // tagOff("diag");
    // setAddPoints(true);
    console.log("finished");
}

export function getBlocks(){
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
                if (variables.j < variables.pts.length - 2){
                    variables.j = variables.j + 1;
                    return runPointer + 1;
                }
                return runPointer + 12;
            },
            "For each point J in the polygon starting with the third point stopping after the second to last point"),

        // Block 5
        new CodeBlock(
            (variables, runPointer)=> {
                // console.log(variables.pts)
                // console.log(variables.stack.peek())
                // console.log(variables.j)
                // console.log(variables.pts[variables.stack.peek()].chain)
                // console.log(variables.pts[variables.j].chain)
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
    return blocks;
}