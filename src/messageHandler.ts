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

// TODO put "object.keys..." into a function
export const handleMessage = (message, state: Types.State): Types.State => {
    let data = {};

    if (message.R) {
        data = message.R;
    } else if (message.M) {
        //Unpacking the data from the json message
        message.M.forEach(element => {
            data[element.A[0]] = element.A[1];
        });
    }

    if (data["CarData.z"]) {
        state.carsData = inflate(data["CarData.z"]) as Types.CarsTelemetry;
    }
    if (data["Position.z"]) {
        state.carsPositions = inflate(data["Position.z"]) as Types.Position;
    }
    if (data["DriverList"] && !state.driversList) {
        state.driversList = data["DriverList"] as Types.DriversList;
    }
    if (data["LapSeries"]) {
        state.lapSeries = { ...data["LapSeries"] };
    }
    if (data["TrackStatus"]) {
        state.trackStatus = data["TrackStatus"] as Types.TrackStatus;
    }
    if (data["TimingData"]) {
        Object.keys(data["TimingData"].Lines).forEach(number => {
            if (!state.timingDataF1[number]) {
                state.timingDataF1[number] = data["TimingData"].Lines[number];
            } else {
                merge(state.timingDataF1[number], data["TimingData"].Lines[number]);
            }
        })
    }
    if (data["TimingDataF1"]) {
        Object.keys(data["TimingDataF1"].Lines).forEach(number => {
            if (!state.timingDataF1[number]) {
                state.timingDataF1[number] = data["TimingDataF1"].Lines[number];
            } else {
                merge(state.timingDataF1[number], data["TimingDataF1"].Lines[number]);
            }
        })
    }
    if (data["TimingStats"]) {
        Object.keys(data["TimingStats"].Lines).forEach(number => {
            if (!state.timingStats[number]) {
                state.timingStats[number] = data["TimingStats"].Lines[number];
            } else {
                merge(state.timingStats[number], data["TimingStats"].Lines[number]);
            }
        })
    }
    if (data["TimingAppData"]) {
        Object.keys(data["TimingAppData"].Lines).forEach(number => {
            let n = data["TimingAppData"].Lines[number];
            if (!state.stints[number]) {
                state.stints[number] = data["TimingAppData"].Lines[number]
            } else {
                let old = state.stints[number];

                state.stints[number] = {
                    GridPos: n.GridPos || old.GridPos,
                    Line: n.Line || old.Line,
                    RacingNumber: n.RacingNumber || old.RacingNumber,
                    Stints: state.stints[number]?.Stints || []
                }
            }

            if (n.Stints) {
                merge(state.stints[number].Stints, n.Stints)
            }
        })
    }
    if (data["Heartbeat"]) {
        state.hearthbeat = data["Heartbeat"].Utc;
    }
    if (data["LapCount"]) {
        merge(state.lapCount, data["LapCount"]);
    }
    if (data["SessionInfo"]) {
        state.sessionInfo = data["SessionInfo"] as Types.SessionInfo;
    }
    if (data["SessionData"]) {
        merge(state.sessionData, data["SessionData"].StatusSeries)
    }
    if (data["TopThree"]) {
        merge(state.topThree, data["TopThree"].Lines)
    }
    if (data["TeamRadio"]) {
        const captures = data["TeamRadio"].Captures;
        const addCaptureIfNotIncluded = (capture: any) => {
            const isIncluded = state.teamRadio?.some(b => b.Path === capture.Path);
            if (!isIncluded) {
                state.teamRadio?.push(capture);
            }
        };

        if (Array.isArray(captures)) {
            captures.forEach(addCaptureIfNotIncluded);
        } else {
            Object.values(captures).forEach(addCaptureIfNotIncluded);
        }
    }
    if (data["RaceControlMessages"]) {
        const raceControlMessages = data["RaceControlMessages"].Messages;
        const addMessageIfNotIncluded = (message: any) => {
            const isIncluded = state.raceControlMessages?.some(b => b.Utc === message.Utc);
            if (!isIncluded) {
                state.raceControlMessages?.push(message);
            }
        };

        if (Array.isArray(raceControlMessages)) {
            raceControlMessages.forEach(addMessageIfNotIncluded);
        } else {
            Object.values(raceControlMessages).forEach(addMessageIfNotIncluded);
        }
    }
    return state
}
