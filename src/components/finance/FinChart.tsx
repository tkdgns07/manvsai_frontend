"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import React from "react";
import { ReactNode } from 'react';
import { useState, useEffect } from "react";
import { ChartDataItem, NewsArticle, ExtraDataSet, FinalData, Configs } from "../../../types/type";
import { mergeChartData } from "@/lib/utils/mergeChartData"

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

interface FinChartProps {
  findata: ChartDataItem[];
  extradata?: ExtraDataSet[]
  classname?: string;
  name: string;
  description?: string;
  children? : ReactNode
  strikePrice? : number;
  configs: Configs[]
}

function StyleSorter (style : string) {
  switch (style) {
    case "MainBad" :
      return ("var(--chart-red)")
    case "MainGood" :
      return ("var(--chart-green)")
    case "LSTM" :
      return ("var(--chart-LSTM)")
    case "ARIMA" :
      return ("var(--chart-ARIMA)")
    default:
      return ("var(--chart-default)");
  }
}

const chartconfig = {} satisfies ChartConfig

const FinChart: React.FC<FinChartProps> = ({ findata, extradata, classname, name, description, children, strikePrice, configs }) => {
  const [mergedData, setMergedData] = useState<FinalData[]>([])
  const [chartConfig, setChartConfig] = useState<Configs[]>([]);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 500]);  // Y축 범위 기본값 설정

  useEffect(() => {
    if (extradata) {
      const merging = mergeChartData(findata, extradata);
      setMergedData(merging);
      console.log(mergedData)
    } else {
      const findataAsFinalData: FinalData[] = findata.map((item) => ({
        date: item.date,
        price: item.price,
      }));
      setMergedData(findataAsFinalData);
      console.log(mergedData)
    }

    const prices = mergedData.flatMap(item => [
      item.price, 
      ...(Array.isArray(item?.data) ? item?.data.map(d => d.price) : [])
    ]);
    const minPrice = Math.min(...prices.filter(price => price !== null));
    const maxPrice = Math.max(...prices.filter(price => price !== null));

    // Y축 범위를 최소값과 최대값에 맞게 설정
    setYAxisDomain([minPrice - 10, maxPrice + 10]);
  }, [findata, extradata]);

  useEffect(() => {
    setChartConfig(configs.map((config) => ({
      ...config,
      color: StyleSorter(config.color),
    })));
  }, [configs])

  return (
    <Card className={`w-full h-full ${classname}`}>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer
          config={chartconfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={mergedData} className="relative">
            <defs>
              {chartConfig?.map((item) => {
                return (
                  <linearGradient key={item.label} id={item.label} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={item.color}
                      stopOpacity={item.chartType ? 1 : 0}
                    />
                    <stop
                      offset="95%"
                      stopColor={item.color}
                      stopOpacity={item.chartType ? 0.3 : 0}
                    />
                  </linearGradient>
                )
              })}
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
            <YAxis
              domain={yAxisDomain}  // Y축의 범위를 자동으로 설정
              tickLine={false}
              axisLine={false}
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
            {chartConfig.map((item) => {
              return (
                <Area
                  dataKey={item.label}
                  type="natural"
                  fill={`url(#${item.label})`}
                  stroke={item.color}
                  strokeWidth={2}
                  stackId={item.label}
                  connectNulls={true}
                  key={item.label}
                />
              )
            })}
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

interface elseFinChartProps {
  findata: ChartDataItem[];
  classname?: string;
  name: string;
  description?: string;
  strikePrice? : number;
  style : "LSTM" | "ARIMA"
  id: number;
}

const PredictFinChart: React.FC<elseFinChartProps> = ({ findata, classname, name, description, strikePrice, style, id }) => {
  const [chartColor, setChartColor] = useState("")

  useEffect(() => {
    switch (style) {
      case "LSTM" :
        setChartColor("var(--chart-LSTM)")
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
          config={chartconfig}
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
      </CardContent>
    </Card>
  );
};

export {FinChart, PredictFinChart};
