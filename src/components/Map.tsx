import React, { useContext, useEffect, useState } from 'react'
import { GlobalData, DriverInfo, SocketContext } from '../socketContext'
import CarDot from './CarDot';

const rad = (deg) => deg * (Math.PI / 180);

//put in an utils file
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


const Map = ({ }) => {

    const [points, setPoints] = useState<null | { x: number; y: number }[]>(null)
    const [[minX, minY, widthX, widthY], setBounds] = useState<(null | number)[]>([null, null, null, null]);
    const space = 1000;
    const globalData: GlobalData | undefined = useContext(SocketContext)
    
    const [rotation, setRotation] = useState<number>(0);
    const [[centerX, centerY], setCenter] = useState<(null | number)[]>([null, null]);

    useEffect(() => {
        const fetchMapData = async () => {
            const fetchedMap = await fetch(`https://api.multiviewer.app/api/v1/circuits/7/2024`)
            const mapData = await fetchedMap.json();

            const centerX = (Math.max(...mapData.x) - Math.min(...mapData.x)) / 2;
            const centerY = (Math.max(...mapData.y) - Math.min(...mapData.y)) / 2;
            const fixedRotation = mapData.rotation + rotationFIX;

            const pnt = mapData.x.map((x, index) => {
                return { 'x': x, 'y': mapData.y[index] }
            })

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

        fetchMapData()

    }, [])

    if (!points) {
        return <div>map loading</div>
    }

    return (
        <div>{points[0] &&
            <svg
                viewBox={`${minX} ${minY} ${widthX} ${widthY}`}
                className="h-full w-full xl:max-h-screen"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    className="stroke-gray-800"
                    strokeWidth={300}
                    strokeLinejoin="round"
                    fill="transparent"
                    d={`M${points[0].x},${points[0].y} ${points.slice(1).map((point) => `L${point.x},${point.y}`).join(" ")}`}
                />
                {globalData?.carsPositions && Object.keys(globalData.carsPositions.Position[0].Entries).map((carNumber) => {
                    let driverInfo : DriverInfo | undefined = globalData.driversList?.[Number(carNumber)] 
                    return (<CarDot
                                    rotation={rotation}
                                    centerX={centerX}
                                    centerY={centerY}
                                    key={carNumber}
                                    driverInfo={driverInfo}
                                    />)
                })}

            </svg>}
        </div>
    )


}

export default Map