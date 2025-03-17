"use client"

import FinChart from "@/components/finance/FinChart"
import { ChartDataItem, NewsArticle } from "../../types/type";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

import { useState } from "react";

const chartData = [
  { date: "2024-05-23", price: 252 },
  { date: "2024-05-24", price: 294 },
  { date: "2024-05-25", price: 201 },
  { date: "2024-05-26", price: 213 },
  { date: "2024-05-27", price: 420 },
  { date: "2024-05-28", price: 233 },
  { date: "2024-05-29", price: 78 },
  { date: "2024-05-30", price: 340 },
  { date: "2024-05-31", price: 178 },
  { date: "2024-06-01", price: 178 },
  { date: "2024-06-02", price: 470 },
  { date: "2024-06-03", price: 103 },
  { date: "2024-06-04", price: 439 },
  { date: "2024-06-05", price: 88 },
  { date: "2024-06-06", price: 294 },
  { date: "2024-06-07", price: 323 },
  { date: "2024-06-08", price: 385 },
  { date: "2024-06-09", price: 438 },
  { date: "2024-06-10", price: 155 },
  { date: "2024-06-11", price: 92 },
  { date: "2024-06-12", price: 492 },
  { date: "2024-06-13", price: 81 },
  { date: "2024-06-14", price: 426 },
  { date: "2024-06-15", price: null },
  { date: "2024-06-16", price: null },
  { date: "2024-06-17", price: null },
  { date: "2024-06-18", price: null },
  { date: "2024-06-19", price: null },
  { date: "2024-06-20", price: null },
  { date: "2024-06-21", price: null },
  { date: "2024-06-22", price: null },
  { date: "2024-06-23", price: null },
  { date: "2024-06-24", price: null },
  { date: "2024-06-25", price: null },
  { date: "2024-06-26", price: null },
  { date: "2024-06-27", price: null },

];

const elseChartData = [
  { date: "2024-06-15", price: 307 },
  { date: "2024-06-16", price: 371 },
  { date: "2024-06-17", price: 475 },
  { date: "2024-06-18", price: 107 },
  { date: "2024-06-19", price: 341 },
  { date: "2024-06-20", price: 408 },
  { date: "2024-06-21", price: 169 },
  { date: "2024-06-22", price: 317 },
  { date: "2024-06-23", price: 480 },
  { date: "2024-06-24", price: 132 },
  { date: "2024-06-25", price: 141 },
  { date: "2024-06-26", price: 434 },
  { date: "2024-06-27", price: 448 },
]

const newsData:NewsArticle[] = [
  { date: "2024-03-01", title: "Apple Releases New iPhone", description: "Apple has unveiled its latest iPhone model with improved features and design.", url: "https://example.com/apple-releases-new-iphone" },
  { date: "2024-03-02", title: "Apple's Q1 Earnings Report Surpasses Expectations", description: "Apple reported higher-than-expected earnings in the first quarter, with strong sales in its services division.", url: "https://example.com/apple-q1-earnings-report" },
  { date: "2024-03-03", title: "Apple Unveils AR Glasses", description: "Apple introduces its long-awaited augmented reality glasses, promising a new level of interaction with digital content.", url: "https://example.com/apple-unveils-ar-glasses" },
  { date: "2024-03-04", title: "Apple Expands Apple Music in Asia", description: "Apple Music has expanded its presence in several Asian countries, offering a wide range of localized music.", url: "https://example.com/apple-expands-music-asia" },
  { date: "2024-03-05", title: "Apple to Launch New Subscription Service", description: "Apple is set to launch a new subscription service aimed at delivering exclusive content to its customers.", url: "https://example.com/apple-launches-subscription-service" },
  { date: "2024-03-06", title: "Apple Partners with Tesla for EV Technology", description: "Apple enters into a strategic partnership with Tesla to develop cutting-edge technology for electric vehicles.", url: "https://example.com/apple-partners-tesla-ev-tech" },
  { date: "2024-03-07", title: "Apple to Open New Data Centers in Europe", description: "Apple announces the opening of several new data centers across Europe to improve cloud services and data privacy.", url: "https://example.com/apple-new-data-centers-europe" },
  { date: "2024-03-08", title: "Apple's Environmental Initiative Takes a Step Forward", description: "Apple takes significant steps towards reducing its carbon footprint with a series of new environmental policies.", url: "https://example.com/apple-environmental-initiative" },
  { date: "2024-03-09", title: "Apple Introduces New Privacy Features in iOS", description: "Apple enhances user privacy with new features aimed at protecting personal data from third-party access.", url: "https://example.com/apple-new-privacy-features-ios" },
  { date: "2024-03-10", title: "Apple Acquires Virtual Reality Startup", description: "Apple has acquired a virtual reality startup to strengthen its AR and VR product offerings for the future.", url: "https://example.com/apple-acquires-vr-startup" }
];



