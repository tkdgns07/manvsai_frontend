"use client"

import { FinChart, PredictFinChart } from "@/components/finance/FinChart"
import { NewsArticle, RawData, TransformedData } from "../../../types/type";
import axios from "axios"
import SaleSection from "@/components/finance/BlackScholes"
import { useSearchParams } from "next/navigation";
import { companies } from "@/constants/companies";
import { Company } from "../../../types/type";
import { OptionsGameManual } from "@/components/other/OptionsGameManual";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

import { useEffect, useState } from "react";

const MainPage = () => {
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
  
  const [fund, setFund] = useState<number>(1000)
  const [newsExpend, setNewsExpend] = useState(false);
  const [rawData, setRawData] = useState<RawData[]>([])
  const [lastStock, setLastStock] = useState(0)
  const [strikePrice, setStrikePrice] = useState<number | null>(null)
  const [chartStyle, setChartStyle] = useState<[1 | 0, 1 | 0, 1 | 0, 1 | 0, 1 | 0, 1 | 0]>([1, 0, 0, 0, 0, 0])
  const [page, setPage] = useState<number>(0)
  const [option, setOption] = useState<number>(0)
  const [changeOfStock, setChangeOfStock] = useState<{ percentage : number, change : number }>({ percentage : 0, change : 0 })
  const [company, setCompany] = useState<Company>()
  
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol")?.toString();

  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (symbol) {
      const foundCompany = companies.find((c) => c.symbol === symbol);
      setCompany(foundCompany);
    }
  }, [symbol]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/extract_csv_data/", {
          params: {
            ticker: symbol,
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

useEffect(() => {
  setLatestChartStyle(chartStyle);
}, [chartStyle]);

  const [saleLoader, setSaleLoader] = useState<boolean>(false)
  const handleOption = (option : number) => {
    setOption(option)
    setSaleLoader(true)
  }

  const handlePurchase = async () => {
    setPage(prev => {
      const newPage = prev + 1
      return newPage
    })
    try {
      const response = await axios.get("http://127.0.0.1:8000/extract_csv_data/", {
        params: {
          ticker: symbol,
          page: page + 1
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLastStock(prev => {
        setChartStyle([0, 0, 0, 0, 0, 0])
        setChangeOfStock({ percentage : Number(((response.data.lastStock - prev)/prev * 100).toFixed(2)), change : Number((response.data.lastStock - prev).toFixed(2)) })
        if (response.data.lastStock - prev >= 0) {
          toggleChartStyle(0)
        } else {
          toggleChartStyle(1)
        }
        return response.data.lastStock
      })
      const strike = strikePrice ?? 0;
      if (option < 0) {
        setFund(prev => {
          const newFund = prev + response.data.lastStock - strike - option
          if (newFund < prev) return  Number(newFund.toFixed(2)) * -1
          return Number(newFund.toFixed(2))
        })
      } else if (option > 0) {
        setFund(prev => {
          const newFund = prev - response.data.lastStock + strike - option
          if (newFund < prev) return  Number(newFund.toFixed(2)) * -1
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

  const router = useRouter()
  useEffect(() => {
    if (fund - 1000 >= 50) {
      router.push(`gameClear?time=${time}&result=success`)
    }
  }, [page])

  useEffect(() => {
    if (page >= 9) {
      router.push(`gameClear?time=${time}&result=fail`)
    }
  }, [page]);

  if (rawData.length > 0 && company){  
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
      <main className="m-3 w-auto h-auto">
    <div className="grid grid-cols-2 grid-rows-[100px_auto] h-full gap-4">
        <Card className="flex w-full h-[100px]">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="font-bold text-lg">현재 시장</CardTitle>
              <CardDescription>{company?.name}의 특정 기간 실제 주식 시장입니다</CardDescription>
            </div>
            <p>{time}초 지남</p>
          </CardHeader>
        </Card>
  
        <Card className="flex w-full h-[100px]">
          <CardHeader>
            <CardTitle className="font-bold text-lg">예측 시장</CardTitle>
            <CardDescription>LSTM과 ARIMA 모델로 현재 시간에서 다음 1년의 주식 시장을 예측한 모습입니다.</CardDescription>
          </CardHeader>
        </Card>
  
      <FinChart rawData={rawData} curruntFund={fund} strikePrice={strikePrice} chartStyle={chartStyle} lastStock={lastStock} changeOfStock={changeOfStock} company={company}>
        <SaleSection stockPrice={lastStock} onStrikePriceChange={setStrikePrice} onPageChange={handleOption}></SaleSection>
        <div className="relative inline-block w-full mt-[10px] h-[270px]">
      <div className={`max-h-[390px] w-full mt-2 flex-1 overflow-y-auto`}>
    <div className="h-full grid grid-cols-2 gap-2">
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

export default function Page () {

  const [gameStart, setGameStart] = useState<boolean>(false)
  function handleTrigger () {
    setGameStart(true)
  }

  return (
    <>
      {gameStart ? (
        <MainPage></MainPage>
      ) : (
        <OptionsGameManual startTrigger={handleTrigger}></OptionsGameManual>
      )}
    </>
  )
}