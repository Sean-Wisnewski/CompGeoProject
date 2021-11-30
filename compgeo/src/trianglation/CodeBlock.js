import React from "react";

export default class CodeBlock extends React.Component{
    constructor(props) {
        super(props);
        this.run = (getVar, setVar) =>{
            return this.props.run(getVar, setVar);
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