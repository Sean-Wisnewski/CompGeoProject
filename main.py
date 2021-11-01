from matplotlib import pyplot as plt

from helpers import read_input_to_pts_list, split_to_chains, check_monotonicity, x_monotone_triangulation
from visualizations import show_polygon, show_polygon_with_diagonals

if __name__ == '__main__':
    pts = (read_input_to_pts_list("inputs/simple_all_positive.txt"))
    print(pts)

    show_polygon(pts)

    upper, lower = split_to_chains(pts)

    show_polygon(upper, False)

    show_polygon(lower, False)

    all_pts = split_to_chains(pts, True)

    show_polygon([pt.pt for pt in all_pts], False)

    # all_pts = (list(reversed(all_pts)))
    print(all_pts)

    # print(check_monotonicity(pts))
    diags = x_monotone_triangulation(all_pts)
    print(diags)

    show_polygon_with_diagonals(pts, diags)
    # #print(check_monotonicity(upper) and check_monotonicity(lower))
    #
