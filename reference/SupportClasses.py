from functools import total_ordering
from enum import Enum


@total_ordering
class Point:
    """
    Class to represent a 2d point in space
    """

    def __init__(self, x, y, num):
        self.x = x
        self.y = y
        self.num = num

    def __repr__(self):
        return f"({self.x}, {self.y})"

    def __eq__(self, pt2):
        return self.x == pt2.x and self.y == pt2.y

    def __lt__(self, pt2):
        return self.x <= pt2.x

    def __hash__(self):
        # return a unique hash for each pt b/c no two points will have the same number
        return hash(f"{self.num}: ({self.x}, {self.y})")

class StackElement:
    def __init__(self, pt, chain):
        self.pt = pt
        self.chain = chain

    def __repr__(self):
        return f"[({self.pt}), {self.chain}]"

    def __eq__(self, other):
        return self.pt == other.pt


class LineSegment:
    """
    Since line segments are undirected, always put the point further to the right as the right endpoint
    """
    def __init__(self, pt0, pt1, name):
        if pt0.x < pt1.x:
            self.pt0 = pt0
            self.pt1 = pt1
        else:
            self.pt0 = pt1
            self.pt1 = pt0
        self.name=name

    def __repr__(self):
        return f"[{self.name}: ({self.pt0}), ({self.pt1})]"

    def __eq__(self, e2):
        return self.pt0 == e2.pt0 and self.pt1 == e2.pt1 and self.name == e2.name

class Event:
    def __init__(self, pt, seg, endpt_type, chain):
        self.pt = pt
        self.seg = seg
        self.endpt_type = endpt_type
        self.chain = chain

    def __repr__(self):
        return str(self.pt) + " " + self.seg.name + " " + str(self.endpt_type)

class EndptType(Enum):
    LEFT = 1,
    RIGHT = 2

class SubdivEvent(Enum):
    SPLIT=1,
    MERGE=2,
    START=3,
    END=4,
    UPPER=5,
    LOWER=6
    UNIMPL=7