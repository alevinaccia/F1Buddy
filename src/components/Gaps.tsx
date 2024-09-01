import React, { useContext } from 'react'
import { SocketContext } from '../socketContext'
import { State } from '../../types/type'
import { DriverContext } from '../driverContext'

const Gaps = () => {

  const state : State | undefined = useContext(SocketContext)?.state
  let carNumber: number = useContext(DriverContext)

  let gapAhead = state?.timingDataF1[carNumber].IntervalToPositionAhead
  let gapToLeader = state?.timingDataF1[carNumber].GapToLeader

  let lapTimeDiffToLeader = ''

  const parseTime = (time: String) => {

    const [min, seconds] = time.split(':');
    const [sec, millis] = seconds.split('.');
    return parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(millis)
  }

  const calculateTimeDiff = (time1: string, time2: string) => {
    const diffMs = parseTime(time1) - parseTime(time2);
    const diffSec = diffMs/1000

    const sign = diffSec <= 0 ? "+" : "-";
    const formattedDiff = Math.abs(diffSec).toFixed(3);

    return `${sign}${formattedDiff}`;
  }

  if (state?.sessionInfo?.Type != "Race") {
    const leadTime = state?.topThree[0].LapTime

    if(leadTime && state?.timingStats[carNumber].PersonalBestLapTime.Value)
      lapTimeDiffToLeader = calculateTimeDiff(leadTime, state?.timingStats[carNumber].PersonalBestLapTime.Value);
  }

  return (
    <div className='flex-col w-20 text-white'>
      {state?.sessionInfo?.Type == "Race" ? (
        <>
          <div>{gapAhead?.Value.includes("LAP") ? null : gapAhead?.Value}</div>
          <div>{gapToLeader?.includes("LAP") || gapToLeader == ""  ? 'Leader' : gapToLeader}</div>
        </>
      ) : <div>{lapTimeDiffToLeader == '+0.000' ? "Leader" : lapTimeDiffToLeader}</div>}
    </div>
  )
}

export default Gaps