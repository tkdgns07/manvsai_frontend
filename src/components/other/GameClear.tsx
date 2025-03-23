"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Clock, DollarSign, RefreshCcw, TrendingDown, Home, Trophy, TrendingUp, Forward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface ResultProps {
    time: string
}

const GameOverPage: React.FC<ResultProps> = ({ time }) => {
  const searchParams = useSearchParams()
  const [timeSpent, setTimeSpent] = useState<string>("00:00")

  useEffect(() => {
    if (time) {
      const seconds = Number.parseInt(time)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      setTimeSpent(`${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`)
    }
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center space-y-8 text-center">
          <h1 className="text-3xl font-bold text-red-500">투자 실패!</h1>

          <div className="flex items-center justify-center p-6 bg-red-100 dark:bg-red-900/30 rounded-full">
            <TrendingDown size={64} className="text-red-500" />
          </div>

          <Card className="w-full max-w-md border-red-200 dark:border-red-800">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center space-y-4">
                <h2 className="text-xl font-semibold">시장은 당신보다 한 발 앞서갔습니다</h2>
                <p className="text-muted-foreground">
                  옵션 거래에서 자산을 모두 잃었습니다. 다음에는 더 신중한 투자 결정을 내려보세요.
                </p>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <Clock className="text-primary" />
                  <span className="text-lg font-mono">소요 시간: {timeSpent}</span>
                </div>

                <div className="flex items-center justify-center gap-2 mt-2">
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted p-4 rounded-lg max-w-md">
            <p className="italic">
              "투자의 세계에서 실패는 또 다른 배움의 기회입니다. 월스트리트의 전설들도 처음부터 성공한 것은 아닙니다."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link href="/">
                <Home size={16} />
                메인으로 돌아가기
              </Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mt-8">
            <p>투자는 항상 위험이 따릅니다. 이 게임은 교육 목적으로만 제작되었습니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const GameSuccessPage: React.FC<ResultProps> = ({ time }) => {
  const searchParams = useSearchParams()
  const [timeSpent, setTimeSpent] = useState<string>("00:00")

  useEffect(() => {
    if (time) {
      // Assuming time is in seconds
      const seconds = Number.parseInt(time)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      setTimeSpent(`${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`)
    }
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center space-y-8 text-center">
          <h1 className="text-3xl font-bold text-green-500">투자 성공!</h1>

          <div className="flex items-center justify-center p-6 bg-green-100 dark:bg-green-900/30 rounded-full">
            <Trophy size={64} className="text-yellow-500" />
          </div>

          <Card className="w-full max-w-md border-green-200 dark:border-green-800">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center space-y-4">
                <h2 className="text-xl font-semibold">축하합니다! 목표 달성!</h2>
                <p className="text-muted-foreground">
                  현명한 옵션 거래로 $50 목표를 달성했습니다. 당신은 진정한 옵션 트레이딩 마스터입니다!
                </p>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <Clock className="text-primary" />
                  <span className="text-lg font-mono">소요 시간: {timeSpent}</span>
                </div>

                <div className="flex items-center justify-center gap-2 mt-2">
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg max-w-md">
            <p className="italic">
              "시장의 파도를 능숙하게 타며 기회를 포착하는 당신의 능력은 월스트리트의 전설들에게도 부럽지 않습니다. 이제
              더 큰 도전이 기다리고 있습니다!"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">

            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link href="/">
                <Home size={16} />
                메인으로 돌아가기
              </Link>
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2 mt-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <TrendingUp key={star} size={24} className="text-yellow-500" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { GameOverPage, GameSuccessPage }