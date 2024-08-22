import React, { useContext } from 'react'
import { SocketContext, State } from '../socketContext'


const Header = () => {

    const state: State | undefined = useContext(SocketContext)
    return <>
        <div className='flex flex-row items-center  justify-between'>
            {state?.sessionInfo && <>
                <div className='flex flex-row items-center p-5'>
                    <img src={`/flags/${state.sessionInfo.Meeting.Country.Code}.svg`} className='size-16' />
                    <div className='ml-2 font-bold text-white w-80'>{state.sessionInfo.Meeting.OfficialName}</div>
                </div>
            </>}
            {state?.lapCount && <>
                <div className='text-4xl text-white font-bold mr-20'>{state?.lapCount.CurrentLap}/{state?.lapCount.TotalLaps}</div>
            </>}
        </div>
    </>
}

export default Header