function split_to_chains(pts){
    var pt_min = pts[0];
    var pt_max = pts[0];
    var min_index = 0;
    var max_index = 0;
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
    var upper_heap = []
    var lower_heap = []
    heapify(upper_heap, comparator);
    heapify(lower_heap, comparator);
    var upper_as_list = []
    var lower_as_list = []

    for (let i = 0; i < pts.length; i++) {
        if (max_index <= i < min_index){
            heappush(lower_heap, pts[i])
        }else {
            heappush(upper_heap, pts[i])
        }
    }
}


export function getDiagonals(polygon){
    var all_pts = split_to_chains(polygon);
    var diags = x_monotone_triangulation(all_pts);
    return diags;
};
