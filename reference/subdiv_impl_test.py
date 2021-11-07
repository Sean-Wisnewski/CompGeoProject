from polygon_subdivision import *
from subdiv_helpers import construct_tree_lookup_table
from visualizations import show_polygon

pts = (read_input_to_pts_list("../inputs/simple_non_monotone.txt"))
segs, pts_to_segs_dict = segs_from_pts(pts)
build_tree_map(segs)
for k, v in pts_to_segs_dict.items():
    print(v)
#show_polygon(pts)
# needs to be global in order for the comparator to work
#lut = construct_tree_lookup_table(segs)
#for k, v in lut.items():
#    print(f"{k}: {v}")
all_pts = split_to_chains(pts, True)
events = make_event_queue(all_pts, segs)
tm_from_event_q(events, pts_to_segs_dict, segs)
#split_polygon_to_monotone_polygons(events, pts_to_segs_dict)
