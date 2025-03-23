"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CompanySelector } from "@/components/company/CompanySelector"
import { companies } from "@/constants/companies"

export default function HomePage() {
  const router = useRouter()
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  const handleCompanySelect = (symbol: string) => {
    setSelectedCompany(symbol)
    router.push(`/stockGame?symbol=${symbol}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-slate-100 background">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight">Stock.AI - 인공지능과 함께하는 주식</h1>
        <p className="mx-auto mb-12 max-w-2xl text-sm text-slate-200">
            강원과학고등학교 Fun! Fun! Science의 정보 부분 미니게임입니다. 기업을 선택하고, 1달마다 주식의 변동을 통해 옵션을 구매하며 돈을 버는 게임입니다.
            이 게임은 현재까지의 각 게임 부분마다 1달 전부터 현재까지의 주식 차트와 LSTM, ARIMA model 들로 예측한 다음 1달의 주식 차트를 비교하며 옵션의 종류를 선책합니다.
            또한 차트 아래의 뉴스는 다음 1달동안 배부된 뉴스들을 보여줍니다.
            게임의 최종 목표는 150$ 벌기입니다. 행운을 빕니다!
        </p>
        <div className="mx-auto max-w-3xl rounded-xl bg-slate-50 p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold text-slate-600">Select a Company</h2>
          <CompanySelector companies={companies} onSelect={handleCompanySelect} selected={selectedCompany} />
        </div>
      </div>
    </main>
  )
}

