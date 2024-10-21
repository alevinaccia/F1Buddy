import { handleMessage } from "./messageHandler.ts"
import { initializeSocket, MockSocket } from './SocketHandler';
import { State, LogEntry } from "../types/type.ts";


export class SocketContextController {

  private static instance: SocketContextController;
  private socket: WebSocket | MockSocket | undefined;
  private devMode: boolean = true;
  private sessionsLocation: string = "../recordedSessions/";

  private filesNameList: string[] = [
    "ned_fp3.txt",
    "ned_quali.txt",
    "spa_race.txt"
  ];


  private constructor() { }

  public initialize = async (): Promise<WebSocket | MockSocket | undefined> => {
    if (this.socket) return this.socket;

    if (this.devMode) {
      this.socket = new MockSocket();
      return this.socket;
    } else {
      try {
        this.socket = await initializeSocket();
        return this.socket
      } catch (error) {
        console.error("an error occurred setting up the socket")
      }
    }
  }

  public getFileList(): string[] {
    return this.filesNameList;
  }

  public isDevMode(): boolean {
    return this.devMode;
  }

  public handleMessage = (message: string, state: State) => {
    return handleMessage(message, state)
  }

  public loadFile = async (file: string) => {
    if (file == "") return;
    if (!this.devMode) return;
    const lines = await fetch(this.sessionsLocation + file)
      .then(res => res.text())
      .then(data => data.split("\n"));

    if (!(this.socket instanceof MockSocket)) return
    this.socket.loadFile(lines.map((line) => {
      try {
        const entry = JSON.parse(line);
        return {
          timestamp: entry.timestamp,
          data: JSON.parse(entry.data)
        } as LogEntry
      } catch (error) {
        console.error(error);
      }
    }).filter(entry => entry !== undefined));

    const [fileStartTime, fileEndTime] = this.socket.initState();
  }

  public setCursor(value: number): void {
    if (this.devMode && this.socket instanceof MockSocket)
      this.socket.setCursor(value / 100);
  }

  public togglePause() {
    if (this.devMode && this.socket instanceof MockSocket)
      this.socket.togglePause();
  }

  public static getInstance = (): SocketContextController => {
    if (this.instance == null) {
      this.instance = new SocketContextController();
    }
    return this.instance;
  }
}
