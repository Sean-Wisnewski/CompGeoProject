import React from "react";

export default class CodeBlock extends React.Component{
    constructor(run, pseudocode=null) {
        super({});
        this.run = (variables, runPointer) =>{
            return run(variables, runPointer);
        }
        this.pseudocode = pseudocode
        this.state = {
            marked: false
        };
    }

    markOn(){
        this.setState({marked:true})
    }
    markOff(){
        this.setState({marked:false})
    }

    render() {
        if (this.pseudocode != null) {
            if (this.state.marked) { // Tagged
                return (<p>
                    <mark>{this.pseudocode}</mark>
                </p>);
            }
            return (<p>{this.pseudocode}</p>);
        }
        return null;
    }
}