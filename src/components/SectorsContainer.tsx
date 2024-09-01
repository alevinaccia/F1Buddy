import React, { useContext, useEffect, useState } from 'react'
import Sector from './Sector'
import { SocketContext} from '../socketContext'
import { DriverContext } from '../driverContext'
import { State, TimingInfo } from '../../types/type'

const SectorsContainer = () => {

  let state : State | undefined = useContext(SocketContext)?.state
  let [timingData, setTimingData] = useState<TimingInfo>()
  let carNumber : number = useContext(DriverContext)


  useEffect(() => {
    if (state?.timingDataF1) {
      setTimingData(state?.timingDataF1[carNumber])
    }
  }, [state])

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