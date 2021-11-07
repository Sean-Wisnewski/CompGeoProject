# already has the from SupportClasses import *
from helpers import *
from SupportClasses import SubdivEvent, Event, EndptType
from subdiv_helpers import *
from pytreemap import TreeMap

def make_event_queue(pts_with_info, segs):
    pts_info_dict = {elem.pt : elem.chain for elem in pts_with_info}
    events = []
    for seg in segs:
        chain = pts_info_dict[seg.pt0]
        events.append(Event(seg.pt0, seg, EndptType.LEFT, chain))
        chain = pts_info_dict[seg.pt1]
        events.append(Event(seg.pt1, seg, EndptType.RIGHT, chain))
    #pts_with_info_sorted = sorted(pts_with_info, key=lambda elem: elem.pt.x)
    events_sorted = sorted(events, key = lambda elem : elem.pt.x)
    return events_sorted

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
        # TODO just cheat and use the extra info I have for each event
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

def get_just_segs_from_tm(tm : TreeMap):
    unclean = list(tm.entry_set())
    entries = [entry.value.name for entry in unclean]
    return entries

def tm_from_event_q(events, pts_to_segs, segs):
    tm = TreeMap(comparator=above_below_comparator)
    lut = construct_tree_lookup_table(segs)
    for event in events:
        print(str(event.pt) + " "  + event.seg.name + " "  + str(event.endpt_type))


def build_tree_map(segs : [LineSegment]):
    tm = TreeMap(comparator=above_below_comparator)
    lut = construct_tree_lookup_table(segs)
    for seg in segs:
        # really need to put in at left endpoints, delete at right endpoints
        # will need to attach additional info to the events to make this easier to do
        # this is such a dumb fucking hack
        tm.put((seg.name, seg.pt0.x, lut) , seg)
        entries = get_just_segs_from_tm(tm)
        #print(entries)