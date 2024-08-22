import React, { useContext, useEffect, useState } from 'react'
import { Capture, SocketContext, State } from '../socketContext'
import TeamRadio from './TeamRadio';

const TeamRadioContainer = () => {

    const state: State | undefined = useContext(SocketContext);
    const [teamRadioList, setTeamRadioList] = useState<Capture[]>([]);
    const [path, setPath] = useState('');
    const baseUrl = 'https://livetiming.formula1.com/static/';

    useEffect(() => {
        console.log("peppe");
        
        if (state?.teamRadio) {
            setTeamRadioList(state.teamRadio);
        }
        if (state?.sessionInfo?.Path) {
            setPath(state.sessionInfo.Path);            
        }
    }, [state?.teamRadio, state?.sessionInfo]);



    return (
        <div className='border-4 p-2'>
            <h2 className="text-xl text-white mb-4">Team Radio</h2>
            <div className='team-radio-list overflow-y-auto h-screen p-4'>
                {teamRadioList.length > 0 && state?.driversList &&
                    teamRadioList
                        .sort((a, b) => new Date(a.Utc).getTime() - new Date(b.Utc).getTime())
                        .reverse()
                        .map((e: Capture, index) => {
                            return <TeamRadio url={baseUrl + path + e.Path}
                                driverInfo={state.driversList?.[e.RacingNumber]}
                                key={index} />
                        })
                }
            </div>
        </div>
    )
}

export default TeamRadioContainer