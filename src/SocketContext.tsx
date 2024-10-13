import React, { ReactNode, useEffect, useState, useContext } from 'react';
import './index.css';
import { handleMessage } from './messageHandler';
import { State } from '../types/type'
import { initializeSocket } from './SocketHandler';
import { createContext } from "react";

const SocketContext = createContext<State | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }): JSX.Element => {

  const [socket, setSocket] = useState<WebSocket>()
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
    delay: 0,
    raceControlMessages: []
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
    if (socket) {
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data.toString());
          const updatedData = handleMessage(message, state);
          setState((prevState) => ({
            ...prevState,
            ...updatedData
          }));
        } catch (e) {
          console.error('Error processing message:', e);
        }
      }
    }
    //emulateSocket("../spa_race.txt", setOnSocket)
  }, [socket])

  return (
    <SocketContext.Provider value={state} >
      {children}
    </SocketContext.Provider>
  );

}
export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
