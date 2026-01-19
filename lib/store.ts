// Interface matching the ESP32 Payload
export interface ESP32Payload {
    timestamp?: number; // Optional as we might assign it server-side
    zone1: {
        temperature: number;
        humidity: number;
    };
    zone2: {
        temperature: number;
        humidity: number;
    };
    pressure: number;
    wind_speed?: number; // Repurposed HX711
    rain_raw: number;
    rain_detected: boolean;
    ldr: number;
    day_night?: string;
}

export interface ProcessedData extends ESP32Payload {
    timestamp: number;
    avg_temperature: number;
    avg_humidity: number;
    pressure_trend: number; // Slope or simple diff
    day_night_state: "DAY" | "NIGHT";
}

class DataStore {
    private static instance: DataStore;
    private history: ProcessedData[] = [];
    private maxHistory = 100; // Keep last 100 readings for now

    private constructor() { }

    public static getInstance(): DataStore {
        if (!DataStore.instance) {
            DataStore.instance = new DataStore();
        }
        return DataStore.instance;
    }

    public addReading(payload: ESP32Payload): ProcessedData {
        const lastReading = this.history[0]; // Most recent
        const timestamp = Date.now();

        // Derived Logic
        const avg_temperature = (payload.zone1.temperature + payload.zone2.temperature) / 2;
        const avg_humidity = (payload.zone1.humidity + payload.zone2.humidity) / 2;

        // Day/Night Logic
        let day_night_state: "DAY" | "NIGHT" = lastReading?.day_night_state || "DAY";

        if (payload.day_night) {
            // Trust the firmware if it provides state
            day_night_state = payload.day_night as "DAY" | "NIGHT";
        } else if (payload.ldr <= 1) {
            // Digital LDR behavior (0=DAY, 1=NIGHT as per typical Active Low modules)
            // Verify your specific module: usually Low = Light.
            day_night_state = (payload.ldr === 0) ? "DAY" : "NIGHT";
        } else {
            // Analog Fallback logic
            const ldrNormalized = payload.ldr / 4095.0;
            if (ldrNormalized > 0.40) day_night_state = "DAY";
            if (ldrNormalized < 0.30) day_night_state = "NIGHT";
        }

        // Wind Speed Logic
        // Firmware sends: result = raw / 1000.0
        // User Logic:
        // Raw < 1000 -> 3.0 m/s
        // 1000-1100 -> 3.5 m/s
        // 1100-1200 -> 4.0 m/s
        // ... (+0.5 m/s for every 100 raw units)
        let processedWind = 0;
        if (payload.wind_speed !== undefined) {
            const rawWind = payload.wind_speed * 1000.0;
            if (rawWind < 1000) {
                processedWind = 3.0;
            } else {
                // 1000 -> 3.5. 1100 -> 4.0
                const steps = Math.floor((rawWind - 1000) / 100);
                processedWind = 3.5 + (steps * 0.5);
            }
        }

        // Pressure Trend (Simple diff from last reading)
        const pressure_trend = lastReading ? (payload.pressure - lastReading.pressure) : 0;

        const processed: ProcessedData = {
            ...payload,
            wind_speed: processedWind,
            timestamp,
            avg_temperature,
            avg_humidity,
            pressure_trend,
            day_night_state
        };

        this.history.unshift(processed);
        if (this.history.length > this.maxHistory) {
            this.history.pop();
        }

        return processed;
    }

    public getLatest(): ProcessedData | null {
        return this.history[0] || null;
    }

    public getHistory(): ProcessedData[] {
        return this.history;
    }
}

// Global scope hack for Next.js hot reload dev persistence
const globalStore = global as unknown as { dataStore: DataStore };
if (!globalStore.dataStore) {
    globalStore.dataStore = DataStore.getInstance();
}

export const store = globalStore.dataStore;
