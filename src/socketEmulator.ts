interface LogEntry {
    timestamp: number;
    data: string;
}
export const emulateSocket = async (filePath: string, updateEntries) => {
    const response = await fetch(filePath);

    const rawData = await response.text();
    const lines = rawData.split('\n')

    const entries: LogEntry[] = lines.map((line) => {
        try {
            return JSON.parse(line)
        } catch (error) {
            console.error(error);
        }
    })
    let startTime = entries[0].timestamp
    let previousTimestamp: number | null = startTime;

    for (let i = 0; i < entries.length; i++) {

        if (previousTimestamp !== null) {
            const delay = entries[i].timestamp - startTime; // Calculate delay based on the new start time

            setTimeout(() => {
                updateEntries(JSON.parse(entries[i].data)) // Directly pass the data object
            }, delay);
        } else {
            updateEntries(JSON.parse(entries[i].data))
        }

        previousTimestamp = entries[i].timestamp; // Update previousTimestamp

    }
}

