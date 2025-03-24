'use client'
import { useEffect, useState } from "react"
import { NewsArticle } from "../../../types/type"
import axios from "axios"
import { Skeleton } from "../ui/skeleton"

interface NewsProps {
    symbol: string;
    page: number
}

export const NewsCrawling: React.FC<NewsProps> = ({ symbol, page }) => {

    const [loadCrawl, setLoadCrawl] = useState<boolean>(false)
    const [newsData, setNewsData] = useState<NewsArticle[]>([])
    useEffect(() => {
        async function fetchData () {
            setLoadCrawl(true)
            try {
                const response = await axios.get("http://127.0.0.1:8000/news_crawling/", {
                    params: {
                        symbol : symbol,
                        page : page,
                    },
                    headers: {
                      "Content-Type": "application/json",
                    },
                });
                setNewsData(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoadCrawl(false)
            }
        }
        fetchData()
    }, [page])

    return (
        <div className="relative inline-block w-full mt-[10px] h-[270px]">
            <div className={`max-h-[390px] w-full mt-2 flex-1 overflow-y-auto`}>
                {loadCrawl ? (
                    <Skeleton className="w-full h-full"></Skeleton>
                ) : (
                    <div className="h-full grid grid-cols-2 gap-2">
                        {newsData.map((item, index) => (
                            <a href={item.link} key={index}>
                                <div className="p-2">
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="text-xs text-gray-400">{item.pubDate}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}