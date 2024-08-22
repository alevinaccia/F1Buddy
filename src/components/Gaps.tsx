import React, { useContext } from 'react'
import { State, SocketContext } from '../socketContext'

const Gaps = ({ carNumber }) => {

  const state : State | undefined = useContext(SocketContext)

  let gapAhead = state?.timingDataF1[carNumber].IntervalToPositionAhead
  let gapToLeader = state?.timingDataF1[carNumber].GapToLeader
  
  return (
    <div className='flex-col w-20'>
        <div>{ gapAhead?.Value.includes("LAP") ? null : gapAhead?.Value }</div>
        <div>{ gapToLeader?.includes("LAP") ? 'Leader' : gapToLeader }</div>
    </div>
  )
}

export default Gaps