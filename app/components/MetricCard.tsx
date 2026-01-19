import React from 'react';
import { Card } from '@/app/components/ui/Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
    color?: "blue" | "green" | "orange" | "purple" | "rose" | "indigo" | "cyan";
}

export default function MetricCard({
    title,
    value,
    unit,
    icon: Icon,
    trend,
    className,
    color = "blue"
}: MetricCardProps) {
    const colorMap = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        green: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        cyan: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    };

    const gradientMap = {
        blue: "from-blue-500/5 to-transparent",
        green: "from-emerald-500/5 to-transparent",
        orange: "from-orange-500/5 to-transparent",
        purple: "from-purple-500/5 to-transparent",
        rose: "from-rose-500/5 to-transparent",
        indigo: "from-indigo-500/5 to-transparent",
        cyan: "from-cyan-500/5 to-transparent",
    };

    return (
        <Card className={cn("relative overflow-hidden transition-all duration-300 hover:-translate-y-1", className)}>
            {/* Background Gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none", gradientMap[color])} />

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{title}</span>
                    <div className={cn("p-2 rounded-lg", colorMap[color])}>
                        <Icon size={20} className={cn(colorMap[color].split(' ')[0])} />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
                        {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
                    </div>

                    {trend && (
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                            <span className={cn(
                                "flex items-center gap-0.5",
                                trend.isPositive ? "text-emerald-500" : "text-rose-500"
                            )}>
                                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                            </span>
                            <span className="text-muted-foreground/60">vs last hour</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
