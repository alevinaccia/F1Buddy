import React, { useContext, useEffect, useState } from 'react'
import { useSocket } from '../SocketContext.tsx'
import { State } from '../../types/type'



const Header = () => {

    type TimeLeft = {
        hours: number,
        minutes: string,
        seconds: string,
    };


    const state: State | undefined = useSocket();

    let targetDate: Date;

    if (state?.sessionInfo?.StartDate) {
        targetDate = new Date(state?.sessionInfo?.StartDate);
        targetDate.setHours(targetDate.getHours() + 1)
    }


    const calculateTimeLeft = (): TimeLeft => {

        let timeLeft: TimeLeft = {
            hours: 0,
            minutes: '0',
            seconds: '0',
        };

        if (targetDate && state.hearthbeat) {
            //FIXME: temporary solution
            //
            //const now: Date = new Date();
            const now = new Date(state.hearthbeat);
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                timeLeft.hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
                timeLeft.minutes = Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0')
                timeLeft.seconds = Math.floor((difference / 1000) % 60).toString().padStart(2, '0')
            } else {
                timeLeft.hours = 0
                timeLeft.minutes = '0'
                timeLeft.seconds = '00'
            }
        }

        return timeLeft;
    }


    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
    const [value, setValue] = useState('')


    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    let statusStyle = ''

    if (state?.trackStatus?.Message) {
        if (state.trackStatus.Message == "Red") {
            statusStyle = 'bg-red-600 px-8 py-3 rounded-2xl shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 '
        }
        if (state.trackStatus.Message == "AllClear") {
            statusStyle = 'bg-green-600 px-8 py-3 rounded-2xl'
        }
        if (state.trackStatus.Message == "Yellow") {
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
                <div>
                    <input value={value} onChange={e => setValue(e.target.value)} type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 mr-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Delay" required />
                </div>
                {state?.trackStatus?.Message && <>
                    <div className={`mr-10 text-4xl ${statusStyle}`}>{state?.trackStatus?.Message}</div>
                </>}
                {state?.sessionInfo?.Type == "Race" ? (
                    <>
                        <div className='text-4xl text-white font-bold mr-20'>{state?.lapCount.CurrentLap}/{state?.lapCount.TotalLaps}</div>
                    </>
                ) : <div className='text-4xl text-white font-bold mr-20 w-20'>{timeLeft.minutes}:{timeLeft.seconds}</div>}
            </div>
        </div>
    </>
}

export default Header
