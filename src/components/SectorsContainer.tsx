import React, { useContext, useEffect, useState } from 'react'
import Sector from './Sector'
import { GlobalData, SocketContext, TimingDataF1, TimingInfo } from '../socketContext'

const SectorsContainer = ({ carNumber }) => {

  let globalData: GlobalData | undefined = useContext(SocketContext)
  let [timingData, setTimingData] = useState<TimingInfo>()


  useEffect(() => {
    if (globalData?.timingDataF1) {
      setTimingData(globalData?.timingDataF1[carNumber])
    }
  }, [globalData?.timingDataF1[carNumber]])

  useEffect(() => {

  }, [timingData])

  let icon;

  return (
    <div className='flex flex-row w-60'>
      {timingData && timingData.Sectors && timingData.Sectors.length >= 3 &&
        <>
          <Sector data={timingData?.Sectors[0]} />
          <Sector data={timingData?.Sectors[1]} />
          <Sector data={timingData?.Sectors[2]} />
        </>
      }
    </div>

  )
}

export default SectorsContainer