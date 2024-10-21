import React, { useContext, useEffect, useState } from 'react'
import { rotate } from './Map';
import { useSocket } from '../SocketContext.tsx'
import { State } from '../../types/type';

type position = {
    X: number,
    Y: number
}

const CarDot = ({ rotation, centerX, centerY, driverInfo, inPit }) => {

    const [pos, setPos] = useState<position>({ X: 0, Y: 0 })
    const [transform, setTransform] = useState<string>('')
    const state: State | undefined = useSocket();

    useEffect(() => {
        if (state?.carsPositions) {

            let startTime = new Date(state.carsPositions.Position[0].Timestamp).getTime()
            let previousTimestamp: number | null = startTime;

            for (let i = 0; i < state.carsPositions.Position.length; i++) {

                let currentTime = new Date(state.carsPositions.Position[i].Timestamp).getTime()

                if (previousTimestamp !== null) {
                    const delay = currentTime - startTime; // Calculate delay based on the new start time
                    let p = state.carsPositions.Position[i].Entries[driverInfo.RacingNumber]
                    setTimeout(() => {
                        setPos({
                            X: p.X,
                            Y: p.Y
                        }) // Directly pass the data object
                    }, delay);
                } else {
                    setPos(state.carsPositions?.[i].Entries[driverInfo.RacingNumber])
                }

                previousTimestamp = currentTime; // Update previousTimestamp

            }
        }
    }, [state?.carsPositions])


    useEffect(() => {
        const rotatedPos = rotate(pos.X, pos.Y, rotation, centerX, centerY);
        const newTransform = [
            `translateX(${rotatedPos.x}px)`,
            `translateY(${rotatedPos.y}px)`
        ].join(" ");
        setTransform(newTransform);
    }, [pos.X, pos.Y, rotation, centerX, centerY]);

    return (!state.timingDataF1[driverInfo.RacingNumber].Stopped &&
        <g style={{ transition: "all 1s linear", transform }}>
            <circle r={160} fill={`#${driverInfo ? driverInfo.TeamColour : 'fefefe'}`}
            ></circle>

            <text
                fontWeight="bold"
                fontSize={100 * 3}
                fill={`#${driverInfo.TeamColour}`}
                style={{ transform: 'translate(200px,100px)' }}
            >{driverInfo.Tla}</text>

        </g>
    )
}

export default CarDot
