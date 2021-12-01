import {useState} from "react";
import {getBlocks, split_to_chains} from "../trianglation/monotoneTriangulation";
import {DELAY_DEFAULT} from "../CONSTANTS";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function Pseudocode({variables, updateVisualVariables, setAddPoints, addPoints, clear}){
    let [runPointer, setRunPointer] = useState(-1);
    let rp = runPointer;

    const [delay, setDelay] = useState(DELAY_DEFAULT);
    async function pause(){
        await sleep(delay);
    }

    const handleDelayChange = (event)=> {
        setDelay(Math.abs(parseInt(event.target.value)));
    }

    const handleCheck = (event)=> {
        variables.stepping = (!event.target.checked);
        updateVisualVariables()
    }

    const blocks = getBlocks();

    const setRP = (value) => {
        rp = value;
        setRunPointer(rp);
    }

    function start() {
        if (variables.coordinates.length >= 4){
            variables.pts = split_to_chains(variables.coordinates);
            setAddPoints(false);
            setRP(0);
            updateVisualVariables();
            process();
        }
    }
    async function process(){
        if (rp >= 0 && rp < blocks.length) {
            console.log("rp:", rp);
            let nrp = blocks[rp].run(variables, rp);
            if (blocks[rp].pseudocode != null){
                await pause()
            }
            setRP(nrp);
            updateVisualVariables();
            if (rp >= 0  && (blocks[rp].pseudocode == null || (!variables.stepping))){
                await process();
            }
        } else if (!addPoints) {
            setAddPoints(true);
        }
        console.log("Finished");
    }

    return (
        <div>
            <div>
                <button onClick={start}>Run</button>
                <button onClick={process}>Step</button>
                <button onClick={clear}>Clear</button>
                <button onClick={()=>{
                    variables.stepping = false;
                    updateVisualVariables();
                    console.log(variables)
                    process()}
                }>Continue</button>
                <input type="text" pattern="[0-9]*"
                       id="delay" name="delay"
                       onInput={handleDelayChange} value={delay} />
                <label > Stepping mode </label>
                <input type="checkbox"
                       id="stepping" name="stepping" onInput={handleCheck}  checked={variables.stepping}/>
            </div>
            <div>
                {blocks.map((block, index) => {
                    if (index === runPointer){
                        return block.renderMarked()
                    }else{
                        return block.render()
                    }
                })}
            </div>
        </div>);
}
export default Pseudocode;