import React, { ReactNode, useEffect, useState, useContext } from 'react';
import './index.css';
import { State } from '../types/type'
import { createContext } from "react";
import DevMenu from './components/DevMenu';
import { SocketContextController } from './SocketContextController';

const SocketContext = createContext<State | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }): JSX.Element => {

  const [session, setSession] = useState<string>("ned_fp3.txt");
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

  const controller = SocketContextController.getInstance();

  useEffect(() => {
    (async () => {
      const socket = await controller.initialize();
      if (socket) {
        socket.onmessage = (e) => {
          try {
            const message = JSON.parse(e.data.toString());
            const updatedData = controller.handleMessage(message, state);
            setState((prevState) => ({
              ...prevState,
              ...updatedData
            }))
          } catch (e) {
            console.error("an error occurred while processing the message")
          }
        }
      }
    })()
  }, [])

  useEffect(() => {
    controller.loadFile(session);
  }, [session])

  const setCursor = (value) => {
    controller.setCursor(value);
  }

  const togglePause = () => {
    controller.togglePause();
  }

  return (
    <SocketContext.Provider value={state} >
      {(controller.isDevMode() &&
        <DevMenu controller={controller} />
      )}
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
