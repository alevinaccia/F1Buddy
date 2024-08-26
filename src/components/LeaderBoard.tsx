import React, { useContext } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import DriverRow from './DriverRow';
import { State, SocketContext } from '../socketContext';


const LeaderBoard = () => {

  const state: State | undefined = useContext(SocketContext);
  const [parent, enableAnimations] = useAutoAnimate()

  let statusStyle = ''

  if (state?.trackStatus?.Message) {
    if (state.trackStatus.Message == "Red") {
      statusStyle = 'border-red-600'
    }
    if (state.trackStatus.Message == "AllClear") {
      statusStyle = 'border-green-600'
    }
    if (state.trackStatus.Message == "Yellow") {
      statusStyle = 'border-yellow-300'
    }
  }

  const gapToNumber = (gap : string) : number  => {
    const [sec, millisec] = gap.substring(1).split('.')
    const secMillis = parseInt(sec) * 1000
    return (secMillis + parseInt(millisec))
  }

  return (
    <div className={`border-4 ${statusStyle}`} >
      <h2 className="text-xl text-white mb-4 p-2">Leaderboard : {state?.sessionInfo?.Name}</h2>
      <ul ref={parent}>
        {state?.carsData && state.timingDataF1 && Object.keys(state.timingDataF1).sort((a, b) => {
          //AAAAASH
          return gapToNumber(state.timingDataF1[b].GapToLeader) - gapToNumber(state.timingDataF1[a].GapToLeader)
        }).map((carNumber, index) => {
          return <DriverRow
            carTelemetry={state.carsData?.Entries[0].Cars[carNumber].Channels}
            driverInfo={state.driversList?.[carNumber]}
            index={index}
            key={carNumber} />
        })}
      </ul>
    </div>
  )
}

export default LeaderBoard