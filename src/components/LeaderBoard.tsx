import React, { useContext, useEffect } from 'react'

import DriverRow from './DriverRow';
import { GlobalData, SocketContext } from '../socketContext';


const LeaderBoard = () => {

  let driverTimingData;
  const globalData: GlobalData | undefined = useContext(SocketContext);

  return (
    <div className='m-5'>
        {globalData?.carsData && Object.keys(globalData.carsData.Entries[0].Cars).sort((a, b) => {
          // :Z
          if (globalData.stints) {
            if (globalData.stints[a].Line < globalData.stints[b].Line) {
              return -1
            }
          }
          return 1
        }).map(carNumber => {
          return <DriverRow
            carTelemetry={globalData.carsData?.Entries[0].Cars[carNumber].Channels}
            driverInfo={globalData.driversList?.[carNumber]}
            stints={globalData.stints?.[carNumber]}
            key={carNumber} />
        })}
    </div>
  )
}

export default LeaderBoard