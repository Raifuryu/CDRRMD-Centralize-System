"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { PieChartPropsSchema } from "@/schemas/chartDefinitions";
import z from "zod";

type PieChartProps = z.infer<typeof PieChartPropsSchema>;

export const description = "A donut chart with text";

const chartData = [
  { status: "Pending", training: 275, fill: "var(--color-pending)" },
  { status: "Completed", training: 200, fill: "var(--color-completed)" },
  { status: "Cancelled", training: 287, fill: "var(--color-cancelled)" },
];

const chartConfig = {
  training: {
    label: "Training",
  },
  pending: {
    label: "pending",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "completed",
    color: "hsl(var(--chart-2))",
  },
  cancelled: {
    label: "cancelled",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ChartPie({ data, filters }: PieChartProps) {
  const totalTrainings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.training, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="training"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTrainings.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Trainings
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total trainings for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
