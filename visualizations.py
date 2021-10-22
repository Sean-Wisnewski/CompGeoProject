from typing import List

import matplotlib.pyplot as plt

import SupportClasses
from SupportClasses import LineSegment

def show_polygon(pts, end_connection=True, show=True):
    xs = [pt.pt.x if isinstance(pt, SupportClasses.StackElement) else pt.x for pt in pts]
    ys = [pt.pt.y if isinstance(pt, SupportClasses.StackElement) else pt.y for pt in pts]
    fig, ax = plt.subplots()
    ax.plot(xs, ys, '.', color='b')
    for idx, pt in enumerate(pts):
        pt = pt.pt if isinstance(pt, SupportClasses.StackElement) else pt
        if idx < len(pts)-1:
            pt2 = pts[idx+1].pt if isinstance(pts[idx+1], SupportClasses.StackElement) else pts[idx+1]
            ax.plot([pt.x, pt2.x], [pt.y, pt2.y], color='r')
    if end_connection and pts:
        start = pts[0].pt if isinstance(pts[0], SupportClasses.StackElement) else pts[0]
        end = pts[-1].pt if isinstance(pts[-1], SupportClasses.StackElement) else pts[-1]
        plt.plot([start.x, end.x], [start.y, end.y], color='r')
    if show:
        plt.show()
    return fig, ax


def show_polygon_with_diagonals(pts, diags:List[LineSegment], show=True):
    """
    diags = [(pt0, pt1), ...()]
    :param pts:
    :param diags:
    :return:
    """
    fig, ax = show_polygon(pts, show=False)
    for diag in diags:
        ax.plot([diag.pt0.x, diag.pt1.x], [diag.pt0.y, diag.pt1.y], color='green')
    if show:
        plt.show()
    return fig, ax
