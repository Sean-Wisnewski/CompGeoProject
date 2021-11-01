from helpers import *

def make_event_queue(pts_with_info):
    only_pts = [elem.pt for elem in pts_with_info]
    only_pts = sorted(only_pts, key=lambda pt: pt.x)
    return only_pts

def split_polygon_to_monotone_polygons(events, pts_to_segs_dict):
    """
    The high level implementation of the splitting of a non-monotone polygon to several monotone polygons.
    This function really just does all the bookkeeping, all the interesting bits happen in the helper functions.
    Calls those helper functions based on the scenario found at each vertex
    :param events:
    :param pts_to_segs_dict:
    :return:
    """
    for vertex in events:
        # To make our lives easy, make it so that exactly two segments intersect at each vertex: in other words, no
        # triple (or higher) intersection - this is inherent to the algorithm
        segs_involved = pts_to_segs_dict[vertex]

pts = (read_input_to_pts_list("inputs/simple_all_positive.txt"))
segs, pts_to_segs_dict = segs_from_pts(pts)
all_pts = split_to_chains(pts, True)
events = make_event_queue(all_pts)
split_polygon_to_monotone_polygons(events, pts_to_segs_dict)