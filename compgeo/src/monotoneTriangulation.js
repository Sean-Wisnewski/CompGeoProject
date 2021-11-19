import Heap from 'heap-js';
import Stack from 'stackjs';
class StackElement {
    constructor(pt, chain) {
        this.pt = pt;
        this.chain = chain;
    }
}

function split_to_chains(pts){
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
    const comparator = (pt1, pt2) => pt1.x < pt2.x;
    let upper_heap = new Heap(comparator);
    let lower_heap = new Heap(comparator);
    console.log(max_index);
    console.log(min_index);
    for (let i = 0; i < pts.length; i++) {
        if ((min_index <= max_index)) {
            if ((min_index <= i) && (i < max_index)) {
                upper_heap.push(pts[i]);
            } else {
                lower_heap.push(pts[i]);
            }
        }else{
            if ((min_index >= i) && (i > max_index)) {
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
    if (upper_heap.length > 0) {
        while (upper_heap.length > 0) {
            all_pts.push(new StackElement(upper_heap.pop(), "upper"))
        }
    }
    if (lower_heap.length > 0) {
        while (lower_heap.length > 0) {
            all_pts.push(new StackElement(lower_heap.pop(), "lower"))
        }
    }
    return all_pts
}


export function splitPoints(polygon){
    var all_pts = split_to_chains(polygon);
    var top_points = [];
    var bot_points = [];
    for (const element of all_pts){
        console.log(element.chain)
        if (element.chain === "lower"){
            bot_points.push(element.pt);
            console.log("print Lower")
        }else{
            top_points.push(element.pt);
            console.log("print Upper")
        }
    }
    return [bot_points, top_points];
}

function x_monotone_triangulation(stackElements){
    let stack = new Stack();
    stack.push(0);
    stack.push(1);
    let diagonals = [];
    for (let j=2; j < stackElements.length - 1; j++) {
        if (stackElements[stack.peek()].chain !== stackElements[j].chain){
            while (stack.size() > 1) {
                let u = stack.pop();
                diagonals.append(LineSegment(stackElements[u].pt, stackElements[j].pt))
                show_polygon_with_diagonals(stackElements, diagonals, true)
            }
            stack.pop()
            stack.push(j - 1)
            stack.push(j)
        }
        else {
            var u = stack.pop(0);
            var u_l = u;
            while (stack && visible(stackElements, j, u) ) {
                diagonals.append(LineSegment(stackElements[u].pt, stackElements[j].pt))
                show_polygon_with_diagonals(stackElements, diagonals, true)
                if stack:
                u = stack.pop(0)
            }
            stack.push(u_l)
            stack.push(j)
        }
    }
    for (u in stack[1:-1]){
        diagonals.append(LineSegment(stackElements[u].pt, stackElements[-1].pt))
        show_polygon_with_diagonals(stackElements, diagonals, true)
    }
    return diagonals

    return [];
}

export function getDiagonals(polygon){
    var all_pts = split_to_chains(polygon);
    var diags = x_monotone_triangulation(all_pts);
    return diags;
}
