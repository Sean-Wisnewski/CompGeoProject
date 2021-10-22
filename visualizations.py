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
    plt.show()
