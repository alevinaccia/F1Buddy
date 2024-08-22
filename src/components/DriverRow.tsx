import React from 'react'
import Gaps from './Gaps'
import LapTimes from './LapTimes'
import SectorsContainer from './SectorsContainer'
import Tyres from './Tyres'
import HorizontalBar from './HorizontalBar'
import Drs from './Drs'
import Telemetry from './Telemetry'

//timingDataf1 provides info about the last lap, timingStats provides info about the best lap of each driver,
//the idea is to give the user option to choose which data to see, also timingStats is a must in the qualy 


const DriverRow = ({ carTelemetry, driverInfo, index }) => {

    return (
        <>
            <div className="p-2 flex items-center space-x-2 border-b-2 max-h-20 ">
                <div style={{ color: 'white', backgroundColor: `#${driverInfo.TeamColour}` }} className='w-28 h-10 mx-auto flex items-center pl-2 rounded-r-lg justify-between font-bold' >
                    <span className='text-white mr-3 w-30' style={{display:'inline-block'}}>{index + 1}</span>
                    <span className='bg-white p-1 mr-3 rounded min-w-14 text-right' style={{ color: `#${driverInfo.TeamColour}`}} >{driverInfo.Tla}</span>
                </div>
                <Tyres carNumber={ driverInfo.RacingNumber } />
                <Gaps carNumber={ driverInfo.RacingNumber } />
                <LapTimes carNumber={ driverInfo.RacingNumber } />
                <Telemetry carNumber= { driverInfo.RacingNumber } />
                <SectorsContainer carNumber= { driverInfo.RacingNumber } />
                <Drs status={ carTelemetry[45]} />
            </div>
        </>

    )
}

export default DriverRow