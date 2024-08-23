import React, { useContext, useEffect } from 'react'

import DriverRow from './DriverRow';
import { State, SocketContext } from '../socketContext';


const LeaderBoard = () => {

  const state: State | undefined = useContext(SocketContext);

  return (
    <div className='border-4 ' >
      <h2 className="text-xl text-white mb-4 p-2">Leaderboard : {state?.sessionInfo?.Name}</h2>
        {state?.carsData && state.stints && Object.keys(state.carsData.Entries[0].Cars).sort((a, b) => {  
            return state.stints[a].Line - state.stints[b].Line
        }).map((carNumber, index) => {
          return <DriverRow
            carTelemetry={state.carsData?.Entries[0].Cars[carNumber].Channels}
            driverInfo={state.driversList?.[carNumber]}
            index={index}
            key={carNumber} />
        })}
    </div>
  )
}

export default LeaderBoard