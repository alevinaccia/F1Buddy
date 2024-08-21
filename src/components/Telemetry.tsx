import React, { useContext, useEffect, useState } from 'react'
import HorizontalBar from './HorizontalBar'
import { CarDataChannels, GlobalData, SocketContext } from '../socketContext'

const Telemetry = ({ carNumber }) => {

    const globalData: GlobalData | undefined = useContext(SocketContext)
    const [carTelemetry, setCarTelemetry] = useState<CarDataChannels>()

    useEffect(() => {
        if (globalData?.carsData?.Entries[0]) {

            let entries = globalData?.carsData?.Entries

            let startTime = new Date(globalData?.carsData?.Entries[0].Utc).getTime()
            let previousTimestamp: number | null = startTime;

            for (let i = 0; i < entries.length; i++) {

                let currentTime = new Date(globalData?.carsData?.Entries[i].Utc).getTime()

                if (previousTimestamp !== null) {
                    const delay = currentTime - startTime; // Calculate delay based on the new start time

                    setTimeout(() => {
                        setCarTelemetry(entries[i].Cars[carNumber].Channels) // Directly pass the data object
                    }, delay);
                } else {
                    setCarTelemetry(entries[i].Cars[carNumber].Channels)
                }

                previousTimestamp = currentTime; // Update previousTimestamp

            }
        }

    }, [globalData?.carsData])

    return (
        <>
            {carTelemetry ? (
                <>
                    <div className="flex-row space-y-2">
                        <HorizontalBar color={"bg-green-500"} fillPercentage={carTelemetry[4]} />
                        <HorizontalBar color={"bg-red-500"} fillPercentage={carTelemetry[5]} />
                    </div>
                    <div className='ml-2 w-3'>{carTelemetry[3]}</div>
                    <div className="h-7 w-2 ml-1 overflow-hidden rounded-md bg-gray-300 rotate-180">
                        <div className="h-full bg-indigo-500" style={{ height: `${carTelemetry[0] / 130}%` }}></div>
                    </div>
                    <span className='w-20'>{carTelemetry[2]} km/h</span>
                </>
            ) : null}
        </>
    )
}

export default Telemetry