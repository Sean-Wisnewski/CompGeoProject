from SupportClasses import LineSegment, Point

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
            # TODO change x values of tuples to be correct
            return above_below_comparator((seg1.name, seg1.pt0.x+EPS, lut), (seg2.name, seg2.pt0.x+EPS, lut))
