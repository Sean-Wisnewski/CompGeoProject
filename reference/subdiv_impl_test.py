from polygon_subdivision import *
from SupportClasses import *
from subdiv_helpers import construct_tree_lookup_table
from visualizations import show_polygon

pts = (read_input_to_pts_list("../inputs/one_split_vertex.txt"))
#show_polygon(pts)
segs, pts_to_segs_dict = segs_from_pts(pts)
for k, v in pts_to_segs_dict.items():
    print(v)
#show_polygon(pts)
all_pts = split_to_chains(pts, True)
events = make_event_queue(all_pts)
# NOTE: This will crash on the last event b/c it's not actually a merge vertex. This is an issue with the
# determine_case function, which I have not yet fixed. I'm working on a fix, and then in theory the algorithm should just
# work. Still need to figure out how exactly to split to the correct polygons for triangulation
split_polygon_to_monotone_polygons(events, pts_to_segs_dict, segs)
