from functools import total_ordering


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
