"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardRevenuePoint } from "@/server/dashboard/types";

interface RevenueOverviewChartProps {
    data: DashboardRevenuePoint[];
}

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "#38BDF8",
    },
} satisfies ChartConfig;

function formatRevenue(value: number) {
    return `$${value.toLocaleString()}`;
}

export default function RevenueOverviewChart({ data }: RevenueOverviewChartProps) {
    return (
        <figure className="space-y-3" aria-label="Monthly revenue bar chart">
            <ChartContainer
                config={chartConfig}
                className="h-[250px] w-full"
                initialDimension={{ width: 640, height: 250 }}
            >
                <BarChart
                    accessibilityLayer
                    data={data}
                    margin={{ top: 10, right: 6, bottom: 0, left: 0 }}
                >
                    <CartesianGrid vertical={false} stroke="#CBD5E1" strokeOpacity={0.45} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={12}
                        tick={{ fill: "#64748B", fontSize: 12, fontWeight: 700 }}
                    />
                    <YAxis
                        width={42}
                        domain={[0, 15000]}
                        ticks={[0, 5000, 10000, 15000]}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "#64748B", fontSize: 12, fontWeight: 700 }}
                        tickFormatter={(value) => `$${Number(value) / 1000}k`}
                    />
                    <ChartTooltip
                        cursor={{ fill: "rgba(56, 189, 248, 0.1)", radius: 12 }}
                        content={
                            <ChartTooltipContent
                                className="border-mist-gray/70 bg-white text-midnight-slate shadow-[0_24px_54px_-30px_rgba(15,23,42,0.45)]"
                                formatter={(value) => (
                                    <>
                                        <span className="text-slate-gray">Revenue</span>
                                        <span className="font-mono font-bold text-midnight-slate">
                                            {formatRevenue(Number(value))}
                                        </span>
                                    </>
                                )}
                            />
                        }
                    />
                    <Bar
                        dataKey="revenue"
                        isAnimationActive={false}
                        radius={[12, 12, 6, 6]}
                        maxBarSize={48}
                        activeBar={{
                            fill: "#38BDF8",
                            stroke: "#38BDF8",
                            strokeWidth: 2,
                        }}
                    >
                        {data.map((point, index) => {
                            const isCurrent = index === data.length - 1;

                            return (
                                <Cell
                                    key={point.month}
                                    fill={isCurrent ? "#38BDF8" : "#F8FAFC"}
                                    stroke={isCurrent ? "#38BDF8" : "#CBD5E1"}
                                    strokeWidth={1}
                                />
                            );
                        })}
                    </Bar>
                </BarChart>
            </ChartContainer>
            <figcaption className="sr-only">
                Revenue increases from January through June, ending at $12,450.
            </figcaption>
        </figure>
    );
}
