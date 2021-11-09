# already has the from SupportClasses import *
from helpers import *
from SupportClasses import SubdivEvent, Event, EndptType
from subdiv_helpers import *
from pytreemap import TreeMap

def make_event_queue(pts_with_info):
    events = []
    for entry in pts_with_info:
        events.append(Event(entry.pt, entry.chain))
    events_sorted = sorted(events, key = lambda elem : elem.pt.x)
    return events_sorted

def determine_event_type(event : Event, segs_involved):
    """
    Determines which of the 6 cases is occurring at the current vertex encountered
    Needs confirmation:
    - If upper chain, poly interior is below top seg
    - If lower chain, poly interior is above top seg
    :param event:
    :param segs_involved:
    :return:
    """
    # TODO fix this shit: not always giving the right type of event, specifically for start/split/merge/end due to incorrect angles
    # out of I'm lazy, just give direct named access to important points
    # NOTE: I've defined line segments to *always* have the right endpoint be the pt with a larger x value
    seg0, seg1 = segs_involved[0], segs_involved[1]
    # this happens too early: if right endpt is the same, it doesn't work
    if seg0.pt0 == seg1.pt0:
        if orient_test(seg0.pt1, seg0.pt0, seg1.pt1) > 0:
            seg0, seg1 = seg1, seg0
    else:
        if orient_test(seg0.pt0, seg0.pt1, seg1.pt0) > 0:
            seg0, seg1 = seg1, seg0
    left_seg0 = seg0.pt0
    right_seg0 = seg0.pt1
    left_seg1 = seg1.pt0
    right_seg1 = seg1.pt1
    event_pt = event.pt

    # either a split vertex or a start vertex
    if event_pt == left_seg0 and event_pt == left_seg1:
        if event.chain == "upper":
            int_angle = compute_interior_angle(event_pt, right_seg0, right_seg1, False)
        else:
            int_angle = compute_interior_angle(event_pt, right_seg1, right_seg0, False)
        if math.pi <= int_angle:
            return SubdivEvent.SPLIT
        else:
            return SubdivEvent.START
    # merge or end vertex
    elif event_pt == right_seg0 and event_pt == right_seg1:
        if event.chain == "upper":
            int_angle = compute_interior_angle(event_pt, left_seg1, left_seg0, False)
        else:
            int_angle = compute_interior_angle(event_pt, left_seg0, left_seg1, False)
        if math.pi <= int_angle:
            return SubdivEvent.MERGE
        else:
            return SubdivEvent.END
    # the vertex is either on the upper or lower chain
    else:
        # cheating with extra metadata
        if event.chain == 'upper':
            return SubdivEvent.UPPER
        else:
            return SubdivEvent.LOWER

def split_polygon_to_monotone_polygons(events, pts_to_segs, segs):
    """
    The high level implementation of the splitting of a non-monotone polygon to several monotone polygons.
    This function really just does all the bookkeeping, all the interesting bits happen in the helper functions.
    Calls those helper functions based on the scenario found at each vertex
    :param events:
    :param pts_to_segs_dict:
    :return:
    """
    tm = TreeMap(comparator=above_below_comparator)
    lut = construct_tree_lookup_table(segs)
    helpers = {}
    for event in events:
        print(event.pt)
        # segments are always inserted at their left endpoints, there is probably a better way to do this but it works for now
        segs_involved = get_segs_involved(event.pt, pts_to_segs)
        etype = determine_event_type(event, segs_involved)
        if etype == SubdivEvent.START:
            print("start")
            #start(event.pt, tm, helpers, pts_to_segs, lut)
        elif etype == SubdivEvent.UPPER:
            print("upper")
            #upper(event.pt, tm, helpers, pts_to_segs, lut)
        elif etype == SubdivEvent.LOWER:
            print("lower")
            #lower(event.pt, tm, helpers, pts_to_segs, lut)
        elif etype == SubdivEvent.END:
            print("end")
            #end(event.pt, tm, helpers, pts_to_segs, lut)
        elif etype == SubdivEvent.SPLIT:
            print("split")
            #split(event.pt, tm, helpers, pts_to_segs, lut)
        elif etype == SubdivEvent.MERGE:
            print("merge")
            #merge(event.pt, tm, helpers, pts_to_segs, lut)
        else:
            print("This should literally be unreachable code, you done fucked up son")
        entries = get_just_segs_from_tm(tm)
        print(entries)
        for k, v in helpers.items():
            print(f"{k}: {v}")
        print()


def get_just_segs_from_tm(tm : TreeMap):
    unclean = list(tm.entry_set())
    entries = [entry.value.name for entry in unclean]
    return entries

def tm_from_event_q(events, pts_to_segs, segs):
    tm = TreeMap(comparator=above_below_comparator)
    lut = construct_tree_lookup_table(segs)
    for event in events:
        if event.endpt_type == EndptType.LEFT:
            # TODO insert line segment, then handle the current vertex
            # Always insert segments with their left endpoints, as we delete them at the right from the tree
            tm.put((event.seg.name, event.seg.pt0.x, lut), event.seg)
            entries = get_just_segs_from_tm(tm)
            print("After insertion")
            print(entries)
        else:
            # TODO delete a line segment
            tm.remove((event.seg.name, event.seg.pt0.x, lut))
            entries = get_just_segs_from_tm(tm)
            print("After deletion")
            print(entries)
            pass