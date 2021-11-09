from SupportClasses import *
from pytreemap import TreeMap
from helpers import orient_test

def construct_tree_lookup_table(segs : [LineSegment]):
    lut = {}
    for seg in segs:
        lut[seg.name] = seg
    return lut

def get_slope_and_y_intercept(edge : LineSegment):
    """
    self documenting
    :param edge:
    :return:
    """
    try:
        m = (edge.pt1.y - edge.pt0.y)/(edge.pt1.x - edge.pt0.x)
    except ZeroDivisionError:
        # Making m = 0 will effectively make the x make no difference, since this is either
        # a horizontal or vertical line
        m = 0
    if m == 0:
        b = edge.pt0.y
    else:
        b =  edge.pt0.y - m*edge.pt0.x
    return m, b

def above_below_comparator(e1 : tuple[str, int, dict[str : LineSegment]], e2 : tuple[str, int, dict[str : LineSegment]]):
    """
    Warning: this entire fucntion is a hack to not have to edit source code b/c I'm lazy af
    each edge passed in is a triplet of Seg Name (unique), an int for the x value the SLS is currently at, and
    a lookup table of {Seg Name : Segment}
    This function then compares the line segments to determine which is on top at the current x value of the sweep line.
    If the segments are the same, they are compared at a tiny step forward in x to determine which goes on top
    To make life easier, a line segment can be inserted twice. If this ever happens, the line segment comparison
    ensures that a line won't be inserted twice (see LineSegment __eq__ fn)
    :param e1:
    :param e2:
    :return: -1 if e1 < e2 (i.e. e1 below e2), 1 if e1 > e2 (i.e. e1 above e2), 0 if e1 == e2
    """
    EPS = 0.0000001
    # This entire function is a hack
    lut = e1[2]
    # hacky way to get around only being able to compare 2 things, so make the key the line segment and the x coord
    #assert e1[1] == e2[1]
    x0 = max(e1[1], e2[1])
    seg1 = lut[e1[0]]
    seg2 = lut[e2[0]]
    m1, b1 = get_slope_and_y_intercept(seg1)
    m2, b2 = get_slope_and_y_intercept(seg2)
    y1 = m1*x0 + b1
    y2 = m2*x0 + b2
    if y1 < y2:
        return -1
    elif y1 > y2:
        return 1
    else:
        # only return 0 if they are actually the same segment
        if seg1 == seg2:
            return 0
        else:
            return above_below_comparator((seg1.name, seg1.pt0.x+EPS, lut), (seg2.name, seg2.pt0.x+EPS, lut))

def add_to_sls(seg : LineSegment, lut, sls : TreeMap):
    sls.put((seg.name, seg.pt0.x, lut), seg)

def del_from_sls(seg : LineSegment, lut, sls : TreeMap):
    sls.remove((seg.name, seg.pt0.x, lut))

def add_to_helpers(seg0, vertex, helpers, seg1=None, vertex_is_merge=False):
    if seg1 is not None:
        if orient_test(seg0.pt1, seg0.pt0, seg1.pt1) < 0:
            if vertex_is_merge:
                helpers[seg0.name] = HelperEntry(vertex, seg0, VertexType.MERGE)
            else:
                helpers[seg0.name] = HelperEntry(vertex, seg0, VertexType.NOT_MERGE)
        else:
            if vertex_is_merge:
                helpers[seg1.name] = HelperEntry(vertex, seg1, VertexType.MERGE)
            else:
                helpers[seg1.name] = HelperEntry(vertex, seg1, VertexType.NOT_MERGE)
    else:
        if vertex_is_merge:
            helpers[seg0.name] = HelperEntry(vertex, seg0, VertexType.MERGE)
        else:
            helpers[seg0.name] = HelperEntry(vertex, seg0, VertexType.NOT_MERGE)

def get_segs_involved(vertex, pts_to_segs):
    segs_involved = pts_to_segs[vertex]
    return segs_involved[0], segs_involved[1]

####################
# Helpers for the 6 Cases
####################

