import { NextResponse } from "next/server";
import { store, ESP32Payload } from "@/lib/store";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (typeof body.pressure !== 'number' || typeof body.rain_raw !== 'number') {
            return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });
        }

        const payload: ESP32Payload = {
            zone1: body.zone1 || { temperature: 0, humidity: 0 },
            zone2: body.zone2 || { temperature: 0, humidity: 0 },
            pressure: body.pressure,
            wind_speed: body.wind_speed,
            rain_raw: body.rain_raw,
            rain_detected: body.rain_detected,
            ldr: body.ldr,
            day_night: body.day_night
        };

        const processed = store.addReading(payload);

        return NextResponse.json({ success: true, data: processed });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
