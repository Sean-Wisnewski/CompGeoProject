import numpy as np
import math

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

def compute_interior_angle(pt0, pt1, pt2):
    """
    Computes the interior angle of a vertex given 3 points.
    NOTE: Assumes that *pt0* is the vertex you would like to find the interior angle of
    :param pt0:
    :param pt1:
    :param pt2:
    :return:
    """
    return math.atan2(pt1.y - pt0.y, pt1.x-pt0.x) - math.atan2(pt2.y - pt0.y, pt2.x - pt0.x)

print(math.degrees(compute_interior_angle(Point(0,0), Point(0, 1), Point(1,0))))

