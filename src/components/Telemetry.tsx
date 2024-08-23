import React, { useContext, useEffect, useState } from 'react'
import HorizontalBar from './HorizontalBar'
import { CarDataChannels, State, SocketContext } from '../socketContext'
import { DriverContext } from '../driverContext'

const Telemetry = () => {

    const state: State | undefined = useContext(SocketContext)
    let carNumber : number = useContext(DriverContext)
    const [carTelemetry, setCarTelemetry] = useState<CarDataChannels>()


    useEffect(() => {
        if (state?.carsData?.Entries[0]) {

            let entries = state?.carsData?.Entries

            let startTime = new Date(state?.carsData?.Entries[0].Utc).getTime()
            let previousTimestamp: number | null = startTime;

            for (let i = 0; i < entries.length; i++) {

                let currentTime = new Date(state?.carsData?.Entries[i].Utc).getTime()

                if (previousTimestamp !== null) {
                    const delay = currentTime - startTime; 

                    setTimeout(() => {
                        setCarTelemetry(entries[i].Cars[carNumber].Channels) 
                    }, delay);
                } else {
                    setCarTelemetry(entries[i].Cars[carNumber].Channels)
                }

                previousTimestamp = currentTime;

            }
        }
        
    }, [state?.carsData])

    return (
        <>
            {carTelemetry ? (
                <>
                    <div className="flex-row space-y-2">
                        <HorizontalBar color={"bg-green-500"} fillPercentage={carTelemetry[4]} />
                        <HorizontalBar color={"bg-red-500"} fillPercentage={carTelemetry[5]} />
                    </div>
                    <div className="relative size-8">
                        <svg className="rotate-[135deg] size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-neutral-700" strokeWidth="1.5" strokeDasharray="75 100" strokeLinecap="round"></circle>

                            <circle cx="18" cy="18" r="16" fill="none" className="transition linear stroke-current text-blue-600 dark:text-blue-500" strokeWidth="1.5" strokeDasharray={`${carTelemetry[0] / 160} 100`} strokeLinecap="round"></circle>
                        </svg>

                        <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-500">{carTelemetry[3]}</span>
                        </div>
                    </div>
                    <span className='w-24'>{carTelemetry[2]} km/h</span>
                </>
            ) : null}
        </>
    )
}

export default Telemetry