def fixup(vertex, seg, helpers):
    if seg.name in helpers:
        entry = helpers[seg.name]
        if entry.vertex_type == VertexType.MERGE:
            return LineSegment(vertex, entry.vertex, "ADDED_DIAGONAL")
    else:
        return None

# TODO split, upper, lower all need to know which segment is being dealt with, need to attach extra info
def split(vertex, sls, helpers, pts_to_segs, lut):
    seg0, seg1 = get_segs_involved(vertex, pts_to_segs)
    # we want to search from the top edge for this vertex, so swap if needed
    # ensure seg0 is the top seg
    if orient_test(seg0.pt1, seg0.pt0, seg1.pt1) > 0:
        seg0, seg1 = seg1, seg0
    new_diag = LineSegment(vertex, helpers[seg0.name], "ADDED_DIAGONAL")
    add_to_sls(seg0, lut, sls)
    add_to_sls(seg1, lut, sls)
    add_to_helpers(seg0, vertex, helpers)
    add_to_helpers(seg1, vertex, helpers)
    return new_diag


def merge(vertex, sls : TreeMap, helpers, pts_to_segs, lut):
    seg0, seg1 = get_segs_involved(vertex, pts_to_segs)
    # ensure seg0 is the top seg
    if orient_test(seg0.pt1, seg0.pt0, seg1.pt1) > 0:
        seg0, seg1 = seg1, seg0
    del_from_sls(seg0, lut, sls)
    del_from_sls(seg1, lut, sls)
    # swap earlier ensures seg0 is the top seg
    e = sls.higher_entry((seg0.name, seg0.pt0.x, lut))
    e = e.value
    fixup(vertex, e, helpers)
    fixup(vertex, seg1, helpers)
    add_to_helpers(e, vertex, helpers, vertex_is_merge=True)


def start(vertex, sls, helpers, pts_to_segs, lut):
    seg0, seg1 = get_segs_involved(vertex, pts_to_segs)
    add_to_sls(seg0, lut, sls)
    add_to_sls(seg1, lut, sls)
    if orient_test(seg0.pt1, seg0.pt0, seg1.pt1) < 0:
        add_to_helpers(seg0, vertex, helpers, vertex_is_merge=False)
    else:
        add_to_helpers(seg1, vertex, helpers, vertex_is_merge=False)

def end(vertex, sls, helpers, pts_to_segs, lut):
    seg0, seg1 = get_segs_involved(vertex, pts_to_segs)
    if orient_test(seg0.pt1, seg0.pt0, seg1.pt1) < 0:
        fixup(vertex, seg0, helpers)
    else:
        fixup(vertex, seg1, helpers)
    del_from_sls(seg0, lut, sls)
    del_from_sls(seg1, lut, sls)

def upper(vertex, sls, helpers, pts_to_segs, lut):
    seg0, seg1 = get_segs_involved(vertex, pts_to_segs)
    # means seg0 is the right seg
    if seg0.pt1 == vertex:
        # swap seg ordering
        seg0, seg1 = seg1, seg0
    fixup(vertex, seg0, helpers)
    del_from_sls(seg0, lut, sls)
    add_to_sls(seg1, lut, sls)
    add_to_helpers(seg1, vertex, helpers)


def lower(vertex, sls : TreeMap, helpers, pts_to_segs, lut):
    seg0, seg1 = get_segs_involved(vertex, pts_to_segs)
    # means seg0 is the right seg
    if seg0.pt1 == vertex:
        # swap seg ordering
        seg0, seg1 = seg1, seg0
    # the above swap ensures that seg0 will be the seg to v's left. This is what we use as the key to search in the sls
    e = sls.higher_entry((seg0.name, seg0.pt0.x, lut))
    e = e.value
    fixup(vertex, e, helpers)
    # means seg0 is the right seg
    if seg0.pt1 == vertex:
        # swap seg ordering
        seg0, seg1 = seg1, seg0
    # swap above ensures correct ordering
    del_from_sls(seg0, lut, sls)
    add_to_sls(seg1, lut, sls)
    add_to_helpers(seg1, vertex, helpers)


