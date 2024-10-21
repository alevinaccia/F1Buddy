export type Country = {
  Key: number;
  Code: string;
  Name: string;
};


export type LogEntry = {
  timestamp: number;
  data: any;
}


export type Circuit = {
  Key: number;
  ShortName: string;
};

export type Meeting = {
  Key: number;
  Name: string;
  OfficialName: string;
  Location: string;
  Country: Country;
  Circuit: Circuit;
};

export type ArchiveStatus = {
  Status: string;
};

export type SessionInfo = {
  Meeting: Meeting;
  ArchiveStatus: ArchiveStatus;
  Key: number;
  Type: string;
  Name: string;
  StartDate: string;
  EnDate: string;
  GmtOffset: string;
  Path: string;
};

export type CarDataChannels = {
  "0": number; //RPM
  "2": number; //speed
  "3": number; //gear
  "4": number; //throttle
  "5": number; //brake
  "45": number; //drs
};

export type Capture = {
  Utc: string;
  RacingNumber: string;
  Path: string;
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
  [key: string]: {
    Channels: CarDataChannels;
  };
};

export type Entry = {
  Utc: string;
  Cars: Cars;
};

export type CarsTelemetry = {
  Entries: Entry[];
};

export type LBPositionInfo = {
  LapPosition: string[];
  RacingNumber: string;
};

export type LapSeries = {
  [key: string]: LBPositionInfo; //Leaderboard Position info, naming in the api sucks
};

export type TrackStatus = {
  Message: string;
  Status: string;
};

export type WeatherData = {
  AirTemp: string;
  Humidity: string;
  Pressure: string;
  Rainfall: string;
  TrackTemp: string;
  WindDirection: string;
  WindSpeed: string;
};

export type Sector = {
  Stopped: boolean;
  Value: string;
  Status: number;
  OverallFastest: boolean;
  PersonalFastest: boolean;
  Segments: {
    [key: number]: {
      Status: number;
    };
  };
};

export type TimingInfo = {
  GapToLeader: string;
  InPit: Boolean;
  Position: string;
  RacingNumber: string;
  Retired: Boolean;
  Stopped: Boolean;
  ShowPosition: Boolean;
  BestLapTime: { Value: string };
  IntervalToPositionAhead: { Catching: Boolean; Value: string };
  LastLapTime: {
    Value: string;
    status: number;
    OverallFastest: boolean;
    PersonalFastest: boolean;
  };
  Sectors: Sector[];
};

export type DriverTimingStat = {
  BestSectors: { Value: string; Position: number }[];
  PersonalBestLapTime: { Value: string; Lap: number; Position: number };
};

export type RCMessage = {
  Utc: string;
  Lap: number;
  Category: string;
  Flag: string;
  Scope: string;
  Message: string;
};

export type DriverStints = {
  GridPos: string; //starting position
  Line: number; //current position
  RacingNumber: string;
  Stints: {
    [key: number]: {
      LapFlags: number;
      Compound: string;
      New: string;
      TyresNotChanged: string;
      TotalLaps: number;
      StartLaps: number;
      LapTime: string; //best lap time during the stint
      LapNumber: number;
    };
  };
};

export type DriversStints = {
  [key: string]: DriverStints;
};

export type LapCount = {
  CurrentLap: number;
  TotalLaps: number;
};

export type TimingDataF1 = {
  [key: string]: TimingInfo;
};

export type TimingStats = {
  [key: string]: DriverTimingStat;
};

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
};

export type DriversList = {
  [key: string]: DriverInfo;
};

export type StatusSeries = {
  Utc: string;
  TrackStatus?: string;
  SessionStatus?: string;
};

export type TopThreeEntry = {
  Position: string;
  ShowPosition: boolean;
  RacingNumber: string;
  Tla: string;
  BroadcastName: string;
  FullName: string;
  Team: string;
  TeamColour: string;
  LapTime: string;
  LapState: number;
  DiffToAhead: string;
  DiffToLeader: string;
  OverallFastest: boolean;
  PersonalFastest: boolean;
};

export type State = {
  carsData: CarsTelemetry | null;
  carsPositions: Position | null;
  driversList: DriversList | null;
  lapSeries: LapSeries;
  trackStatus: TrackStatus | null;
  weatherData: WeatherData | null;
  timingDataF1: TimingDataF1;
  timingStats: TimingStats;
  stints: DriversStints;
  lapCount: LapCount;
  sessionInfo: SessionInfo | null;
  hearthbeat: string | null;
  teamRadio: Capture[] | null;
  sessionData: StatusSeries[];
  topThree: TopThreeEntry[];
  delay: number;
  raceControlMessages: RCMessage[];
};
