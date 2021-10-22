import numpy as np
import math
from heapq import heappush, heappop, heappushpop, heapify
from functools import total_ordering
from matplotlib import pyplot as plt

@total_ordering
class Point:
    """
    Class to represent a 2d point in space
    """
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"x: {self.x} y: {self.y}"

    def __eq__(self, pt2):
        return self.x == pt2.x and self.y == pt2.y

    def __lt__(self, pt2):
        return self.x <= pt2.x

class StackElement:
    def __init__(self, pt, chain):
        self.pt = pt
        self.chain = chain

    def __repr__(self):
        return f"[({self.pt}), {self.chain}]"

    def __eq__(self, other):
        return self.pt == other.pt


class LineSegment:
    def __init__(self, pt0, pt1):
        self.pt0 = pt0
        self.pt1 = pt1

    def __repr__(self):
        return f"[({self.pt0}), ({self.pt1})]"

    def __eq__(self, e2):
        return self.pt0 == e2.pt0 and self.pt1 == e2.pt1

def compute_interior_angle(pt0, pt1, pt2):
    """
    Computes the interior angle of a vertex given 3 points.
    NOTE: Assumes that *pt0* is the vertex you would like to find the interior angle of
    :param pt0:
    :param pt1:
    :param pt2:
    :return:
    """
    angle = math.atan2(pt1.y - pt0.y, pt1.x-pt0.x) - math.atan2(pt2.y - pt0.y, pt2.x - pt0.x)
    if angle < 0:
        angle += 2*math.pi
    elif angle > 2*math.pi:
        angle -= 2*math.pi
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
        for idx in range(len(pts)-1):
            if pts[idx] >= pts[idx+1]:
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
        if max_idx < idx < min_idx:
            heappush(lower, pt)
        elif max_idx > idx or idx > min_idx:
            heappush(upper, pt)
        else:
            heappush(lower, pt)
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

# whereas I could implement merge to merge the two queues, I'm kinda lazy
def x_monotone_triangulation(pts : list):
    stack = [pts.pop(), pts.pop()]
    u = stack[0]
    diagonals = []
    while len(pts) > 0:
        vi = pts.pop()
        vi_last = stack[-1]
        # case 1: vi and vi-1 on opposite chains:
        if vi.chain != vi_last.chain:
            for idx in range(len(stack)-1, -1, -1):
                if stack[idx] != u:
                    diagonals.append(LineSegment(stack[idx], vi))
            u = vi_last
        # case 2: vi on same chain as vi-1
        else:
            # i.e. vi-1 is a non-reflex vertex
            if not check_vertex_reflexive(vi.pt, vi_last.pt, stack[-2].pt):
                # add diagonals until no more vertices can be seen from vi
                if vi.chain == "lower":
                    visible = True
                    can_continue = True
                    while visible and can_continue:
                        q = stack[-1]
                        r = stack[-2]
                        #Todo fix
                        q_visible = orient_test(vi.pt, q.pt, r.pt) < 0
                        if q_visible:
                            diagonals.append(LineSegment(vi.pt, q.pt))
                            can_continue = orient_test(vi.pt, r.pt, q.pt) > 0
                            stack.pop()
                else:
                    visible = True
                    can_continue = True
                    while visible and can_continue:
                        q = stack[-1]
                        r = stack[-2]
                        #Todo fix
                        q_visible = orient_test(vi.pt, q.pt, r.pt) > 0
                        if q_visible:
                            diagonals.append(LineSegment(vi.pt, q.pt))
                            can_continue = orient_test(vi.pt, r.pt, q.pt) < 0
                            stack.pop()
            # vi-1 is a reflex vertex, so just add vi to the stack
            else:
                stack.append(vi)
    return diagonals


pts = (read_input_to_pts_list("inputs/simple_all_positive.txt"))
X = [pt.x for pt in pts + [pts[0]]]
Y = [pt.y for pt in pts + [pts[0]]]
plt.plot(X, Y)
plt.show()
upper, lower = split_to_chains(pts)

upper_X = [pt.x for pt in upper]
upper_Y = [pt.y for pt in upper]
plt.plot(upper_X, upper_Y)
plt.show()


lower_X = [pt.x for pt in lower]
lower_Y = [pt.y for pt in lower]
plt.plot(lower_X, lower_Y)
plt.show()

# all_pts = split_to_chains(pts, True)
# print(check_monotonicity(pts))
# print(check_monotonicity([pt.pt for pt in all_pts]))
# all_pts = (list(reversed(all_pts)))
# diags = x_monotone_triangulation(all_pts)
# print(diags)
# #print(check_monotonicity(upper) and check_monotonicity(lower))
#
