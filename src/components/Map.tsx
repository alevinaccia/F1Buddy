import React, { useContext, useEffect, useState } from 'react'
import { useSocket } from '../SocketContext.tsx'
import { State, DriverInfo } from '../../types/type'

import CarDot from './CarDot';

const rad = (deg) => deg * (Math.PI / 180);



//TODO put in an utils file
export const rotate = (x, y, a, px, py) => {
    const c = Math.cos(rad(a));
    const s = Math.sin(rad(a));

    x -= px;
    y -= py;

    const newX = x * c - y * s;
    const newY = y * c + x * s;

    return { y: newX + px, x: newY + py };
};

const rotationFIX = 90;
const space = 1000;

const fetchMapData = async (circuitKey, year, setPoints, setBounds, setRotation, setCenter) => {
    const fetchedMap = await fetch(`https://api.multiviewer.app/api/v1/circuits/${circuitKey}/${year}`)
    const mapData = await fetchedMap.json();

    const centerX = (Math.max(...mapData.x) - Math.min(...mapData.x)) / 2;
    const centerY = (Math.max(...mapData.y) - Math.min(...mapData.y)) / 2;
    const fixedRotation = mapData.rotation + rotationFIX;

    const rotatedPoints = mapData.x.map((x, index) => rotate(x, mapData.y[index], fixedRotation, centerX, centerY));

    const pointsX = rotatedPoints.map((item) => item.x);
    const pointsY = rotatedPoints.map((item) => item.y);

    const cMinX = Math.min(...pointsX) - space;
    const cMinY = Math.min(...pointsY) - space;
    const cWidthX = Math.max(...pointsX) - cMinX + space * 2;
    const cWidthY = Math.max(...pointsY) - cMinY + space * 2;

    setPoints(rotatedPoints);
    setBounds([cMinX, cMinY, cWidthX, cWidthY]);
    setRotation(fixedRotation);
    setCenter([centerX, centerY]);
}



const Map = ({ }) => {

    const [points, setPoints] = useState<null | { x: number; y: number }[]>(null);
    const [[minX, minY, widthX, widthY], setBounds] = useState<(null | number)[]>([null, null, null, null]);
    const state: State | undefined = useSocket();

    const [rotation, setRotation] = useState<number>(0);
    const [[centerX, centerY], setCenter] = useState<(null | number)[]>([null, null]);

    useEffect(() => {
        if (state?.sessionInfo?.Meeting.Circuit.Key && new Date(state?.sessionInfo?.StartDate).getFullYear()) {
            const circuitKey = state?.sessionInfo?.Meeting.Circuit.Key
            const year = new Date(state?.sessionInfo?.StartDate).getFullYear();
            fetchMapData(circuitKey, year, setPoints, setBounds, setRotation, setCenter)
        }
    }, [state?.sessionInfo])

    if (!points) {
        return <div>map loading</div>
    }

    let statusStyle = ''

    if (state?.trackStatus?.Message) {
        if (state.trackStatus.Message == "Red") {
            statusStyle = 'border-red-600'
        }
        if (state.trackStatus.Message == "AllClear") {
            statusStyle = 'border-green-600'
        }
        if (state.trackStatus.Message == "Yellow") {
            statusStyle = 'border-yellow-300'
        }
    }


    return (
        <div className={`border-4 p-2 ${statusStyle}`}>
            <h2 className="text-xl text-white mb-4">Live GPS</h2>
            <div className='w-full h-full'>{points[0] &&
                <svg
                    viewBox={`${minX} ${minY} ${widthX} ${widthY}`}
                    className="h-full w-full xl:max-h-screen"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        className="stroke-black"
                        strokeWidth={300}
                        strokeLinejoin="round"
                        fill="transparent"
                        d={`M${points[0].x},${points[0].y} ${points.slice(1).map((point) => `L${point.x},${point.y}`).join(" ")}`}
                    />
                    {state?.carsPositions && Object.keys(state.carsPositions.Position[0].Entries).map((carNumber) => {
                        let driverInfo: DriverInfo | undefined = state.driversList?.[Number(carNumber)]
                        return (<CarDot
                            rotation={rotation}
                            centerX={centerX}
                            centerY={centerY}
                            key={carNumber}
                            driverInfo={driverInfo}
                            inPit={state.timingDataF1[carNumber].InPit}
                        />)
                    })}

                </svg>}
            </div>
        </div>)


}

export default Map
