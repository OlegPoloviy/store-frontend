"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Product } from "@/types/product.type";

interface ProductCreationChartProps {
  products: Product[];
}

const chartConfig = {
  count: {
    label: "Products",
    color: "#0f766e",
  },
} satisfies Record<string, { label: string; color: string }>;

export function ProductCreationChart({ products }: ProductCreationChartProps) {
  const chartData = useMemo(() => {
    const dateMap = new Map<string, number>();

    products.forEach((product) => {
      const date = new Date(product.createdAt);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const dateKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
    });

    return Array.from(dateMap.entries())
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
  }, [products]);

  if (chartData.length === 0) {
    return (
      <Card className="rounded-2xl border-stone-200/80 bg-white py-0 shadow-sm">
        <CardHeader className="px-5 py-5 sm:px-6">
          <CardTitle className="text-lg font-semibold tracking-tight text-stone-950 sm:text-xl">
            Products Created by Day
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-6 sm:px-6">
          <p className="text-sm text-stone-500">No product data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-stone-200/80 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-stone-100 px-5 py-5 sm:px-6">
        <CardTitle className="text-lg font-semibold tracking-tight text-stone-950 sm:text-xl">
          Products Created by Day
        </CardTitle>
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