export default function Page() {
  const [newsExpend, setNewsExpend] = useState(false);

  return (
    <main className="p-3 h-screen">
  <div className="grid grid-cols-2 auto-rows-auto h-full gap-4">
    {/* 현재 시장 */}
      <Card className="flex w-full h-[100px]">
        <CardHeader>
          <CardTitle className="font-bold text-lg">현재 시장</CardTitle>
          <CardDescription>Apple의 특정 기간 실제 주식 시장입니다</CardDescription>
        </CardHeader>
      </Card>

      <Card className="flex w-full h-[100px]">
        <CardHeader>
          <CardTitle className="font-bold text-lg">예측 시장</CardTitle>
          <CardDescription>LSTM과 ARIMA 모델로 현재 시간에서 다음 1년의 주식 시장을 예측한 모습입니다.</CardDescription>
        </CardHeader>
      </Card>

    {/* 현재 주가 차트 (뉴스 포함) */}
    <FinChart findata={chartData} name="Apple" classname="flex flex-col" strikePrice={340} style="MainGood" id={1}>
      {/* 구분선 */}
      <div className="w-full h-[1px] bg-gray-400 rounded-full"></div>

      {/* 행사가격 정보 */}
      <div className="w-full flex items-end mt-2 flex-col">
        <p className="text-xs">행사가격</p>
        <p className="text-lg font-bold">33.23$</p>
      </div>

      {/* Call & Put 버튼 */}
      <div className="mt-2 flex justify-evenly">
        <div className="w-1/2 p-1">
          <button className="flex justify-evenly items-center w-full h-full bg-green-500 rounded-lg p-4 cursor-pointer hover:brightness-90 duration-200">
            <p className="text-lg font-bold">Call</p>
            <span className="w-[1px] h-full bg-gray-200"></span>
            <div>
              <p className="font-bold text-gray-200 text-sm">Premium</p>
              <p className="text-gray-200 text-xs">5.01$</p>
            </div>
          </button>
        </div>
        <div className="w-1/2 p-1">
          <button className="flex justify-evenly items-center w-full h-full bg-red-500 rounded-lg p-4 cursor-pointer hover:brightness-90 duration-200">
            <p className="text-lg font-bold">Put</p>
            <span className="w-[1px] h-full bg-gray-200"></span>
            <div>
              <p className="font-bold text-gray-200 text-sm">Premium</p>
              <p className="text-gray-200 text-xs">2.31$</p>
            </div>
          </button>
        </div>
      </div>

      <div className="relative inline-block">
      <div className={`h-[250px] mt-2 ${newsExpend ? "overflow-y-scroll" : "overflow-hidden"}`}>
        <div className="grid grid-cols-2 grid-rows-5 gap-2">
          {newsData.map((item, index) => (
            <a href={item.url} key={index} >
              <div className="p-2">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <button
        onClick={()=>setNewsExpend(true)}
        className="cursor-pointer"
      >
        <div className={`gradient-background absolute bottom-5 w-full h-[100px] flex items-center justify-center ${newsExpend ? "hidden" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg>
        </div>
      </button>
      </div>
    </FinChart>

    {/* 예측 그래프 */}
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="">
        <FinChart findata={elseChartData} name="LSTM Graph 1" style="LSTM" id={2}></FinChart>
      </div>
      <div className="">
        <FinChart findata={elseChartData} name="LSTM Graph 2" style="LSTM" id={3}></FinChart>
      </div>
      <div className="">
        <FinChart findata={elseChartData} name="LSTM Graph 3" style="LSTM" id={4}></FinChart>
      </div>
      <div className="">
        <FinChart findata={elseChartData} name="ARIMA Graph" style="ARIMA" id={5}></FinChart>
      </div>
    </div>
  </div>
</main>

  )
}
