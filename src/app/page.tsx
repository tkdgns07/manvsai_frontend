"use client"

import { FinChart, PredictFinChart } from "@/components/finance/FinChart"
import { NewsArticle, RawData, TransformedData } from "../../types/type";
import axios from "axios"
import SaleSection from "@/components/finance/BlackScholes"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

import { useEffect, useState } from "react";


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
  const [fund, setFund] = useState<number>(1000)
  const [newsExpend, setNewsExpend] = useState(false);
  const [rawData, setRawData] = useState<RawData[]>([])
  const [lastStock, setLastStock] = useState(0)
  const [strikePrice, setStrikePrice] = useState<number | null>(null)
  const [chartStyle, setChartStyle] = useState<[1 | 0, 1 | 0, 1 | 0, 1 | 0, 1 | 0, 1 | 0]>([1, 0, 0, 0, 0, 0])
  const [page, setPage] = useState<number>(0)
  const [option, setOption] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/extract_csv_data/", {
          params: {
            ticker: "AAPL",
            page: 0
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        setRawData(response.data.data)
        setLastStock(response.data.lastStock)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const [latestChartStyle, setLatestChartStyle] = useState(chartStyle);

const toggleChartStyle = (index: number) => {
  setChartStyle(prevChartStyle => {
    const newChartStyle: [1 | 0, 1 | 0, 1 | 0, 1 | 0, 1 | 0, 1 | 0] = [...prevChartStyle];
    newChartStyle[index] = newChartStyle[index] === 0 ? 1 : 0;
    return newChartStyle;
  });
};

// chartStyle이 변경될 때 최신 상태 반영
useEffect(() => {
  setLatestChartStyle(chartStyle);
}, [chartStyle]);

  const [saleLoader, setSaleLoader] = useState<boolean>(false)
  const handleOption = (option : number) => {
    setOption(option)
    setSaleLoader(true)
    console.log('no')
  }

  const handlePurchase = async () => {
    setPage(prev => {
      const newPage = prev + 1
      return newPage
    })
    try {
      const response = await axios.get("http://127.0.0.1:8000/extract_csv_data/", {
        params: {
          ticker: "AAPL",
          page: page + 1
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLastStock(response.data.lastStock)

      setChartStyle([0, 0, 0, 0, 0, 0])
      const strike = strikePrice ?? 0;
      if (option < 0) {
        if ((strike + option) * -1 < response.data.lastStock) {
          toggleChartStyle(0)
        }else {
          toggleChartStyle(1)
        }
        setFund(prev => {
          const newFund = prev + response.data.lastStock - strike - option
          return Number(newFund.toFixed(2))
        })
      } else if (option > 0) {
        if (strike > (response.data.lastStock + option)) {
          toggleChartStyle(0)
        }else {
          toggleChartStyle(1)
        }
        setFund(prev => {
          const newFund = prev - response.data.lastStock + strike - option
          return Number(newFund.toFixed(2))
        })
      }
      setRawData(response.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setSaleLoader(false)
    }
  }

  const handleRechoice = () => {
    setOption(0)
    setSaleLoader(false)
  }


  if (rawData.length > 0){
    return (
      <>
      <div className={`w-full h-full fixed flex justify-center items-center backdrop-brightness-50 z-10 ${!saleLoader ? 'hidden' : undefined}`}>
          <div className="bg-white p-5 rounded">
            <p className="text-xl text-black font-bold">정말 {option > 0 ? "Put Option" : "Call Option"}을 {Math.abs(option)}$로 구매하시겠습니까?</p>
            <p className="text-sm text-gray-500 mt-[10px] my-[20px]">옵션의 가격은 Premium 값과 행사가격을 합한 값입니다.</p>
            <button className="w-full flex justify-center py-3 text-lg text-white bg-black font-bold rounded cursor-pointer"
              onClick={handlePurchase}
            >Purchase</button>
            <button className="w-full flex justify-center py-3 text-lg text-black font-bold rounded cursor-pointer"
              onClick={handleRechoice}
            >Rechoice</button>
          </div>
        </div>
      <main className="p-3 w-full h-full">
        
    <div className="grid grid-cols-2 grid-rows-[100px_auto] h-full gap-4">
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
  
      <FinChart rawData={rawData} name="APPL" curruntFund={fund} strikePrice={strikePrice} chartStyle={chartStyle}>
        <SaleSection stockPrice={lastStock} onStrikePriceChange={setStrikePrice} onPageChange={handleOption}></SaleSection>
        <div className="relative inline-block w-full mt-[10px]">
      <div className={`h-[270px] w-full mt-2 flex-1 overflow-y-auto`}>
    <div className="h-[300px] grid grid-cols-2 gap-2">
      {newsData.map((item, index) => (
        <a href={item.url} key={index}>
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
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="">
          <PredictFinChart findata={rawData[1]['data']} name="LSTM Graph 1" style="LSTM" id='LSTM1' trigger={()=>toggleChartStyle(2)}></PredictFinChart>
        </div>
        <div className="">
          <PredictFinChart findata={rawData[2]['data']} name="LSTM Graph 2" style="LSTM" id='LSTM2' trigger={()=>toggleChartStyle(3)}></PredictFinChart>
        </div>
        <div className="">
          <PredictFinChart findata={rawData[3]['data']} name="LSTM Graph 3" style="LSTM" id='LSTM3' trigger={()=>toggleChartStyle(4)}></PredictFinChart>
        </div>
        <div className="">
          <PredictFinChart findata={rawData[4]['data']} name="ARIMA Graph" style="ARIMA" id='ARIMA' trigger={()=>toggleChartStyle(5)}></PredictFinChart>
        </div>
      </div>
    </div>
  </main>
  </>
  
    )
  
  }
}
