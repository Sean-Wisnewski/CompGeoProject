import React, {Component} from 'react'

function Description(props) {
  return (
    <div>
      <h1>Webpage Description</h1>
        <h2>Website Fucntionality</h2>
        <p>This webpage is a pedagogical aid for the monotone subdivision algorithm. To the left, an interactive
        canvas is displayed. Above, the pseudocode for monotone subdivision is displayed. When the subdivision
        algorithim is run, the relevant line of the pseudocode will be highlighted in yellow, indicating that the algorithm
        is currently executing that step. Instructions for interaction with the canvas and using the pseudocode are shown
        below.</p>
          <ol>
            <li>Click on the canvas to enter a point.</li>
            <li>Click on the canavas to enter the next point. Note that points must be
            entered in counterclockwise order, or the algorithm will break.</li>
            <li>Once at least 3 points have been entered to define a polytgon, click the "run" button
            to start the algorithm.</li>
            <li>Once the algorithm is complete, click on the "clear" button to clear the screen and start over!</li>
          </ol>
        <h2>Link to presentation video</h2>
          <a href="https://drive.google.com/file/d/1Zsu9x0TUaf-SXQBZ7VI3tsz0ekeLloNy/view?usp=sharing">Video Presentation</a>
    </div>
  )
}

export default Description;
