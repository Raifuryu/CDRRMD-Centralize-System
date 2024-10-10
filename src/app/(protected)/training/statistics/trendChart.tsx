"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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

export const description = "A stacked area chart with expand stacking";

const chartData = [
  { "2022": 0, "2023": 0, "2024": 6, month: "January" },
  { "2022": 7, "2023": 0, "2024": 9, month: "February" },
  { "2022": 5, "2023": 3, "2024": 0, month: "March" },
  { "2022": 9, "2023": 2, "2024": 5, month: "April" },
  { "2022": 3, "2023": 1, "2024": 1, month: "May" },
  { "2022": 2, "2023": 2, "2024": 4, month: "June" },
  { "2022": 10, "2023": 7, "2024": 7, month: "July" },
  { "2022": 10, "2023": 5, "2024": 1, month: "August" },
  { "2022": 6, "2023": 9, "2024": 10, month: "September" },
  { "2022": 5, "2023": 7, "2024": 8, month: "October" },
  { "2022": 5, "2023": 0, "2024": 10, month: "November" },
  { "2022": 9, "2023": 7, "2024": 0, month: "December" },
];

const currentYear = new Date().getFullYear();

const chartConfig = {
  year3: {
    label: currentYear,
    color: "hsl(var(--chart-1))",
  },
  year2: {
    label: currentYear - 1,
    color: "hsl(var(--chart-2))",
  },
  year1: {
    label: currentYear - 2,
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type TrainingCountsByMonth = {
  month: string; // The name of the month
  [year: number]: number; // Dynamic keys representing years with their respective training counts
};

export function TrendChart({
  trainingStat,
}: {
  trainingStat: TrainingCountsByMonth[];
}) {
  console.log(trainingStat);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>
          {currentYear - 2} to {currentYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey={currentYear} fill="var(--color-year1)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar dataKey={currentYear - 1} fill="var(--color-year2)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar dataKey={currentYear - 2} fill="var(--color-year3)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
