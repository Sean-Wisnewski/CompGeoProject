import React, {Component} from 'react'

function Description(props) {
  return (
      <div>
        <div id="description" class="scrollable">
          <hr/>
          <h2>Team Members</h2>
          <p>Eric Sotack, William Savage and Sean Wisnewski</p>
          <h2>Description of Problem</h2>
          <p>Our website seeks to solve the problem of creating a pedagogical aid for demonstrating the triangulation of x-monotone polygons. <br />
          Our visualization, combined with our pseudo-debugger(shown above) aims to help programmers learning this algorithm to <br />
          be better able to understand how monotone polygon trianglation works.
          </p>
          <h2>Background Information</h2>
          <p>Monotone polygon trianglation refers to the process of splitting a specific type of polygon into triangles, through insertion of diagonals <br/>
          Our website focuses on triangulating specifically x-monotone polygons. Monotone polygons can be split into two "chains" of vertices, an upper and a lower chain. <br/>
          A chain is considered to be monotone if any line orthogonal to the chain instersects the chain at most once. A polygon can be considered monotone with respect to a line<br/>
          if it can be broken into an upper and a lower chain, and each chain is monotone to that line. The quick trick for visually determing if a polygon is monotone would be to<br/>
          check if a line instersects the polygon more than twice. If this is true, then the polygon is not monotone.<br/>
          <br/>
          As mentioned before, our website focuses on triangulation of x-monotone polygons. So, the polygons entered by users must have a sweep line of the form x = n only intersect the polygon at most twice.<br/>
          Our website doesn't stricly enforce this, but does warn users when the polygon they have entered to the canvas is not x-monotone. This is done by turning the canvas red when a non-x-monotone polygon is entered.<br/>
          Our approach will break if non-x-monotone polygons are entered. In addition, the polygon must not cross itself. In other words, the polygons must be simple. If it is not simple, the algorithm will still run, but <br/>
          the visualization will be incorrect. When an x-monotone polygon has been entered, users can interact with our tool using the pseudo-debugger on the right of the screen. This allows for interation with the visualization<br/>
          using a debugger-like interface, something developers should be relatively familar with. Further instructions for use are listed below. This pseudocode closely represents the actual algorithm for x-monotone polygon trianglation.<br/>
          This algorithm was essentially an implementation of the algorithm described in <a href="https://www.cs.umd.edu/~mount/754/Lects/754lects.pdf">David Mount's Lecture Notes</a>. Our visualization highlights the full running algorithm.<br/>
          We show the polygon itself, and draw the diagonals on the polygon as they are added. In combination with our pseudo-debugger, we effectively visualize the entire algoirthm!
          </p>
          <h2>Webpage Description</h2>
            <h3>Website Functionality</h3>
            <p>This webpage is a pedagogical aid for the monotone subdivision algorithm. To the left, an interactive canvas is displayed. <br/>
              Above, the pseudocode for monotone subdivision is displayed. When the subdivision algorithim is run, the relevant line <br/>
              of the pseudocode will be highlighted in yellow, indicating that the algorithm is currently executing that step. Instructions <br/>
              for interaction with the canvas and using the pseudocode are shown below.</p>
              <ol>
                <li>Click on the canvas to enter a point.</li>
                <li>Click on the canavas to enter the next point. Points can be entered in any order, and will be assigned to the closest line.</li>
                <li>Once at least 3 points have been entered to define a polytgon, click the "run" button
                to start the algorithm.</li>
                <li>If desired, users can enter "stepping mode" by clicking the stepping mode box. This enters you into a step mode, allowing for stepping through each statement at your own pace.<br/>To exit this mode, simply click continue.</li>
                <li>Once the algorithm is complete, click on the "clear" button to clear the screen and start over!</li>
              </ol>
            <h2>Link to presentation video</h2>
              <a href="https://drive.google.com/file/d/1c0yOmDqqsK8Hx5jEih9g5iNzMZjJtayE/view">Video Presentation</a>
        </div>
      </div>
  )
}

export default Description;
