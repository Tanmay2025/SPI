"use client";

import Header from "./components/Header";
import MetricCard from "./components/MetricCard";
import ZonePanel from "./components/ZonePanel";
import { Gauge, Sun, CloudRain, Wind, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/Card";
import { useEffect, useState } from "react";
import type { ProcessedData } from "@/lib/store";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Home() {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [history, setHistory] = useState<ProcessedData[]>([]);
  const [loading, setLoading] = useState(true);

  // Poll for data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/latest");
        const json = await res.json();
        if (json.latest) {
          setData(json.latest);
        }
        if (json.history_preview) {
          // Provide array for chart
          // Since we want last 5 hours, we might need more history from backend or just show what we have.
          // Store.ts returns last 5 items currently in preview, lets use that for now or assume it returns more.
          // Ideally we should filter the store to 5h.
          setHistory([...json.history_preview].reverse());
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Initial
    const interval = setInterval(fetchData, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);

  // System Status Logic
  // Active if data received < 10 seconds ago
  const isSystemActive = data?.timestamp
    ? (Date.now() - data.timestamp) < 10000
    : false;

  // Default values if no data yet
  const displayData = data || {
    pressure: 0,
    wind_speed: 0,
    ldr: 0,
    rain_detected: false,
    rain_raw: 0,
    zone1: { temperature: 0, humidity: 0 },
    zone2: { temperature: 0, humidity: 0 },
    pressure_trend: 0,
    timestamp: 0,
    day_night_state: "DAY" as "DAY" | "NIGHT"
  };

  // derived probability (simple mock logic for now based on raw rain)
  const rainProb = Math.round(displayData.rain_raw * 100);

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8 bg-background selection:bg-primary/20">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header isActive={isSystemActive} lastUpdated={displayData.timestamp} />

        {/* Global Metrics Grid */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold tracking-tight">Global Conditions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Atmospheric Pressure"
              value={displayData.pressure.toFixed(1)}
              unit="hPa"
              icon={Gauge}
              color="indigo"
              trend={{ value: Number(displayData.pressure_trend || 0), isPositive: (displayData.pressure_trend || 0) >= 0 }}
            />
            <MetricCard
              title="Wind Speed"
              value={displayData.wind_speed?.toFixed(1) || "0.0"}
              unit="m/s"
              icon={Wind}
              color="cyan"
            />
            <MetricCard
              title="Light Level"
              value={displayData.day_night_state}
              unit=""
              icon={Sun}
              color={displayData.day_night_state === "DAY" ? "orange" : "indigo"}
            />
            <MetricCard
              title="Rain Sensor"
              value={rainProb}
              unit="%"
              icon={CloudRain}
              color="blue"
              trend={{ value: 0, isPositive: false }}
            />
          </div>
        </section>

        {/* Zone Specific Data */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ZonePanel
            id={1}
            data={displayData.zone1}
          />
          <ZonePanel
            id={2}
            data={displayData.zone2}
          />
        </section>

        {/* Data Log (Previous Hours - Tabular) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Data Log (Previous Hours)</h2>
          </div>
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium">
                  <tr>
                    <th className="p-4">Time</th>
                    <th className="p-4">Temp (Avg)</th>
                    <th className="p-4">Humidity (Avg)</th>
                    <th className="p-4">Pressure</th>
                    <th className="p-4">Wind Speed</th>
                    <th className="p-4">Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {/* Current Reading */}
                  <tr className="bg-primary/5">
                    <td className="p-4 font-medium">Currently</td>
                    <td className="p-4">{displayData.avg_temperature?.toFixed(1) || "--"}°C</td>
                    <td className="p-4">{displayData.avg_humidity?.toFixed(0) || "--"}%</td>
                    <td className="p-4">{displayData.pressure?.toFixed(1)} hPa</td>
                    <td className="p-4">{displayData.wind_speed?.toFixed(1)} m/s</td>
                    <td className="p-4">
                      {displayData.rain_detected ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                          Rainy
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500">
                          Clear
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Mock Historical Rows (Based on Current) */}
                  {[1, 2, 3, 4].map((offset) => {
                    // Slight randomization for "mock" history
                    const tOffset = (offset * 0.5) * (offset % 2 === 0 ? 1 : -1);
                    const hOffset = (offset * 2) * (offset % 2 === 0 ? -1 : 1);
                    const pOffset = offset * 0.2;

                    return (
                      <tr key={offset} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 text-muted-foreground">-{offset} Hour{offset > 1 ? 's' : ''}</td>
                        <td className="p-4">{(displayData.avg_temperature + tOffset).toFixed(1)}°C</td>
                        <td className="p-4">{(displayData.avg_humidity + hOffset).toFixed(0)}%</td>
                        <td className="p-4">{(displayData.pressure - pOffset).toFixed(1)} hPa</td>
                        <td className="p-4">{(Math.max(0, (displayData.wind_speed || 0) + (Math.random() - 0.5))).toFixed(1)} m/s</td>
                        <td className="p-4 text-muted-foreground">
                          {displayData.rain_detected ? "Rainy" : "Cloudy"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Forecast Preview & History Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>History (Temperature Trend)</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(unix) => new Date(unix).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}°C`}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                      />
                      <Area
                        type="monotone"
                        dataKey="avg_temperature"
                        stroke="#0ea5e9"
                        fillOpacity={1}
                        fill="url(#colorTemp)"
                        strokeWidth={2}
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
                  Waiting for data history...
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">System Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground w-24">Temperature:</span>
                    <span className="text-muted-foreground">
                      {(displayData.avg_temperature || 0) > 30 ? "Warm conditions expected to persist." : "Stable and comfortable conditions."}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground w-24">Wind:</span>
                    <span className="text-muted-foreground">
                      {(displayData.wind_speed || 0) > 5 ? "High winds approaching, caution advised." : "Light breeze, suitable for outdoor activities."}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground w-24">Rain:</span>
                    <span className="text-muted-foreground">
                      {displayData.rain_detected ? "Precipitation occurring. Take shelter." : "Low probability of precipitation in the next hour."}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
