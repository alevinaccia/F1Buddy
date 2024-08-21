import { createContext } from "react"
import { inflateRaw } from 'pako';

import { merge } from 'lodash'

export type CarDataChannels = {
    "0": number; //RPM
    "2": number; //speed
    "3": number; //gear
    "4": number; //throttle
    "5": number; //brake    
    "45": number; //drs
};

export type Position = {
	Position: PositionItem[];
};

export type PositionItem = {
	Timestamp: string;
	Entries: Positions;
};

export type Positions = {
	// this is what we have at state
	[key: string]: PositionCar;
};

export type PositionCar = {
	Status: string;
	X: number;
	Y: number;
	Z: number;
};

export type Cars = {
    [key : string] : {
        Channels : CarDataChannels
    }
}

export type Entry = {
    Utc : string,
    Cars : Cars
}

export type CarsTelemetry = {
    Entries : Entry[]
}

export type LBPositionInfo = {
    LapPosition : string[],
    RacingNumber : string
}

export type LapSeries = {
    [key : string] : LBPositionInfo //Leaderboard Position info, naming in the api sucks
}

export type TrackStatus = {
    Message : string,
    Status : string,
}

export type WeatherData = {
    AirTemp: string,
    Humidity: string,
    Pressure: string,
    Rainfall: string,
    TrackTemp: string,
    WindDirection: string,
    WindSpeed: string
}


export type Sector = {
    Stopped : boolean,
    Value : string,
    Status : number,
    OverallFastest : boolean,
    PersonalFastest : boolean
}

export type TimingInfo = {
    GapToLeader : string,
    InPit : Boolean,
    Position : string,
    RacingNumber : string,
    Retired : Boolean,
    Stopped : Boolean,
    ShowPosition : Boolean,
    BestLapTime : { Value : string },
    IntervalToPositionAhead : { Catching : Boolean, Value : string },
    LastLapTime : {
        Value : string,
        status : number,
        OverallFastest : boolean,
        PersonalFastest : boolean
    },
    Sectors : Sector[]
}

export type DriverTimingStat = {
    BestSectors : { Value : string, Position : number }[];
    PersonalBestLapTime : { Value : string, Lap : number , Position : number }
}

export type DriverStints = {
    GridPos : string, //starting position
    Line : number, //current position
    RacingNumber : string,
    Stints : {
        [ key: number] : {
            LapFlags: number,
            Compound: string,
            New: string,
            TyresNotChanged: string, 
            TotalLaps: number,
            StartLaps: number,
            LapTime: string, //best lap time during the stint
            LapNumber: number
        }
    }
 }

export type DriversStints = {
    [key : string] : DriverStints
}

export type LapCount = {
    CurrentLap : number,
    TotalLaps : number,    
}

export type TimingDataF1 = {
    [key : string] : TimingInfo
}

export type TimingStats = {
    [key : string] : DriverTimingStat;  
}


export type DriverInfo = {
    RacingNumber: string;
	BroadcastName: string;
	FullName: string;
	Tla: string;
	Line: number;
	TeamName: string;
	TeamColour: string;
	FirstName: string;
	LastName: string;
	Reference: string;
	HeadshotUrl: string;
	CountryCode: string;
}

export type DriversList = {
    [key : string] : DriverInfo
}

export type GlobalData = {
    carsData: CarsTelemetry | null;
    carsPositions: Position | null;
    driversList : DriversList | null;
    lapSeries : LapSeries
    trackStatus : TrackStatus | null;
    weatherData : WeatherData | null;
    timingDataF1 : TimingDataF1;
    timingStats : TimingStats;
    stints: DriversStints;
    lapCount : LapCount;
    hearthbeat : string | null
}


const inflate = <T>(data: string): T => {
	return JSON.parse(
		inflateRaw(
			Uint8Array.from(atob(data), (c) => c.charCodeAt(0)),
			{ to: "string" },
		),
	);
};


export const handleMessage = (rawData, currentData : GlobalData) : GlobalData => {
    let data = {};

    if(rawData.R){
        data = rawData.R
    }else if(rawData.M){
        //TO HANDLE
        rawData.M.forEach(element => {
            data[element.A[0]] = element.A[1]
        });
    }

    let parsedData : GlobalData = currentData

    if (data["CarData.z"]) {
        parsedData.carsData = inflate(data["CarData.z"]) as CarsTelemetry
    }
    if (data["Position.z"]) {
        parsedData.carsPositions = inflate(data["Position.z"]) as Position
    }
    if (data["DriverList"] && !currentData.driversList){
        parsedData.driversList = data["DriverList"] as DriversList
    }
    if (data["LapSeries"]){
        //this data arrives each time a driver crosses the start/finish line, it DOESN'T contain all the drivers at once
        parsedData.lapSeries = {...data["LapSeries"]}
    }
    if (data["TrackStatus"]){
        parsedData.trackStatus = data["TrackStatus"] as TrackStatus
    }
    if (data["TimingData"]){
        Object.keys(data["TimingData"].Lines).forEach(number => {
            if(!parsedData.timingDataF1[number]){
                parsedData.timingDataF1[number] = data["TimingData"].Lines[number]
            }else {
                merge(parsedData.timingDataF1[number], data["TimingData"].Lines[number]) 
            }
        })
    }
    if (data["TimingDataF1"]){
        Object.keys(data["TimingDataF1"].Lines).forEach(number => {
            if(!parsedData.timingDataF1[number]){
                parsedData.timingDataF1[number] = data["TimingDataF1"].Lines[number]
            }else {
                merge(parsedData.timingDataF1[number], data["TimingDataF1"].Lines[number]) 
            }
        })
    }
    if (data["TimingStats"]){
        Object.keys(data["TimingStats"].Lines).forEach(number => {
            if(!parsedData.timingStats[number]){
                parsedData.timingStats[number] = data["TimingStats"].Lines[number]
            }else {
                merge(parsedData.timingStats[number], data["TimingStats"].Lines[number]) 
            }
        })
    }
    if (data["TimingAppData"]){
        //info about stins, starting grid position and current position.
        Object.keys(data["TimingAppData"].Lines).forEach(number => {
            let old = parsedData.stints[number];
            let n = data["TimingAppData"].Lines[number];

            parsedData.stints[number] = {
                GridPos : n.GridPos || old.GridPos,
                Line : n.Line || old.Line,
                RacingNumber : n.RacingNumber || old.RacingNumber,
                Stints : []
            }

            if(n.Stints){
                parsedData.stints[number].Stints = {...n.Stints}
            }
        }) 
    }
    if (data["Heartbeat"]){
        parsedData.hearthbeat = data["Heartbeat"].Utc
    }
    if (data["LapCount"]) {
        parsedData.lapCount = data["LapCount"] as LapCount
    }

    return parsedData
}

export const SocketContext = createContext<GlobalData | undefined>(undefined)