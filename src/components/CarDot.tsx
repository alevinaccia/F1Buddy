import React, { useContext, useEffect, useState } from 'react'
import { rotate } from './Map';
import { GlobalData, SocketContext } from '../socketContext';

type position = {
    X : number,
    Y : number
}

const CarDot = ({rotation, centerX, centerY, driverInfo }) => {

    const [pos, setPos] = useState<position>({ X : 0, Y : 0})
    const [transform, setTransform] = useState<string>('')
    const globalData : GlobalData | undefined = useContext(SocketContext)

    useEffect(() => {
        if (globalData?.carsPositions) {

            let startTime = new Date(globalData.carsPositions.Position[0].Timestamp).getTime()
            let previousTimestamp: number | null = startTime;

            for (let i = 0; i < globalData.carsPositions.Position.length; i++) {

                let currentTime = new Date(globalData.carsPositions.Position[i].Timestamp).getTime()

                if (previousTimestamp !== null) {
                    const delay = currentTime - startTime; // Calculate delay based on the new start time
                    let p = globalData.carsPositions.Position[i].Entries[driverInfo.RacingNumber]
                    setTimeout(() => {
                        setPos({
                            X : p.X,
                            Y : p.Y
                        }) // Directly pass the data object
                    }, delay);
                } else {
                    setPos(globalData.carsPositions?.[i].Entries[driverInfo.RacingNumber])
                }

                previousTimestamp = currentTime; // Update previousTimestamp

            }
        }
    }, [globalData?.carsPositions])


    useEffect(() => {
        const rotatedPos = rotate(pos.X, pos.Y, rotation, centerX, centerY);
        const newTransform = [
            `translateX(${rotatedPos.x}px)`,
            `translateY(${rotatedPos.y}px)`
        ].join(" ");
        setTransform(newTransform);
    }, [pos.X, pos.Y, rotation, centerX, centerY]);
    
    return (
        <circle r={120} fill={`#${driverInfo ? driverInfo.TeamColour : 'fefefe'}`}
            style={{ transition: "all 1s linear", transform }}
        ></circle>
    )
}

export default CarDot