import React, { ReactNode, StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { handleMessage, SocketContext } from './socketContext';
import { State } from '../types/type'
import LeaderBoard from './components/LeaderBoard';
import Map from './components/Map';
import entry from '../example.json'
import { emulateSocket } from './socketEmulator'
import Time from './components/Time';
import Header from './components/Header';
import TeamRadioContainer from './components/TeamRadioContainer';
import { getSocket } from './SocketHandler';

const initializeSocket = async () => {
  try {
    return await getSocket()

  } catch (error) {
    console.error("Error retrieving socket : ", error)
  }
}

const SocketProvider = ({ children }: { children: ReactNode }): JSX.Element => {

  const [socket, setSocket] = useState<WebSocket>()
  const [onSocket, setOnSocket] = useState('')
  const [delay, setDelay] = useState<number>(0)
  const [state, setState] = useState<State>({
    carsData: null,
    carsPositions: null,
    driversList: null,
    lapSeries: {},
    trackStatus: null,
    weatherData: null,
    timingDataF1: {},
    timingStats: {},
    stints: {},
    hearthbeat: null,
    lapCount: {
      CurrentLap: 0,
      TotalLaps: 0
    },
    sessionInfo: null,
    teamRadio: [],
    sessionData: [],
    topThree: [],
    delay : 0,
    raceControlMessages : []
  })

  useEffect(() => {
    (async () => {
      try {
        setSocket(await initializeSocket())
      } catch (error) {
        console.error("Error setting up the socket");
      }
    })()
    // emulateSocket("../recorded_data.txt", setOnSocket)
  }, [])

  useEffect(() => {
    console.log(delay);
    
    if (socket) {
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data.toString());
          setTimeout(() => {
            setOnSocket(message)
          }, delay)
        } catch (e) {
          console.error('Error processing message:', e);
        }
      }
    }
    //emulateSocket("../spa_race.txt", setOnSocket)
  }, [delay, socket])

  useEffect(() => {
    const updatedData = handleMessage(onSocket, state);
    setState({ ...updatedData });
  }, [onSocket])



  return (
    <SocketContext.Provider value={{state, setDelay}} >
      {children}
    </SocketContext.Provider>
  );

}

declare global {
  interface Window {
    __root?: ReactDOM.Root;
  }
}

const rootElement = document.getElementById('root') as HTMLElement;

// Check if the root already exists, if not, create it
if (!window.__root) {
  window.__root = ReactDOM.createRoot(rootElement);
}

window.__root.render(
  <React.StrictMode>
    <SocketProvider>
      <Time />
      <Header/>
      <div className='flex flex-row'>
        <LeaderBoard />
        <div className='flex flex-col w-full h-full'>
          <Map />
          <TeamRadioContainer />
        </div>
      </div>
    </SocketProvider>
  </React.StrictMode>
);