import React from 'react'
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

const DevMenu = ({ onFileChange, fileList, setCursor, togglePause }) => {

    const changeCursorValue = (e) => {
        setCursor(e[1]);
    }

    const changePause = () => {
        togglePause();
    }

    return (
        <div>
            <div className="flex flex-row text-white">
                <span className="mr-3">Select Race</span>
                <select className="text-black" onChange={(e) => onFileChange(e.target.value)}>
                    {fileList.map((file, i) => {
                        return <option key={i} >{file}</option>
                    })}
                </select>
            </div>
            <RangeSlider thumbsDisabled={[true, false]} defaultValue={[0, 0]} rangeSlideDisabled={true} onInput={changeCursorValue} />

            <button className="bg-blue-500 text-white px-4 py-2 mt-4" onClick={changePause}>
                Play
            </button>
        </div>
    )
}

export default DevMenu
