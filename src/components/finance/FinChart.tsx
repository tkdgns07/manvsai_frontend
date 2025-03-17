"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, ReferenceLine } from "recharts";
import React from "react";
import { ReactNode } from 'react';
import { useState, useEffect } from "react";

import { ChartDataItem, NewsArticle } from "../../../types/type";

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
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-primary))",
  },
} satisfies ChartConfig;

interface FinChartProps {
  findata: ChartDataItem[];
  classname?: string;
  name: string;
  description?: string;
  children? : ReactNode
  strikePrice? : number;
  style : "MainGood" | "MainBad" | "LSTM" | "ARIMA"
  id: number;
}

const FinChart: React.FC<FinChartProps> = ({ findata, classname, name, description, children, strikePrice, style, id }) => {
  const [chartColor, setChartColor] = useState("")

  useEffect(() => {
    switch (style) {
      case "LSTM" :
        setChartColor("var(--chart-LSTM)")
        break
      case "MainBad" :
        setChartColor("var(--chart-red)")
        break
      case "MainGood" :
        setChartColor("var(--chart-green)")
        break
      case "ARIMA" :
        setChartColor("var(--chart-ARIMA)")
        break
      default:
        setChartColor("var(--chart-default)");
        break;
    }
  }, [style])

  if (!chartColor) {
    return null;
  }

  return (
    <Card className={`w-full h-full ${classname}`}>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {style == "LSTM" || style == "ARIMA" ? (
            <button className="rounded px-2 py-1 bg-black text-white font-bold text-sm">그래프에 추가</button>
          ) : (
            undefined
          )
        }
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={findata} className="relative">
            <defs>
              <linearGradient id={`fillData-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColor}
                  stopOpacity={1}
                />
                <stop
                  offset="95%"
                  stopColor={chartColor}
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="price"
              type="natural"
              fill={`url(#fillData-${id})`}
              stroke={chartColor}
              stackId="a"
              connectNulls={true}
            />
            {strikePrice !== undefined && (
              <ReferenceLine
                y={strikePrice}
                stroke="black"
                strokeDasharray="5 5"
                label={{
                  value: `행사가격: ${strikePrice}$`,
                  position: "top",
                  fill: "black",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
            )}
          </AreaChart>
        </ChartContainer>
        {children}
      </CardContent>
    </Card>
  );
};

export default FinChart;
