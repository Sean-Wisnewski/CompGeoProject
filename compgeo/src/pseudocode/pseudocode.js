import {useState} from "react";

function Markable({ mark, children ,tags}){
    if (tags.get(mark)){
        return (<p><mark>{children}</mark></p>);
    }
    return (<p>{children}</p>);
}
function Pseudocode({run, clear, tags, delay, setDelay}){
    const [marked, setMarked] = useState(false);
    const handleChange = (event)=> {
        // const financialGoal = (evt.target.validity.valid) ?
            // evt.target.value : this.state.financialGoal;
        console.log(event)
        setDelay(parseInt(event.target.value));
    }
    return <div>
        <Markable tags={tags} mark="split">let all_pts = split_to_chains(polygon);</Markable>
        <Markable  tags={tags} mark="diag">let diags = x_monotone_triangulation(all_pts);</Markable>
        <button onClick={run}>Run</button>
        <button onClick={clear}>Clear</button>
        <input type="text" pattern="[0-9]*"
               id="delay" name="delay"
               onInput={handleChange} value={delay} />
    </div>;
}
export default Pseudocode;