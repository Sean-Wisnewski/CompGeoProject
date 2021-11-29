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

                <Markable tags={tags} tag="same-chain-else">&emsp;&emsp;Otherwise</Markable>
                <Markable tags={tags} tag="same-chain-else-pop">&emsp;&emsp;&emsp;&emsp;Pop a point U off the top of the stack</Markable>
                <Markable tags={tags} tag="same-chain-else-while">&emsp;&emsp;&emsp;&emsp;While the stack is not empty and U is visible from J</Markable>
                <Markable tags={tags} tag="same-chain-else-while-add">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Add a diagonal from U to J</Markable>
                <Markable tags={tags} tag="same-chain-else-while-if-not-empty">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;If the stack is not empty</Markable>
                <Markable tags={tags} tag="same-chain-else-while-if-not-empty-popped">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Set U to a point popped off the top of the stack</Markable>
                <Markable tags={tags} tag="same-chain-else-push-ul">&emsp;&emsp;&emsp;&emsp;Push UL onto the stack</Markable>
                <Markable tags={tags} tag="same-chain-else-push-j">&emsp;&emsp;&emsp;&emsp;Push J onto the stack</Markable>

                <Markable tags={tags} tag="pop-from-stack">Pop the top off the stack and ignore it</Markable>
                <Markable tags={tags} tag="last-while-if-not-empty">While the stack has more than one point on it</Markable>
                <Markable tags={tags} tag="last-while-if-not-empty-popped">&emsp;&emsp;Set U to a point popped off the top of the stack</Markable>
                <Markable tags={tags} tag="last-while-if-not-empty-add-diag">&emsp;&emsp;Add a diagonal from U to the last point in the list of points</Markable>

            </div>
        </div>);
}
export default Pseudocode;