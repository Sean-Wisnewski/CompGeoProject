import matplotlib.pyplot as plt

def show_polygon(pts, end_connection=True):
    xs = [pt.x for pt in pts]
    ys = [pt.y for pt in pts]
    fig, ax = plt.subplots()
    ax.plot(xs, ys, '.', color='b')
    for idx, pt in enumerate(pts):
        if idx < len(pts)-1:
            pt2 = pts[idx+1]
            ax.plot([pt.x, pt2.x], [pt.y, pt2.y], color='r')
    if end_connection:
        plt.plot([pts[0].x, pts[-1].x], [pts[0].y, pts[-1].y], color='r')
    return fig, ax


def show_polygon_with_diagonals(pts, diags):
    """
    diags = [(pt0, pt1), ...()]
    :param pts:
    :param diags:
    :return:
    """
    fig, ax = show_polygon(pts)
    for diag in diags:
        ax.plot([diag[0].x, diag[1].x], [diag[0].y, diag[1].y], color='green')
    return fig, ax
