from polygon_subdivision import *
from SupportClasses import *
from subdiv_helpers import construct_tree_lookup_table
from visualizations import show_polygon

pts = (read_input_to_pts_list("../inputs/simple_non_monotone.txt"))
segs, pts_to_segs_dict = segs_from_pts(pts)
for k, v in pts_to_segs_dict.items():
    print(v)
#show_polygon(pts)
all_pts = split_to_chains(pts, True)
events = make_event_queue(all_pts, segs)
split_polygon_to_monotone_polygons(events, pts_to_segs_dict, segs)
