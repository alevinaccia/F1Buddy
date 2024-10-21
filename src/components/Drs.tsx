import React, { useContext } from 'react'
import { useSocket } from '../SocketContext.tsx'
import { State } from '../../types/type';
import { useDriver } from './DriverRow.tsx'

const Drs = ({ status }) => {

  const state: State | undefined = useSocket();
  const carNumber: number | undefined = useDriver();

  let inPit = state?.timingDataF1[carNumber].InPit
  let style;

  if (!inPit) {
    switch (status) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 9:
        //drs is off
        style = "text-black border-black opacity-40"
        break;
      case 8:
        //can be used in the next drs zone
        style = "text-white border-white"
        break;
      case 10:
      case 12:
      case 14:
        //drs is active
        style = "bg-green-500 text-white border-white"

        break;
    }
  } else {
    style = "text-blue-400 border-blue-400"
  }

  return (
    <div className={`border-4 rounded-lg p-1 border-solid ${style} w-14 text-center`} style={{ transition: "all 0.2s linear" }} >{inPit ? "PIT" : "DRS"}</div>
  )
}

export default Drs
