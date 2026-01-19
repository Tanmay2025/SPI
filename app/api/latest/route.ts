import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
    const latest = store.getLatest();
    // Return history as well for charts if needed
    // For now just latest state for dashboard
    return NextResponse.json({
        latest: latest,
        history_preview: store.getHistory().slice(0, 5) // Return last 5 for sparklines/trends
    });
}
