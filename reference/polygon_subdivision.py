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

def make_diags_dicts(diags):
    return {diag.pt0 : diag for diag in diags}, {diag.pt1 : diag for diag in diags}

def check_seg_on_diag(seg, diag):
    seg_pts = [seg.pt0, seg.pt1]
    diag_pts = [diag.pt0, diag.pt1]
    return any(pt in seg_pts for pt in diag_pts)

def make_polys(pts, diags):
    diags_dict1, diags_dict2 = make_diags_dicts(diags)
    segs = []
    polys = []
    poly_pts = []
    all_poly_pts = []
    for idx, pt in enumerate(pts):
        print(idx)
        if idx < len(pts)-1:
            next_pt = pts[idx+1]
            seg = LineSegment(pt, next_pt)
            segs.append(seg)
            poly_pts.append(seg.pt0)
            poly_pts.append(seg.pt1)
            if next_pt in diags_dict1:
                diag = diags_dict1[next_pt]
            elif next_pt in diags_dict2:
                diag = diags_dict2[next_pt]
            else:
                diag = None
            if diag is not None:
                segs.append(diag)
                if next_pt == diag.pt0:
                    next_idx = pts.index(diag.pt1)
                else:
                    next_idx = pts.index(diag.pt0)
                seen_known = False
                while not seen_known:
                    # TODO handle out of bounds
                    startpt = pts[next_idx]
                    if next_idx+1 >= len(pts):
                        endpt = pts[0]
                    else:
                        endpt = pts[next_idx+1]
                    new_seg = LineSegment(startpt, endpt)
                    segs.append(new_seg)
                    if startpt in poly_pts:
                        polys.append(segs)
                        all_poly_pts.append(poly_pts)
                        segs = []
                        #seg = LineSegment(pt, next_pt)
                        #segs.append(seg)
                        poly_pts = []
                        seen_known = True
                    else:
                        poly_pts.append(new_seg.pt0)
                        poly_pts.append(new_seg.pt1)
        else:
            next_pt = pts[0]
            seg = LineSegment(pts[idx], pts[0])
            segs.append(seg)
            poly_pts.append(seg.pt0)
            poly_pts.append(seg.pt1)
            if next_pt in diags_dict1:
                diag = diags_dict1[next_pt]
            elif next_pt in diags_dict2:
                diag = diags_dict2[next_pt]
            else:
                diag = None
            if diag is not None:
                segs.append(diag)
                if next_pt == diag.pt0:
                    next_idx = pts.index(diag.pt1)
                else:
                    next_idx = pts.index(diag.pt0)
                seen_known = False
                while not seen_known:
                    # TODO handle out of bounds
                    startpt = pts[next_idx]
                    if next_idx+1 >= len(pts):
                        endpt = pts[0]
                    else:
                        endpt = pts[next_idx+1]
                    new_seg = LineSegment(startpt, endpt)
                    segs.append(new_seg)
                    if startpt in poly_pts:
                        polys.append(segs)
                        all_poly_pts.append(poly_pts)
                        segs = []
                        #seg = LineSegment(pt, next_pt)
                        #segs.append(seg)
                        poly_pts = []
                        seen_known = True
                    else:
                        poly_pts.append(new_seg.pt0)
                        poly_pts.append(new_seg.pt1)
    return polys


def split_to_polys(pts, diags, pts_to_segs):
    diags_dict1, diags_dict2 = make_diags_dicts(diags)
    segs = []
    polys = []
    poly_pts = []
    all_poly_pts = []
    for diag in diags:
        segs.append(diag)
        start_idx = pts.index(diag.pt0)
        end_idx = pts.index(diag.pt1)
        idx = start_idx
        while idx != end_idx:
            if idx == len(pts)-1:
                next_idx = 0
            else:
                next_idx = idx+1
            if pts[idx] in diags_dict1:
                seg = diags_dict1[pts[idx]]
            else:
                seg = LineSegment(pts[idx], pts[next_idx])
            poly_pts.append(pts[idx])
            poly_pts.append(pts[next_idx])
            segs.append(seg)
            idx += 1
            if idx >= len(pts)-1:
                idx = 0
        polys.append(segs)
        all_poly_pts.append(poly_pts)
        segs = []
        poly_pts = []

        idx = end_idx
        segs.append(diag)
        while idx != start_idx:
            if idx == len(pts) - 1:
                next_idx = 0
            else:
                next_idx = idx + 1
            if pts[idx] in diags_dict1:
                seg = diags_dict1[pts[idx]]
            else:
                seg = LineSegment(pts[idx], pts[next_idx])
            poly_pts.append(pts[idx])
            poly_pts.append(pts[next_idx])
            segs.append(seg)
            idx += 1
            if idx >= len(pts):
                idx = 0
        polys.append(segs)
        all_poly_pts.append(poly_pts)
        segs = []
        poly_pts = []

    return polys

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
    # list of line segments representing the added diagonals
    diags = []
    for event in events:
        print(event.pt)
        # segments are always inserted at their left endpoints, there is probably a better way to do this but it works for now
        segs_involved = get_segs_involved(event.pt, pts_to_segs)
        etype = determine_event_type(event, segs_involved)
        if etype == SubdivEvent.START:
            print("start")
            start(event.pt, tm, helpers, pts_to_segs, lut)
        elif etype == SubdivEvent.UPPER:
            print("upper")
            upper(event.pt, tm, helpers, pts_to_segs, lut, diags)
        elif etype == SubdivEvent.LOWER:
            print("lower")
            lower(event.pt, tm, helpers, pts_to_segs, lut, diags)
        elif etype == SubdivEvent.END:
            print("end")
            end(event.pt, tm, helpers, pts_to_segs, lut, diags)
        elif etype == SubdivEvent.SPLIT:
            print("split")
            split(event.pt, tm, helpers, pts_to_segs, lut, diags)
        elif etype == SubdivEvent.MERGE:
            print("merge")
            merge(event.pt, tm, helpers, pts_to_segs, lut, diags)
        else:
            print("This should literally be unreachable code, you done fucked up son")
        entries = get_just_segs_from_tm(tm)
        print(entries)
        for k, v in helpers.items():
            print(f"{k}: {v}")
        print()
    for d in diags:
        print(d)
    return diags


def get_just_segs_from_tm(tm : TreeMap):
    unclean = list(tm.entry_set())
    entries = [entry.value.name for entry in unclean]
    return entries