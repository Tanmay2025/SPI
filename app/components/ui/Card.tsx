import { cn } from '@/lib/utils';
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    gradient?: boolean;
}

export function Card({ className, children, gradient, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "glass-card relative overflow-hidden p-6",
                gradient && "bg-gradient-to-br from-card/80 to-card/40 dark:from-card/60 dark:to-background",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("pt-0", className)} {...props}>
            {children}
        </div>
    );
}
