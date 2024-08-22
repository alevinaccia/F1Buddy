import React, { useContext, useEffect, useState } from 'react'
import { State, SocketContext } from '../socketContext'

const Time = (  ) => {

    const state : State | undefined = useContext(SocketContext)
    const [ time, setTime ] = useState('')

    useEffect(() => {
      if(state?.hearthbeat){
        setTime(new Date(state.hearthbeat).toLocaleString())
      }
    }, [state?.hearthbeat])

  return (
    <div className='text-xl'>Current time is {time}</div>
  )
}

export default Time