import React, { useEffect, useState } from 'react'
import { useSocket } from '../SocketContext.tsx'
import TeamRadio from './TeamRadio';
import { Capture, State } from '../../types/type';

const TeamRadioContainer = () => {

    const state: State | undefined = useSocket();
    const [teamRadioList, setTeamRadioList] = useState<Capture[]>([]);
    const [path, setPath] = useState('');
    const baseUrl = 'https://livetiming.formula1.com/static/';

    useEffect(() => {
        if (state?.teamRadio) {
            setTeamRadioList(state.teamRadio);
        }
        if (state?.sessionInfo?.Path) {
            setPath(state.sessionInfo.Path);
        }
    }, [state?.teamRadio, state?.sessionInfo]);

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
            <h2 className="text-xl text-white mb-4">Team Radio</h2>
            <div className='team-radio-list overflow-y-auto h-screen p-4'>
                {teamRadioList.length > 0 && state?.driversList &&
                    teamRadioList
                        .sort((a, b) => new Date(a.Utc).getTime() - new Date(b.Utc).getTime())
                        .reverse()
                        .slice(0, 10)
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
