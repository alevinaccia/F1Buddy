import React, { useState, useEffect } from 'react'
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

const DevMenu = ({ controller }) => {

    const [cursorValue, setCursorValue] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    controller.setCursorBind(setCursorValue);

    const changeCursorValue = (e: [number, number]) => {
        controller.setCursor(e[1]);
    }

    const changePause = () => {
        controller.togglePause();
        setIsPlaying(!isPlaying);
    }

    useEffect(() => {
        console.log(cursorValue)
    }, [cursorValue])

    return (
        <div>
            <div className="flex flex-row text-white">
                <span className="mr-3">Select Race</span>
                <select className="text-black" onChange={(e) => controller.loadFile(e.target.value)}>
                    {controller.getFileList().map((file, i) => {
                        return <option key={i} >{file}</option>
                    })}
                </select>
            </div>
            <RangeSlider thumbsDisabled={[true, false]} value={[0, cursorValue]} rangeSlideDisabled={true} onInput={changeCursorValue} />

            <button className="bg-blue-500 text-white px-4 py-2 mt-4" onClick={changePause}>
                {isPlaying ? "Play" : "Pause"}
            </button>
        </div>
    )
}

export default DevMenu
