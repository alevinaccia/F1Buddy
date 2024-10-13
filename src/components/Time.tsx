import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from 'messageHandler'
import { State } from '../../types/type'

const Time = () => {

  const state: State | undefined = useContext(SocketContext)?.state;
  const [time, setTime] = useState('');

  useEffect(() => {
    if (state?.hearthbeat) {
      setTime(new Date(state.hearthbeat).toLocaleString());
    }
  }, [state?.hearthbeat])

  return (
    <div className='text-xl'>Current time is {time}</div>
  )
}

export default Time
