import React, { useContext, useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import DriverRow from "./DriverRow";
import { useSocket } from "../SocketContext.tsx";
import { State } from "../../types/type";

const LeaderBoard = () => {
  const state = useSocket();
  const [parent, enableAnimations] = useAutoAnimate();
  const [orderedList, setOrderedList] = useState<string[]>([]);

  let statusStyle = "";

  if (state?.trackStatus?.Message) {
    if (state.trackStatus.Message == "Red") {
      statusStyle = "border-red-600";
    }
    if (state.trackStatus.Message == "AllClear") {
      statusStyle = "border-green-600";
    }
    if (state.trackStatus.Message == "Yellow") {
      statusStyle = "border-yellow-300";
    }
  }

  const gapToNumber = (gap: string): number => {
    const [sec, millisec] = gap.substring(1).split(".");
    const secMillis = parseInt(sec) * 1000;
    return secMillis + parseInt(millisec);
  };

  const parseTime = (time: String) => {
    const [min, seconds] = time.split(":");
    const [sec, millis] = seconds.split(".");
    return parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(millis);
  };

  useEffect(() => {
    if (state?.carsData && state.timingDataF1) {
      if (orderedList.length == 0)
        setOrderedList(Object.keys(state?.timingDataF1));
      orderedList.sort((a, b) => {
        if (
          state.sessionInfo?.Type == "Practice" ||
          state.sessionInfo?.Type == "Qualifying"
        ) {
          if (
            state.timingStats[a].PersonalBestLapTime.Value == "" ||
            state.timingStats[b].PersonalBestLapTime.Value == ""
          ) {
            return state.stints[a].Line - state.stints[b].Line;
          }
          return (
            parseTime(state.timingStats[a].PersonalBestLapTime.Value) -
            parseTime(state.timingStats[b].PersonalBestLapTime.Value)
          );
        } else {
          if (
            state.timingDataF1[a].GapToLeader == "" ||
            state.timingDataF1[a].GapToLeader.includes("LAP")
          )
            return state.stints[a].Line - state.stints[b].Line;
          if (
            state.timingDataF1[b].GapToLeader == "" ||
            state.timingDataF1[b].GapToLeader.includes("LAP")
          )
            return state.stints[a].Line - state.stints[b].Line;

          const isLappedA = state.timingDataF1[a].GapToLeader.includes("L");
          const isLappedB = state.timingDataF1[b].GapToLeader.includes("L");

          if (isLappedA && !isLappedB) return 1;
          if (!isLappedA && isLappedB) return -1;

          if (isLappedB && isLappedB)
            return state.stints[a].Line - state.stints[b].Line;

          return (
            gapToNumber(state.timingDataF1[a].GapToLeader) -
            gapToNumber(state.timingDataF1[b].GapToLeader)
          );
        }
      });

      //before the race starts gaptoleader isn't reliable
    }
  }, [state]);

  return (
    <div className={`border-4 ${statusStyle}`}>
      <h2 className="text-xl text-white mb-4 p-2">
        Leaderboard : {state?.sessionInfo?.Name}
      </h2>
      <ul ref={parent}>
        {state &&
          orderedList.map((carNumber, position) => {
            return (
              <DriverRow
                carTelemetry={
                  state.carsData?.Entries[0].Cars[carNumber].Channels
                }
                driverInfo={state.driversList?.[carNumber]}
                hasStopped={state.timingDataF1[carNumber].Stopped}
                position={position}
                key={carNumber}
              />
            );
          })}
      </ul>
    </div>
  );
};

export default LeaderBoard;

