import { createContext } from "react"
import { inflateRaw } from 'pako';
import * as Types from '../types/type'
import { merge } from 'lodash'


const inflate = <T>(data: string): T => {
    return JSON.parse(
        inflateRaw(
            Uint8Array.from(atob(data), (c) => c.charCodeAt(0)),
            { to: "string" },
        ),
    );
};


export const handleMessage = (rawData, currentData: Types.State): Types.State => {
    let data = {};

    if (rawData.R) {
        data = rawData.R;
    } else if (rawData.M) {
        //TO HANDLE
        rawData.M.forEach(element => {
            data[element.A[0]] = element.A[1];
        });
    }

    let parsedData: Types.State = currentData;

    if (data["CarData.z"]) {
        parsedData.carsData = inflate(data["CarData.z"]) as Types.CarsTelemetry;
    }
    if (data["Position.z"]) {
        parsedData.carsPositions = inflate(data["Position.z"]) as Types.Position;
    }
    if (data["DriverList"] && !currentData.driversList) {
        parsedData.driversList = data["DriverList"] as Types.DriversList;
    }
    if (data["LapSeries"]) {
        //this data arrives each time a driver crosses the start/finish line, it DOESN'T contain all the drivers at once
        parsedData.lapSeries = { ...data["LapSeries"] };
    }
    if (data["TrackStatus"]) {
        parsedData.trackStatus = data["TrackStatus"] as Types.TrackStatus;
    }
    if (data["TimingData"]) {
        Object.keys(data["TimingData"].Lines).forEach(number => {
            if (!parsedData.timingDataF1[number]) {
                parsedData.timingDataF1[number] = data["TimingData"].Lines[number];
            } else {
                merge(parsedData.timingDataF1[number], data["TimingData"].Lines[number]);
            }
        })
    }
    if (data["TimingDataF1"]) {
        Object.keys(data["TimingDataF1"].Lines).forEach(number => {
            if (!parsedData.timingDataF1[number]) {
                parsedData.timingDataF1[number] = data["TimingDataF1"].Lines[number];
            } else {
                merge(parsedData.timingDataF1[number], data["TimingDataF1"].Lines[number]);
            }
        })
    }
    if (data["TimingStats"]) {
        Object.keys(data["TimingStats"].Lines).forEach(number => {
            if (!parsedData.timingStats[number]) {
                parsedData.timingStats[number] = data["TimingStats"].Lines[number];
            } else {
                merge(parsedData.timingStats[number], data["TimingStats"].Lines[number]);
            }
        })
    }
    if (data["TimingAppData"]) {
        //info about stins, starting grid position and current position.
        Object.keys(data["TimingAppData"].Lines).forEach(number => {
            let n = data["TimingAppData"].Lines[number];
            if (!parsedData.stints[number]) {
                parsedData.stints[number] = data["TimingAppData"].Lines[number]
            } else {
                let old = parsedData.stints[number];

                parsedData.stints[number] = {
                    GridPos: n.GridPos || old.GridPos,
                    Line: n.Line || old.Line,
                    RacingNumber: n.RacingNumber || old.RacingNumber,
                    Stints: parsedData.stints[number]?.Stints || []
                }
            }

            if (n.Stints) {
                merge(parsedData.stints[number].Stints, n.Stints)
            }
        })
    }
    if (data["Heartbeat"]) {
        parsedData.hearthbeat = data["Heartbeat"].Utc;
    }
    if (data["LapCount"]) {
        merge(parsedData.lapCount, data["LapCount"]);
    }
    if (data["SessionInfo"]) {
        parsedData.sessionInfo = data["SessionInfo"] as Types.SessionInfo;
    }
    if (data["SessionData"]) {
        merge(parsedData.sessionData, data["SessionData"].StatusSeries)
        console.log(data["SessionData"]);

    }
    if (data["TopThree"]) {
        merge(parsedData.topThree, data["TopThree"].Lines)
    }
    if (data["TeamRadio"]) {

        const captures = data["TeamRadio"].Captures;
        const addCaptureIfNotIncluded = (capture: any) => {
            const isIncluded = parsedData.teamRadio?.some(b => b.Path === capture.Path);
            if (!isIncluded) {
                parsedData.teamRadio?.push(capture);
            }
        };

        if (Array.isArray(captures)) {
            captures.forEach(addCaptureIfNotIncluded);
        } else {
            Object.values(captures).forEach(addCaptureIfNotIncluded);
        }
    } 
    if (data["RaceControlMessages"]) {
        console.log(data["RaceControlMessages"]);
        
        const raceControlMessages = data["RaceControlMessages"].Messages;
        const addMessageIfNotIncluded = (message: any) => {
            const isIncluded = parsedData.raceControlMessages?.some(b => b.Utc === message.Utc);
            if (!isIncluded) {
                parsedData.raceControlMessages?.push(message);
            }
        };

        if (Array.isArray(raceControlMessages)) {
            raceControlMessages.forEach(addMessageIfNotIncluded);
        } else {
            Object.values(raceControlMessages).forEach(addMessageIfNotIncluded);
        }
    }
    return parsedData
}

type SocketType = {
    state: Types.State,
    setDelay: (delay: number) => void
};

export const SocketContext = createContext<SocketType | undefined>(undefined);