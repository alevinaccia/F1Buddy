import React, { useContext, useEffect, useState } from 'react'
import { Capture, SocketContext, State } from '../socketContext'
import TeamRadio from './TeamRadio';

const TeamRadioContainer = () => {

    const state: State | undefined = useContext(SocketContext);
    const [teamRadioList, setTeamRadioList] = useState<Capture[]>([]);
    const [path, setPath] = useState('');
    const baseUrl = 'https://livetiming.formula1.com/static/';

    useEffect(() => {
        if (state?.teamRadio) {
            setTeamRadioList(state.teamRadio);
        }
        if (state?.sessionInfo?.Path) {
            console.log(state.sessionInfo.Path);
            
            setPath(state.sessionInfo.Path);
            console.log(state.sessionInfo.Path);
            
        }
    }, [state?.teamRadio]);



    return (
        <div className='border-4 p-2'>
            <h2 className="text-xl text-white mb-4">Team Radio</h2>
            <div className='team-radio-list overflow-y-auto h-80 p-4'>
                {teamRadioList.length > 0 && state?.driversList &&
                    teamRadioList.slice(-20)
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