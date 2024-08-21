import React, { useContext, useEffect, useState } from 'react'
import hard from "/tires/hard.svg";
import medium from "/tires/medium.svg";
import soft from "/tires/soft.svg";
import intermediate from "/tires/intermediate.svg";
import wet from "/tires/wet.svg";
import unknown from "/tires/unknown.svg";
import { DriverStints, GlobalData, SocketContext } from '../socketContext';

const Tyres = ({ carNumber }) => {

    let globalData : GlobalData | undefined = useContext(SocketContext)

    let [ stints, setStints] = useState<DriverStints>()
    let [ currentCompund, setCurrentCompound ] = useState<string>("unknown")
    let numberOfStints = 0

    useEffect(() => {    
        if(globalData?.stints){
            setStints(globalData?.stints[carNumber])
        }
    }, [globalData?.stints[carNumber]])

    useEffect(() => {
        if(stints && stints?.Stints[0]){
            let stintsEntries = Object.keys(stints!.Stints)
            let currentStint = stintsEntries[stintsEntries.length - 1]
            setCurrentCompound(stints?.Stints[currentStint].Compound || 'unknown')
        }else {
            setCurrentCompound('unknown')
        }

    }, [ stints ])

    let icon;
    
    switch (currentCompund) {
        case ('SOFT'):
            icon = soft
            break
        case ('MEDIUM'):
            icon = medium
            break
        case ('HARD'):
            icon = hard
            break
        case ('INTERMEDIATE'):
            icon = intermediate
            break
        case ('WET'):
            icon = wet
            break
        default:
            icon = unknown
    }

    return (
        <div>
            <img src={icon} className="w-7 h-7" />
        </div>
    )
}

export default Tyres