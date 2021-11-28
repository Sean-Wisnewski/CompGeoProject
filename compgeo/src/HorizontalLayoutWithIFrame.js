import React from "react";
import ReactDOM from "react-dom";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
class HorizontalLayoutWithIFrame extends React.Component {
    constructor(props) {
        super(props);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.state = {
            dragging: false
        };
    }

    onDragStart() {
        this.setState({ dragging: true });
    }

    onDragEnd() {
        this.setState({ dragging: false });
    }

    renderDetailLinks() {
        return (
            <div>
                Refer to the following pages for details:
                <ul>
                    <li>
                        <a href="https://github.com/zesik/react-splitter-layout/blob/master/example/javascripts/components/HorizontalLayoutWithIFrame.jsx">
                            Source code of this page
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/zesik/react-splitter-layout/issues/7">
                            Another way
                        </a>
                    </li>
                </ul>
            </div>
        );
    }

    render() {
        return (
            <SplitterLayout onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
                <div className="pane-1">
                    <h2>1st Pane</h2>
                </div>
                <div className="pane-2">
                    <h2>2nd Pane</h2>
                </div>
            </SplitterLayout>
        );
    }
}

export default HorizontalLayoutWithIFrame;