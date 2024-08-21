import React from 'react'

const Sector = ( { data } ) => {

    let color = 'bg-yellow-500'
    if(data.PersonalFastest) color = 'bg-green-500'

    return (
        <div className='m-2'>
            <div className="h-2 w-10 ml-1 overflow-hidden rounded-md bg-gray-300">
                        <div className={`h-full ${color} `} style={{ height: '100%'}}></div>
                    </div>
            <div>{data.Value != "" ? data.Value : data.PreviousValue}</div>
        </div>
    )
}

export default Sector