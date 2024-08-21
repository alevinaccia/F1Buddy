import React, { useContext } from 'react'
import { GlobalData, SocketContext } from '../socketContext'

const LapTimes = ({ carNumber }) => {

  const globalData : GlobalData | undefined = useContext(SocketContext)

  let lastLap = globalData?.timingDataF1[carNumber].LastLapTime.Value || '---'
  let bestLap = globalData?.timingStats[carNumber].PersonalBestLapTime
  
  let bestLapColor = ''
  if(bestLap && bestLap.Position == 1) bestLapColor = '#A855F7'

  return (
    <div className='flex-col w-36'>
        <div>Last { lastLap }</div>
        <div>Best <span style={{ color : bestLapColor}}>{ bestLap && bestLap.Value }</span></div>
    </div>
  )
}

export default LapTimes