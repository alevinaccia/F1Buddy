import React from 'react'

const Sector = ( { data } ) => {

    let color = 'text-yellow-500'
    if(data.PersonalFastest) color = 'text-green-500'

    return (
        <div className={`${color} m-2`}>{data.Value != "" ? data.Value : data.PreviousValue}</div>
    )
}

export default Sector