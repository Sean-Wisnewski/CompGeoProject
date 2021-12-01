import Heap from 'heap-js';
import Stack from 'stackjs'


class StackElement {
    constructor(pt, chain) {
        this.pt = pt;
        this.chain = chain;
    }
}
class LineSegment {
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

export function splitPoints(polygon){
    let all_pts = split_to_chains(polygon);
    let top_points = [];
    let bot_points = [];
    for (const element of all_pts){
        // console.log(element.chain)
        if (element.chain === "lower"){
            bot_points.push(element.pt);
            // console.log("print Lower")
        }else{
            top_points.push(element.pt);
            // console.log("print Upper")
        }
    }
    return [bot_points, top_points];
}

function orient_test(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

function visible(pts, j, u) {
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
    variables.stack = new Stack();
    // tagOff("start-stack");

    // tagOn("stack-push-0"); // Add index 0 to the top of the stack
    // await pause("stack-push-0");
    variables.stack.push(0);
    // tagOff("stack-push-0");

    // tagOn("stack-push-1"); // Add index 1 to the top of the stack
    // await pause("stack-push-1")
    variables.stack.push(1);
    // tagOff("stack-push-1");

    // tagOn("start-diagonals"); // Initialize an empty list of diagonals
    // await pause("start-diagonals");
    variables.diagonals = [];
    // tagOff("start-diagonals");


    // for (let j=2; j < pts.length - 1; j++) {
    for (variables.j = 2; variables.j < variables.pts.length - 1; variables.j = variables.j + 1) {
        if (variables.pts[variables.stack.peek()].chain !== variables.pts[variables.j].chain){

            while (variables.stack.size() > 1) {
                // tagOn("same-chain-if-while-more-than-2"); // while there are at least 2 points on the stack
                // await pause("same-chain-if-while-more-than-2");
                // tagOff("same-chain-if-while-more-than-2");

                // tagOn("same-chain-if-while-more-than-2-add-diag"); // Pop a point U off the top of the stack and add a diagonal from U to J
                // await pause("same-chain-if-while-more-than-2-add-diag");
                variables.u= variables.stack.pop();
                variables.diagonals.push(new LineSegment(variables.pts[variables.u].pt, variables.pts[variables.j].pt));
                // tagOff("same-chain-if-while-more-than-2-add-diag");
                // show_polygon_with_diagonals(stackElements, diagonals, true)
            }
            variables.stack= new Stack();
            variables.stack.push(variables.j - 1);
            variables.stack.push(variables.j);
        } else {
            // tagOn("same-chain-else"); // else
            // await pause("same-chain-else");
            // tagOff("same-chain-else");

            // tagOn("same-chain-else-pop"); // Pop a point U off the top of the stack
            // await pause("same-chain-else-pop");
            variables.u= variables.stack.pop();
            variables.u_l= variables.u;
            // tagOff("same-chain-else-pop");

            while ((!variables.stack.isEmpty()) && visible(variables.pts, variables.j, variables.u) ) {
                // tagOn("same-chain-else-while"); // while the stack is not empty and U is visible from J
                // await pause("same-chain-else-while");
                // tagOff("same-chain-else-while");

                // tagOn("same-chain-else-while-add"); // Add a diagonal from u to j
                // await pause("same-chain-else-while-add");
                variables.diagonals.push(new LineSegment(variables.pts[variables.u].pt, variables.pts[variables.j].pt));
                // tagOff("same-chain-else-while-add");
                // show_polygon_with_diagonals(stackElements, diagonals, true)
                // tagOn("same-chain-else-while-if-not-empty");// If the stack is not empty
                // await pause("same-chain-else-while-if-not-empty");
                // tagOff("same-chain-else-while-if-not-empty");
                if (!variables.stack.isEmpty()) {
                    // tagOn("same-chain-else-while-if-not-empty-popped");// Set U to a point popped off the top of the stack
                    // await pause("same-chain-else-while-if-not-empty-popped");
                    // u = variables.stack").pop();
                    variables.u = variables.stack.pop();
                    // tagOff("same-chain-else-while-if-not-empty-popped");
                }
            }
            // tagOn("same-chain-else-while"); // while the stack is not empty and U is visible from J
            // await pause("same-chain-else-while");
            // tagOff("same-chain-else-while");

            // tagOn("same-chain-else-push-ul");// Push UL onto the stack
            // await pause("same-chain-else-ul");
            variables.stack.push(variables.u_l);
            // tagOff("same-chain-else-push-ul");


            // tagOn("same-chain-else-push-j"); // Push J onto the stack
            // await pause("same-chain-else-push-j");
            variables.stack.push(variables.j);
            // tagOff("same-chain-else-push-j");
        }
    }
    variables.stack.pop()
    while (variables.stack.size() > 1) {
        // tagOn("last-while-if-not-empty"); // while the stack has more than one point on it
        // await pause("last-while-if-not-empty");
        // tagOff("last-while-if-not-empty");

        // tagOn("last-while-if-not-empty-popped");// Set U to a point popped off the top of the stack
        // await pause("last-while-if-not-empty-popped");
        variables.u = variables.stack.pop();
        // tagOff("last-while-if-not-empty-popped");

        // tagOn("last-while-if-not-empty-add-diag"); // Add a diagonal from U to the last point in the list of points
        // await pause("last-while-if-not-empty-add-diag");
        variables.diagonals.push(new LineSegment(variables.pts[variables.u].pt, variables.pts[variables.pts.length-1].pt));
        // tagOff("last-while-if-not-empty-add-diag");
        // show_polygon_with_diagonals(stackElements, diagonals, true)
    }
    // tagOn("last-while-if-not-empty"); // while the stack has more than one point on it
    // await pause("last-while-if-not-empty");
    // tagOff("last-while-if-not-empty");
}

export async function getDiagonals(variables, setAddPoints){
    setAddPoints(false);
    // tagOn("split");
    // await pause("split");
    variables.pts = split_to_chains(variables.coordinates);
    // tagOff("split");
    // tagOn("diag");
    // await pause("diag");
    await x_monotone_triangulation(variables);

    // tagOff("diag");
    setAddPoints(true);
    console.log("finished");
}
