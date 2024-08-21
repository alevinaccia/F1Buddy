import React, { useContext, useEffect, useState } from 'react'
import { GlobalData, SocketContext } from '../socketContext'

const Time = (  ) => {

    const globalData : GlobalData | undefined = useContext(SocketContext)
    const [ time, setTime ] = useState('')

    useEffect(() => {
      if(globalData?.hearthbeat){
        setTime(new Date(globalData.hearthbeat).toLocaleString())
      }
    }, [globalData?.hearthbeat])


  return (
    <div className='text-xl'>Current time is {time}</div>
  )
}

export default Time