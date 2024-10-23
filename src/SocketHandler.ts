import axios from 'axios';
import { LogEntry, SessionInfo } from "../types/type.ts";

// TODO: Refactor this beautiful mess :)
export class MockSocket {

    private functionInstances: number = 0;
    static instance: MockSocket | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    private loadedFile: LogEntry[];
    private cursor: number = 0;
    private sessionStartCursorValue: number = -1;
    private sessionEndCursorValue: number = -1;
    private isStopped: boolean = false;
    private pause: boolean = true;
    private cursorBindFunction: (arg0: number) => void | undefined;

    private constructor() { }

    static getInstance(): MockSocket {
        if (this.instance == null) {
            this.instance = new MockSocket();
        } return this.instance;
    }

    public async loadFile(a: LogEntry[]) {
        this.loadedFile = a;
        this.cursor = 0;
        this.sessionStartCursorValue = -1;
        this.sessionEndCursorValue = -1;
        this.pause = true;
        this.isStopped = true;

        this.updateCursorUI(true);
        return await this.initState();
    }

    private async initState() {

        const TOLLERANCE = 2 * 60 * 1000 //2 minutes in milliseconds

        let fileStartTime: Date | undefined;
        let fileEndTime: Date | undefined;

        if (this.loadedFile) {

            let nearStartTime: boolean = false;
            let startSessionDate: Date | undefined;

            while (!nearStartTime) {

                const CURRENT_LINE_DATA = this.loadedFile[this.cursor].data;

                if (!CURRENT_LINE_DATA) {
                    this.cursor++;
                    this.updateCursorUI();
                    continue;
                }

                let data = this.getRelevantDataFromSocketMessage(CURRENT_LINE_DATA);

                if (data["SessionInfo"] && !startSessionDate) {
                    let sessionInfo = data["SessionInfo"] as SessionInfo;
                    startSessionDate = new Date(sessionInfo.StartDate);
                }
                if (data["Heartbeat"] && startSessionDate) {
                    let localDate = new Date(data["Heartbeat"].Utc);
                    if (startSessionDate.getTime() - localDate.getTime() < TOLLERANCE) {
                        fileStartTime = startSessionDate;
                        nearStartTime = true;
                    }
                }

                this.sendStateAtCursorPosition()
                this.cursor++;
            }

            this.sessionStartCursorValue = this.cursor;

            fileEndTime = this.findSessionEndCursorValue();
        }

        this.isStopped = false;
        this.simulateMessages();
        return [fileStartTime, fileEndTime];
    }

    private updateCursorUI(init: boolean = false) {
        if (init) {
            if (this.cursorBindFunction)
                this.cursorBindFunction(0)
            return
        }
        const interval = this.sessionEndCursorValue - this.sessionStartCursorValue;
        const offset = this.cursor - this.sessionStartCursorValue;
        const normalizedValue = offset / interval;
        const percentageValue = Math.floor(normalizedValue * 100);
        if (this.cursorBindFunction) {
            this.cursorBindFunction(percentageValue);
        }
    }

    private findSessionEndCursorValue(): Date | undefined {

        let fileEndTime: Date | undefined;
        this.cursor = this.loadedFile.length - 1;

        while (this.sessionEndCursorValue == -1 && this.cursor > 0) {
            const WORKING_LINE = this.loadedFile[this.cursor].data;
            if (!WORKING_LINE) {
                this.cursor--;
                continue;
            }
            const DATA = this.getRelevantDataFromSocketMessage(WORKING_LINE);

            if (DATA["RaceControlMessages"]) {
                Object.keys(DATA["RaceControlMessages"].Messages).map(e => {
                    let entry = DATA["RaceControlMessages"].Messages[e];
                    if (entry.Flag == "CHEQUERED") {
                        this.sessionEndCursorValue = this.cursor;
                        fileEndTime = new Date(entry.Utc);
                    }
                })
            }

            this.cursor--;
        }

        this.cursor = this.sessionStartCursorValue;

        return fileEndTime;
    }

