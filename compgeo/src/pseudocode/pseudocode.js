function Markable({ tag, children ,tags}){
    if (tags.get(tag)){
        return (<p><mark>{children}</mark></p>);
    }
    return (<p>{children}</p>);
}

function Pseudocode({run, step, clear, tags, delay, setDelay, stepping, setStepping}){
    const handleChange = (event)=> {
        console.log(event)
        setDelay(Math.abs(parseInt(event.target.value)));
    }
    const handleCheck = (event)=> {
        console.log(event)
        setStepping(event.target.checked);
    }

    return (
        <div>
            <div>
                <button onClick={run}>Run</button>
                {/*<button onClick={step}>Step</button>*/}
                <button onClick={clear}>Clear</button>
                <input type="text" pattern="[0-9]*"
                       id="delay" name="delay"
                       onInput={handleChange} value={delay} />
                {/*<label > Stepping mode </label>*/}
            {/*    <input type="checkbox"*/}
            {/*           id="stepping" name="stepping" onInput={handleCheck} value={stepping}/>*/}
            </div>
            <div>
                <Markable tags={tags} tag="start-stack">Initialize a stack</Markable>
                <Markable tags={tags} tag="stack-push-0">Add index 0 to the top of the stack</Markable>
                <Markable tags={tags} tag="stack-push-1">Add index 1 to the top of the stack</Markable>
                <Markable tags={tags} tag="start-diagonals">Initialize an empty list of diagonals</Markable>
                <Markable tags={tags} tag="for-loop-polygon">For each point J in the polygon starting with the third point stopping after the second to last point</Markable>
                <Markable tags={tags} tag="same-chain-if">&emsp;&emsp;If the point at the top of the stack is on the same chain as J</Markable>
                <Markable tags={tags} tag="same-chain-if-while-more-than-2">&emsp;&emsp;&emsp;&emsp;While there are at least 2 points on the stack</Markable>
                <Markable tags={tags} tag="same-chain-if-while-more-than-2-add-diag">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Pop a point U off the top of the stack and add a diagonal from U to J</Markable>
                <Markable tags={tags} tag="same-chain-if-clear-stack">&emsp;&emsp;&emsp;&emsp;Clear the stack</Markable>
                <Markable tags={tags} tag="same-chain-if-push-point-before-j">&emsp;&emsp;&emsp;&emsp;Push the point before J onto the stack</Markable>
                <Markable tags={tags} tag="same-chain-if-push-point-j">&emsp;&emsp;&emsp;&emsp;Push J onto the stack</Markable>
            </div>
        </div>);
}
export default Pseudocode;