"use client";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        shortDate: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
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
      <Card className="rounded-2xl border-stone-200/80 bg-white py-0 shadow-sm">
        <CardHeader className="px-5 py-5 sm:px-6">
          <CardTitle className="text-lg font-semibold tracking-tight text-stone-950 sm:text-xl">{t("Users Created by Day")}</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-6 sm:px-6">
          <p className="text-sm text-stone-500">{t("No data available")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-stone-200/80 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-stone-100 px-5 py-5 sm:px-6">
        <CardTitle className="text-lg font-semibold tracking-tight text-stone-950 sm:text-xl">{t("Users Created by Day")}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto px-3 py-5 sm:px-6">
        <ChartContainer config={chartConfig} className="h-[280px] min-w-[460px]">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e0d6" />
            <XAxis
              dataKey="shortDate"
              angle={-35}
              textAnchor="end"
              height={58}
              interval="preserveStartEnd"
              tick={{ fontSize: 11, fill: "#7c6f64" }}
            />
            <YAxis width={32} tick={{ fontSize: 11, fill: "#7c6f64" }} />
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
