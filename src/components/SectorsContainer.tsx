import React, { useContext, useEffect, useState } from 'react'
import Sector from './Sector'
import { State, SocketContext, TimingDataF1, TimingInfo } from '../socketContext'
import { DriverContext } from '../driverContext'

const SectorsContainer = () => {

  let globalData: State | undefined = useContext(SocketContext)
  let [timingData, setTimingData] = useState<TimingInfo>()
  let carNumber : number = useContext(DriverContext)


  useEffect(() => {
    if (globalData?.timingDataF1) {
      setTimingData(globalData?.timingDataF1[carNumber])
    }
  }, [globalData])

  let icon;

  return (
    <div className='flex flex-row w-72'>
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