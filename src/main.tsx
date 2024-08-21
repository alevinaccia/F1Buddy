import React, { ReactNode, StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GlobalData, handleMessage, SocketContext } from './socketContext';
import LeaderBoard from './components/LeaderBoard';
import Map from './components/Map';
import entry from '../example.json'
import {emulateSocket} from './socketEmulator'
import Time from './components/Time';

const SocketProvider = ({ children }: { children: ReactNode }): JSX.Element => {

  const [fakeOnSocket, setFakeOnSocket] = useState('')
  const [globalData, setGlobalData] = useState<GlobalData>({
      carsData: null,
      carsPositions: null,
      driversList : null,
      lapSeries : {},
      trackStatus : null,
      weatherData : null,
      timingDataF1 : {},
      timingStats : {},
      stints: {},
      hearthbeat : null,
      lapCount : {  
        CurrentLap : 0,
        TotalLaps : 0
      }
  })

  useEffect(() => {
    emulateSocket("../recorded_data.txt", setFakeOnSocket)
  }, [])

  useEffect(() => {
    const updatedData = handleMessage(fakeOnSocket, globalData);
    setGlobalData({...updatedData});
   
  }, [fakeOnSocket] )



  return (
    <SocketContext.Provider value={globalData}>
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
      <Time/>
      <LeaderBoard/>
      <Map />
    </SocketProvider>
  </React.StrictMode>
);