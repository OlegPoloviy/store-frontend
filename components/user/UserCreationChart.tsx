"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type userTable } from "@/types/user.type";

interface UserCreationChartProps {
  users: userTable[];
}

const chartConfig = {
  count: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
} satisfies Record<string, { label: string; color: string }>;

export function UserCreationChart({ users }: UserCreationChartProps) {
  const chartData = useMemo(() => {
    // Group users by creation date
    const dateMap = new Map<string, number>();

    users.forEach((user) => {
      const date = new Date(user.createdAt);
      const dateKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
    });

    // Convert to array and sort by date
    const data = Array.from(dateMap.entries())
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    return data;
  }, [users]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Created by Day</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Created by Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
