'use client';

import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('skeleton', className)} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-96 opacity-50" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="luxury-card p-8 space-y-4">
            <Skeleton className="h-4 w-24 opacity-30" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-16 opacity-20" />
          </div>
        ))}
      </div>

      {/* Large Content Area Skeleton */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="luxury-card p-10 h-[500px] flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            <Skeleton className="flex-1 w-full opacity-40" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="luxury-card p-10 h-[500px] space-y-6">
            <Skeleton className="h-6 w-32" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2 w-2/3 opacity-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
