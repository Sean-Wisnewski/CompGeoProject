import React from "react";

export default class CodeBlock extends React.Component{
    constructor(props) {
        super(props);
        this.run = (variables, runPointer) =>{
            return this.props.run(variables, runPointer);
        }
        this.pseudocode = props.pseudocode
        this.state = {
            marked: props.marked
        };
    }

    render() {
        if (this.state.marked){ // Tagged
            return (<p><mark>{this.pseudocode}</mark></p>);
        }
        return (<p>{this.pseudocode}</p>);
    }
}