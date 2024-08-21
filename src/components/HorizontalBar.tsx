import React from 'react'

const HorizontalBar = ({ color, fillPercentage }) => {
    return (
        <div className="h-2 w-14 overflow-hidden rounded-md bg-gray-300">
            <div className={`h-full ${color}`} style={{ width: `${fillPercentage}%`, transition: "all 0.2s linear" }}></div>
        </div>
    )
}

export default HorizontalBar