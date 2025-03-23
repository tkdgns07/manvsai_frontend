"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, DollarSign, TrendingUp, TrendingDown, Newspaper, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ManualProps {
  startTrigger: () => void
}

export const OptionsGameManual: React.FC<ManualProps> = ({ startTrigger }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 5

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const pages = [
    <div key="intro" className="flex flex-col items-center space-y-6 text-center">
      <h1 className="text-3xl font-bold">옵션 트레이딩 게임</h1>
      <div className="flex items-center justify-center p-4 bg-primary/10 rounded-full">
        <DollarSign size={48} className="text-primary" />
      </div>
      <p className="text-lg max-w-md">
        이 게임은 실제 주식을 사는 것이 아니라 옵션을 구매하여 거래를 통해 자산을 불리는 게임입니다. 총 $150를 벌면
        게임이 끝납니다.
      </p>
      <div className="flex items-center justify-center gap-8 mt-4">
        <div className="flex flex-col items-center">
          <TrendingUp size={32} className="text-green-500" />
          <p>콜 옵션</p>
        </div>
        <div className="flex flex-col items-center">
          <TrendingDown size={32} className="text-red-500" />
          <p>풋 옵션</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">오른쪽으로 스크롤하여 게임 방법을 알아보세요</p>
    </div>,

    // Page 2: Options Explanation
    <div key="options" className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold">옵션이란?</h2>
      <div className="grid grid-cols-2 gap-6 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-500" />
              <h3 className="font-semibold">콜 옵션</h3>
            </div>
            <p>특정 기간 동안 특정 가격(행사가격)으로 주식을 살 수 있는 권리입니다.</p>
            <p className="mt-2 text-sm text-muted-foreground">주가가 오를 것으로 예상할 때 구매합니다.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="text-red-500" />
              <h3 className="font-semibold">풋 옵션</h3>
            </div>
            <p>특정 기간 동안 특정 가격(행사가격)으로 주식을 팔 수 있는 권리입니다.</p>
            <p className="mt-2 text-sm text-muted-foreground">주가가 내릴 것으로 예상할 때 구매합니다.</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-base max-w-lg text-center">
        행사가격은 옵션을 채택할 시점에서 주의 가격과 변동성 등을 고려해 권리의 판매자와 소비자 간의 합의하는
        금액입니다.
      </p>
    </div>,

    // Page 3: Premium Explanation
    <div key="premium" className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold">옵션 프리미엄</h2>
      <div className="bg-primary/10 p-6 rounded-lg max-w-lg">
        <p className="text-base">
          옵션의 프리미엄은 각 옵션에 대해 판매자에게 주는 수수료 느낌의 가격입니다. 프리미엄이 높은 옵션이 미래에 더
          높은 이익을 낼 확률이 높다는 것을 유추할 수 있습니다.
        </p>
      </div>
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <div className="text-center">
          <p className="font-semibold">높은 프리미엄</p>
          <p className="text-sm text-muted-foreground">높은 이익 가능성</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">낮은 프리미엄</p>
          <p className="text-sm text-muted-foreground">낮은 이익 가능성</p>
        </div>
      </div>
      <p className="text-base max-w-lg text-center">
        우리는 옵션의 판매자를 고려하지 않기 때문에 콜/풋 옵션의 프리미엄이 매우 낮아지면 다시 골라야 하도록 했습니다.
      </p>
    </div>,

    // Page 4: Game Mechanics
    <div key="mechanics" className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold">게임 방식</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="text-primary" />
              <h3 className="font-semibold">주가 차트</h3>
            </div>
            <p>이전 1달간의 주가 차트를 보여줍니다.</p>
            <p className="mt-2 text-sm text-muted-foreground">이를 분석하여 향후 주가 방향을 예측하세요.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="text-primary" />
              <h3 className="font-semibold">뉴스 정보</h3>
            </div>
            <p>예측해야 하는 한 달간 배부된 뉴스가 10개 보여집니다.</p>
            <p className="mt-2 text-sm text-muted-foreground">뉴스를 통해 주가 변동 요인을 파악하세요.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-primary" />
              <h3 className="font-semibold">옵션 행사</h3>
            </div>
            <p>1달 이후 마지막 날에 무조건 선택한 옵션을 행사해 주를 거래하는 방식으로 이익을 계산합니다.</p>
            <p className="mt-2 text-sm text-muted-foreground">옵션의 행사가격과 실제 주가의 차이가 이익이 됩니다.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="text-blue-500" />
              <h3 className="font-semibold">AI 예측 그래프</h3>
            </div>
            <p>인공지능으로 예측한 1달간 주가의 변화 그래프가 제공됩니다.</p>
            <p className="mt-2 text-sm text-muted-foreground">AI 예측을 참고하여 더 정확한 투자 결정을 내리세요.</p>
          </CardContent>
        </Card>
      </div>
    </div>,

    // Page 5: Game Goal
    <div key="goal" className="flex flex-col items-center space-y-6 text-center">
      <h2 className="text-2xl font-bold">게임 목표</h2>
      <div className="flex items-center justify-center p-6 bg-primary/10 rounded-full">
        <DollarSign size={64} className="text-primary" />
      </div>
      <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
        <p className="text-xl font-bold">목표: $150 달성</p>
        <p className="text-sm text-muted-foreground mt-2">시간과의 레이스! 제한된 시간 내에 $150를 벌어야 합니다.</p>
      </div>
      <p className="text-base">
        "시간은 돈이고, 돈은 시간입니다. 빠르게
        $150를 모아 진정한 옵션 마스터가 되세요!"
      </p>
      <Button className="mt-4" variant="default"
        onClick={startTrigger}
      >
        도전 시작하기
      </Button>
    </div>,
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background w-screen h-screen">
      <div className="w-full max-w-3xl overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((page, index) => (
            <div key={index} className="min-w-full p-4">
              {page}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <Button variant="outline" onClick={prevPage} disabled={currentPage === 0} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          이전
        </Button>
        <div className="text-sm text-muted-foreground">
          {currentPage + 1} / {totalPages}
        </div>
        <Button
          variant="outline"
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className="flex items-center gap-2"
        >
          다음
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  )
}

