"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import React from "react";
import { ReactNode } from 'react';
import { useState, useEffect } from "react";
import { RawData, FinalData, Configs, ChartItem, ChartDataItem } from "../../../types/type";
import mergeChartData from "@/lib/utils/mergeChartData"
import { mainChartConfigs } from "@/constants/chartConfigs"
import { Company } from "../../../types/type";

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
  rawData: RawData[]
  children? : ReactNode
  strikePrice? : number | null;
  chartStyle: [1 | 0, 1 | 0, 1 | 0, 1 | 0, 1 | 0, 1 | 0]
  curruntFund: number
  changeOfStock : {
    percentage : number;
    change : number;
  };
  lastStock : number
  company: Company;
}

const chartconfig = {} satisfies ChartConfig

const FinChart: React.FC<FinChartProps> = ({ rawData, children, strikePrice, chartStyle, curruntFund, lastStock, changeOfStock, company }) => {
  const [mergedData, setMergedData] = useState<FinalData[]>([])
  const [chartConfig] = useState<Configs[]>(mainChartConfigs);

  useEffect(() => {
    const mergeddata = mergeChartData(rawData)
    setMergedData(mergeddata)
  }, [rawData]);

  useEffect(() => {
    chartConfig.forEach((config, index) => {
      if (chartStyle[index] === 1) {
        config.chartType = true;
      } else {
        config.chartType = false;
      }
    });
  }, [chartStyle])

  if (!company) return
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <p className="text-xs font-bold">{company.symbol}</p>
          <div className="flex items-end">
            <p className="text-3xl font-bold">{lastStock}</p>
            <p className="ml-[5px] text-gray-500 text-xs">USD</p>
          </div>
          <div className={`${chartStyle[0] ? "text-red-500" : "text-green-500"} flex items-center`}>
            <p className="font-semibold">{chartStyle[0] ? "+" : ""}{changeOfStock.change}$</p>
            <p className="text-xs ml-[5px]">{Math.abs(changeOfStock.percentage)}%</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex mr-[6px]">
            <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] ${curruntFund >= 0 ? 'border-b-red-500' : 'border-b-gray-300'}`}></div>
            <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[12px] ${curruntFund < 0 ? 'border-t-green-500' : 'border-t-gray-300'}`}></div>
          </div>
          <p className="font-bold text-lg">{Math.abs(curruntFund)}$</p>
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
                if (item.chartType) {
                  return (
                    <linearGradient key={item.label} id={item.label} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={item.color}
                        stopOpacity={(item.id === "MainGood" || item.id === "MainBad") ? 0.8 : 0}
                      />
                      <stop
                        offset="95%"
                        stopColor={item.color}
                        stopOpacity={(item.id === "MainGood" || item.id === "MainBad") ? 0.1 : 0}
                      />
                    </linearGradient>
                  )  
                }
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
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              interval="preserveStartEnd"
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
              if (item.chartType) {
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
              )}
            })}
            {strikePrice !== null && (
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
  id: string;
  trigger: () => void;
}

const PredictFinChart: React.FC<elseFinChartProps> = ({ findata, classname, name, description, strikePrice, style, id, trigger }) => {
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
            <button
              className="rounded px-2 py-1 bg-black text-white font-bold text-sm"
              onClick={trigger}
            >그래프에 추가</button>
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
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export {FinChart, PredictFinChart};
