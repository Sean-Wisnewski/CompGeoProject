# already has the from SupportClasses import *
from helpers import *
from SupportClasses import SubdivEvent

def make_event_queue(pts_with_info):
    only_pts = [elem.pt for elem in pts_with_info]
    only_pts = sorted(only_pts, key=lambda pt: pt.x)
    return only_pts

def fixup(vertex, seg):
    """
    If helper(e_above) is a merge vertex, add a diagonal from v to helper(e_above)
    :param vertex:
    :param seg:
    :return:
    """
    pass

def determine_event_type(vertex, segs_involved):
    """
    Determines which of the 6 cases is occurring at the current vertex encountered
    :param vertex:
    :param segs_involved:
    :return:
    """
    # out of I'm lazy, just give direct named access to important points
    # NOTE: I've defined line segments to *always* have the right endpoint be the pt with a larger x value
    left_seg0 = segs_involved[0].pt0
    right_seg0 = segs_involved[0].pt1
    left_seg1 = segs_involved[1].pt0
    right_seg1 = segs_involved[1].pt1

    if vertex == left_seg0 and vertex == left_seg1:
        # TODO changing the angle to be [0, 2pi] is causing issues: negative angles become too large
        int_angle = compute_interior_angle(vertex, right_seg0, right_seg1, True)
        if math.pi <= int_angle:
            return SubdivEvent.SPLIT
        else:
            return SubdivEvent.START
    elif vertex == right_seg0 and vertex == right_seg1:
        int_angle = compute_interior_angle(vertex, left_seg0, left_seg1, True)
        if math.pi <= int_angle:
            return SubdivEvent.MERGE
        else:
            return SubdivEvent.END
    # the vertex is either on the upper or lower chain
    else:
        # not honestly sure how to determine the location of the interior with just a vertex + 2 segs (don't think possible?)
        return SubdivEvent.UNIMPL

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
        print(determine_event_type(vertex, segs_involved))

pts = (read_input_to_pts_list("inputs/simple_non_monotone.txt"))
segs, pts_to_segs_dict = segs_from_pts(pts)
for k, v in pts_to_segs_dict.items():
    print(v)
all_pts = split_to_chains(pts, True)
events = make_event_queue(all_pts)
split_polygon_to_monotone_polygons(events, pts_to_segs_dict)