import math
from heapq import heappush, heappop, heappushpop, heapify

from SupportClasses import StackElement, LineSegment, Point
from visualizations import show_polygon_with_diagonals


def compute_interior_angle(pt0, pt1, pt2):
    """
    Computes the interior angle of a vertex given 3 points.
    NOTE: Assumes that *pt0* is the vertex you would like to find the interior angle of
    :param pt0:
    :param pt1:
    :param pt2:
    :return:
    """
    angle = math.atan2(pt1.y - pt0.y, pt1.x - pt0.x) - math.atan2(pt2.y - pt0.y, pt2.x - pt0.x)
    if angle < 0:
        angle += 2 * math.pi
    elif angle > 2 * math.pi:
        angle -= 2 * math.pi
    return angle


def read_input_to_pts_list(fname):
    pts = []
    with open(fname, "r") as f:
        lines = f.readlines()
        for line in lines:
            vals = line.split(" ")
            # assumes that vals is only of len 2 (i.e. 2 pts
            pts.append(Point(float(vals[0]), float(vals[1])))
    return pts


def check_monotonicity(pts, dir='x'):
    if dir == 'x':
        for idx in range(len(pts) - 1):
            if pts[idx] >= pts[idx + 1]:
                return False
    return True


def split_to_chains(pts, as_one_list=False):
    """
    Splits to upper and lower chains, assuming this is for x monotonicity
    Note that this assumes that points are entered in a cyclic order
    :param pts:
    :return:
    """
    pt_min = min(pts, key=lambda pt: pt.x)
    pt_max = max(pts, key=lambda pt: pt.x)
    min_idx = pts.index(pt_min)
    max_idx = pts.index(pt_max)
    upper = []
    lower = []
    upper_as_list = []
    lower_as_list = []
    for idx, pt in enumerate(pts):
        if max_idx <= idx < min_idx:
            heappush(lower, pt)
        else:
            heappush(upper, pt)
    if not as_one_list:
        while len(upper) > 0:
            upper_as_list.append(heappop(upper))
        while len(lower) > 0:
            lower_as_list.append(heappop(lower))
        return upper_as_list, lower_as_list
    else:
        all_pts = []
        while len(upper) > 0 and len(lower) > 0:
            if upper[0] < lower[0]:
                all_pts.append(StackElement(heappop(upper), "upper"))
            else:
                all_pts.append(StackElement(heappop(lower), "lower"))
        if len(upper) > 0:
            while len(upper) > 0:
                all_pts.append(StackElement(heappop(upper), "upper"))
        if len(lower) > 0:
            while len(lower) > 0:
                all_pts.append(StackElement(heappop(lower), "lower"))
        return all_pts


def check_vertex_reflexive(vi, vi_1, vi_2):
    angle = compute_interior_angle(vi_1, vi, vi_2)
    if angle >= math.pi:
        return True
    else:
        return False


def orient_test(p, q, r):
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)


def visible(pts, j, u):
    for i in range(u+1, j):
        if pts[i].chain == "lower" and orient_test(pts[j].pt, pts[i].pt, pts[u].pt) >= 0:
            return False
        elif pts[i].chain == "upper" and orient_test(pts[j].pt, pts[i].pt, pts[u].pt) <= 0:
            return False
    return (j - (1 + u)) > 0


# whereas I could implement merge to merge the two queues, I'm kinda lazy
def x_monotone_triangulation(pts: list):
    stack = []
    stack.insert(0, 0)
    stack.insert(0, 1)
    # u = stack[0]
    diagonals = []

    for j in range(2, len(pts) - 1):
        if pts[stack[0]].chain != pts[j].chain:
            for u in stack[:-1]:
                diagonals.append(LineSegment(pts[u].pt, pts[j].pt))
                show_polygon_with_diagonals(pts, diagonals, True)
            stack = []
            stack.insert(0, j - 1)
            stack.insert(0, j)
        else:
            u = u_l = stack.pop(0)
            while stack and visible(pts, j, u):
                diagonals.append(LineSegment(pts[u].pt, pts[j].pt))
                show_polygon_with_diagonals(pts, diagonals, True)
                if stack:
                    u = stack.pop(0)
            stack.insert(0, u_l)
            stack.insert(0, j)
    for u in stack[1:-1]:
        diagonals.append(LineSegment(pts[u].pt, pts[-1].pt))
        show_polygon_with_diagonals(pts, diagonals, True)
    return diagonals


