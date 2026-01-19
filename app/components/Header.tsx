import React from 'react';
import { CloudSun, Radio, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isActive?: boolean;
  lastUpdated?: number;
}

export default function Header({ isActive = false, lastUpdated }: HeaderProps) {
  return (
    <header className="w-full py-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20 shadow-lg shadow-primary/10">
          <CloudSun size={28} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            IOT + AI Weather Monitoring
          </h1>
          <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
            Forecasting SYSTEM
          </span>
        </div>
      </div>

      <div className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm transition-colors duration-500",
        isActive
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
      )}>
        <div className="relative flex items-center justify-center">
          {isActive && (
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            isActive ? "bg-emerald-500" : "bg-rose-500"
          )}></span>
        </div>

        <span className="text-sm font-medium">
          {isActive ? "System Active" : "System Inactive"}
        </span>

        <div className="h-4 w-[1px] bg-border/50 mx-1"></div>

        {isActive ? <Radio size={14} /> : <WifiOff size={14} />}

        <span className="text-xs font-mono opacity-80">
          {isActive ? "ESP32-LIVE" : "OFFLINE"}
        </span>
      </div>
    </header>
  );
}
