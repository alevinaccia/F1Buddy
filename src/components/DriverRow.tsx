import React from 'react'
import Gaps from './Gaps'
import LapTimes from './LapTimes'
import SectorsContainer from './SectorsContainer'
import Tyres from './Tyres'
import Drs from './Drs'
import Telemetry from './Telemetry'
import { createContext, useContext } from "react";

//timingDataf1 provides info about the last lap, timingStats provides info about the best lap of each driver,
//the idea is to give the user option to choose which data to see, also timingStats is a must in the qualy 


const DriverContext = createContext<number>(-1);

const DriverRow = ({ carTelemetry, driverInfo, position, hasStopped }) => {

    let rowStyle = "p-2 flex items-center space-x-2 border-b-2 max-h-20";

    if (hasStopped) {
        rowStyle += " opacity-50"
    }

    return (
        <>
            <div className={rowStyle}>
                <div style={{ color: 'white', backgroundColor: `#${driverInfo.TeamColour}` }} className='w-28 h-10 mx-auto flex items-center pl-2 rounded-r-lg justify-between font-bold' >
                    <span className='text-white mr-3 w-30' style={{ display: 'inline-block' }}>{position + 1}</span>
                    <span className='bg-white p-1 mr-3 rounded-r-lg min-w-14 text-center' style={{ color: `#${driverInfo.TeamColour}` }} >{driverInfo.Tla}</span>
                </div>
                <DriverContext.Provider value={Number(driverInfo.RacingNumber)}>
                    <Tyres />
                    <Gaps />
                    <LapTimes />
                    <Telemetry />
                    <SectorsContainer />
                    <Drs status={carTelemetry[45]} />
                </DriverContext.Provider>
            </div>
        </>

    )
}



export function useDriver() {
    const context = useContext(DriverContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}

export default DriverRow
