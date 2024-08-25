import React, { useContext } from 'react'
import { SocketContext, State } from '../socketContext'


const Header = () => {

    const state: State | undefined = useContext(SocketContext)

    let statusStyle = ''

    if(state?.trackStatus?.Message){
        if(state.trackStatus.Message == "Red"){
            statusStyle = 'bg-red-600 px-8 py-3 rounded-2xl shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 '
        }
        if(state.trackStatus.Message == "AllClear"){
            statusStyle = 'bg-green-600 px-8 py-3 rounded-2xl'
        }
        if(state.trackStatus.Message == "Yellow"){
            statusStyle = 'bg-yellow-300 px-8 py-3  rounded-2xl '
        }
    }

    return <>
        <div className='flex flex-row items-center  justify-between'>
            {state?.sessionInfo && <>
                <div className='flex flex-row items-center p-5'>
                    <img src={`/flags/${state.sessionInfo.Meeting.Country.Code}.svg`} className='size-16' />
                    <div className='ml-2 font-bold text-white w-80'>{state.sessionInfo.Meeting.OfficialName}</div>
                </div>
            </>}
            <div className='flex items-center '>
            {state?.trackStatus?.Message && <>
                <div className={`mr-10 text-4xl ${statusStyle}`}>{state?.trackStatus?.Message}</div>
            </>}
            {state?.lapCount && <>
                <div className='text-4xl text-white font-bold mr-20'>{state?.lapCount.CurrentLap}/{state?.lapCount.TotalLaps}</div>
            </>}
            </div>
        </div>
    </>
}

export default Header