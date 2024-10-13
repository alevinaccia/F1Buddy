import axios from 'axios';


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
                "TimingDataF1",
                "LapSeries",
                "PitLaneTimeCollection",
                "TlaRcm"
            ]],
            "I": 1
        }));

        return socket

    } catch (error) {
        throw error
    }
}