    private getRelevantDataFromSocketMessage(socketMessage) {

        let data = {};

        if (socketMessage.R) {
            data = socketMessage.R;
        } else if (socketMessage.M) {
            //Unpacking the data from the json message
            socketMessage.M.forEach(element => {
                data[element.A[0]] = element.A[1];
            });
        }

        return data;
    }

    public setCursorBinding(fn) {
        this.cursorBindFunction = fn;
    }

    public isPaused(): boolean {
        return this.pause;
    }

    public setCursor(normalizedValue: number): void {
        const interval = this.sessionEndCursorValue - this.sessionStartCursorValue;
        const offset = Math.floor(interval * normalizedValue);
        this.cursor = this.sessionStartCursorValue + offset;
        this.updateCursorUI();
        //FIXME: works but slow af
        for (let i = this.sessionStartCursorValue; i < this.cursor; i++) {
            this.sendStateAtIndex(i);
        }
    }

    public togglePause() {
        this.pause = !this.pause;
    }

    private sendStateAtIndex(index: number) {
        const data = JSON.stringify(this.loadedFile[index].data);
        this.sendMessage(data);
    }

    private sendStateAtCursorPosition() {
        const data = JSON.stringify(this.loadedFile[this.cursor].data);
        this.sendMessage(data);
    }

    private sendMessage(data: string) {
        const mockMessage = { data: data };
        if (this.onmessage) {
            this.onmessage(mockMessage as MessageEvent);
        }
    }

    private async simulateMessages() {
        this.functionInstances++;
        if (this.functionInstances > 1) return
        while (!this.isStopped && this.cursor < this.sessionEndCursorValue) {
            if (!this.pause) {
                this.sendStateAtCursorPosition();
                this.updateCursorUI();
                this.cursor++;
                const currentFrameTime = this.loadedFile[this.cursor].timestamp;
                const nextFrameTime = this.loadedFile[this.cursor + 1].timestamp;
                const timeToNextFrame = nextFrameTime - currentFrameTime;
                await this.delay(timeToNextFrame);
            } else {
                await this.delay(100);
            }
        }
        this.functionInstances--;
        this.isStopped = false;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}


async function negotiate() {
    const hub = encodeURIComponent(JSON.stringify([{ name: "Streaming" }]));
    const url = `/api/signalr/negotiate?connectionData=${hub}&clientProtocol=1.5`;
    const resp = await axios.get(url);
    return resp;
}

async function connectwss(token: string, cookie: string[]) {
    const hub = encodeURIComponent(JSON.stringify([{ name: "Streaming" }]));
    const encodedToken = encodeURIComponent(token);
    const url = `wss://livetiming.formula1.com/signalr/connect?clientProtocol=1.5&transport=webSockets&connectionToken=${encodedToken}&connectionData=${hub}`;

    return new Promise<WebSocket>((res, rej) => {
        const sock = new WebSocket(url);

        sock.onopen = () => {
            res(sock);
        };

        sock.onerror = (err) => {
            rej(err);
        };
    });
}

export const initializeSocket = async () => {
    try {
        return await getSocket()

    } catch (error) {
        console.error("Error retrieving socket : ", error)
    }
}


export async function getSocket(): Promise<WebSocket> {
    try {
        const resp = await negotiate();
        const socket = await connectwss(resp.data['ConnectionToken'], resp.headers['set-cookie'] || []);

        socket.send(JSON.stringify({
            "H": "Streaming",
            "M": "Subscribe",
            "A": [[
                "Heartbeat",
                "CarData.z",
                "Position.z",
                "ExtrapolatedClock",
                "TopThree",
                "RcmSeries",
                "TimingStats",
                "TimingAppData",
                "WeatherData",
                "TrackStatus",
                "DriverList",
                "RaceControlMessages",
                "SessionInfo",
                "SessionData",
                "LapCount",
                "TimingData",
                "TeamRadio",
                "PitLaneTimeCollection"
            ]],
            "I": 1,
        }));

        return socket

    } catch (error) {
        throw error
    }
}
