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


const DriverRow = ({ carTelemetry, driverInfo, stints }) => {

    return (
        <>
            <div className="mb-3 flex items-center space-x-4">
                <div style={{ color: `#${driverInfo.TeamColour}` }} className='w-20' >{driverInfo.Tla} {driverInfo.RacingNumber}</div>
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