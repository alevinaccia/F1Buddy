import React, { useContext } from 'react'
import { State, SocketContext } from '../socketContext'

const LapTimes = ({ carNumber }) => {

  const state : State | undefined = useContext(SocketContext)

  let lastLap = state?.timingDataF1[carNumber].LastLapTime
  let bestLap = state?.timingStats[carNumber].PersonalBestLapTime
  
  let bestLapColor = ''
  if(bestLap && bestLap.Position == 1) bestLapColor = '#A855F7'

  return (
    <div className='flex-col w-36 pl-4'>
        <div className={ lastLap?.PersonalFastest  ? 'text-green-500 text-lg' : 'text-lg'}>{ lastLap?.Value }</div>
        <div className='text-sm' style={{ color : bestLapColor}}>{ bestLap && bestLap.Value }</div>
    </div>
  )
}

export default LapTimes