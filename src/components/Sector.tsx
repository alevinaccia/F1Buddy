import React from 'react'

const Sector = ({ data }) => {

    return (
        <div>
            <div className='flex'>
                {data.Segments.map((segment, index) => {
                    let segmentColor = ''
                    switch (segment.Status) {
                        case 2048:
                            segmentColor = 'bg-yellow-500'
                            break;

                        case 2051:
                            segmentColor = 'bg-purple-500'
                            break;

                        case 2049:
                            segmentColor = 'bg-green-500'
                            break;

                        default:
                            segmentColor = 'bg-gray-500'
                            break;
                    }
                    return <div className={`${segmentColor} rounded h-2 w-2.5`} key={index}></div>
                })}
            </div>
            <div className={`${data.PersonalFastest ? 'text-green-500' : 'text-yellow-500'} m-2 text-center`}>{data.Value != "" ? data.Value : data.PreviousValue}</div>
        </div>
    )
}

export default Sector