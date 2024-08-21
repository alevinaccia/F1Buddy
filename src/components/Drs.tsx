import React from 'react'

const Drs = ( {status} ) => {

  let style;

  switch(status){
    case 0:
    case 1:
      //drs is off
      style = "text-black border-black"
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

  return (
    <div className={`border-4 rounded-lg p-1 border-double ${style} `} style={{ transition: "all 0.2s linear" }} >DRS</div>
  )
}

export default Drs