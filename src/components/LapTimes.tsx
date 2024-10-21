import React, { useContext, useEffect, useState } from 'react'
import { useSocket } from '../SocketContext.tsx'
import { useDriver } from './DriverRow';
import { State } from '../../types/type'

const LapTimes = () => {

  const state: State | undefined = useSocket();
  let carNumber: number = useDriver();

  let lastLap = state?.timingDataF1[carNumber].LastLapTime;
  let bestLap = state?.timingStats[carNumber].PersonalBestLapTime;

  let bestLapColor = '';
  if (bestLap && bestLap.Position == 1) bestLapColor = '#A855F7';
  // if (bestLap?.Value == lastLap?.Value) bestLapColor = '#22C55E';

  const [isGlowing, setIsGlowing] = useState(false);


  return (
    <div className='flex-col w-36 pl-4 text-white'>
      {state?.sessionInfo?.Type == "Race" ?
        <>
          <div className={lastLap?.PersonalFastest ? 'text-green-500 text-lg' : 'text-lg'}>{lastLap?.Value}</div>
          <div className='text-sm' style={{ color: bestLapColor }}>{bestLap && bestLap.Value}</div>

        </> :
        <>
          <div className='text-lg' style={{ color: bestLapColor }}>{bestLap && bestLap.Value}</div>
          <div className={`${lastLap?.PersonalFastest ? 'text-green-500 text-sm' : 'text-sm'}`}>{lastLap?.Value}</div>
        </>
      }

    </div>
  )
}

export default LapTimes
