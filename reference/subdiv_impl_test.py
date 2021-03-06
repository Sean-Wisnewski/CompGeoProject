from polygon_subdivision import *
from SupportClasses import *
from subdiv_helpers import construct_tree_lookup_table
from visualizations import show_polygon, show_polygon_with_diagonals

#pts = (read_input_to_pts_list("../inputs/one_merge_vertex.txt"))
#pts = (read_input_to_pts_list("../inputs/one_split_vertex.txt"))
pts = (read_input_to_pts_list("../inputs/test.txt"))
#pts = (read_input_to_pts_list("../inputs/simple_non_monotone.txt"))
#show_polygon(pts)
segs, pts_to_segs_dict = segs_from_pts(pts)
for k, v in pts_to_segs_dict.items():
    print(v)
#show_polygon(pts)
all_pts = split_to_chains(pts, True)
events = make_event_queue(all_pts)
for e in events:
    print(e)
diags = split_polygon_to_monotone_polygons(events, pts_to_segs_dict, segs)
print()
#polys = split_to_polys(pts, diags, pts_to_segs_dict)
polys = make_polys(pts, diags)
for poly in polys:
    poly_pts = []
    for seg in poly:
        print(seg)
        poly_pts.append(seg.pt0)
        poly_pts.append(seg.pt1)
    print()
    show_polygon(poly_pts)
show_polygon_with_diagonals(pts, diags)

"""
pt0 = Point(0, 0, 0)
pt1 = Point(1, 1, 1)
pt2 = Point(1, -1, 1)
ang = compute_interior_angle(pt0, pt2, pt1)
print(math.degrees(ang))
"""