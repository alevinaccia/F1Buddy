import React, { useContext } from 'react'
import { GlobalData, SocketContext } from '../socketContext'

const Gaps = ({ carNumber }) => {

  const globalData : GlobalData | undefined = useContext(SocketContext)

  let gapAhead = globalData?.timingDataF1[carNumber].IntervalToPositionAhead
  let gapToLeader = globalData?.timingDataF1[carNumber].GapToLeader
  
  return (
    <div className='flex-col w-20'>
        <div>{ gapAhead && gapAhead.Value }</div>
        <div>{ gapToLeader == '' ? 'Leader' : gapToLeader }</div>
    </div>
  )
}

export default Gaps