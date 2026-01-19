import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Thermometer, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZonePanelProps {
    id: number;
    data: {
        temperature: number;
        humidity: number;
    };
    className?: string;
}

export default function ZonePanel({ id, data, className }: ZonePanelProps) {
    return (
        <Card className={cn("overflow-hidden group", className)}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <div className="h-6 w-1 bg-primary rounded-full" />
                    Zone {id}
                </CardTitle>
                <span className="text-xs font-mono px-2 py-1 rounded bg-secondary text-muted-foreground border border-border/50">
                    DHT11
                </span>
            </CardHeader>

            <CardContent className="grid gap-4">
                {/* Temperature */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/50 hover:bg-secondary/80 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-orange-500/10 text-orange-500">
                            <Thermometer size={18} />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Temperature</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{data.temperature}</span>
                        <span className="text-sm text-muted-foreground">°C</span>
                    </div>
                </div>

                {/* Humidity */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/50 hover:bg-secondary/80 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                            <Droplets size={18} />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Humidity</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{data.humidity}</span>
                        <span className="text-sm text-muted-foreground">%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
