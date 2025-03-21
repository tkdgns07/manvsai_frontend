import { useState, useEffect, useRef } from "react";
import axios from "axios"
import { toast } from 'sonner'
import { Skeleton } from "@/components/ui/skeleton"

interface saleSectionProps {
    stockPrice : number;
    onStrikePriceChange: (strokePrice: number) => void;
    onPageChange: (strokePrice: number) => void;
}

const SaleSection: React.FC<saleSectionProps> = ({ stockPrice, onStrikePriceChange, onPageChange }) => {

    const [optionPrice, setOptionPrice] = useState<{ call : number, put : number } | null>()
    const [opttionLoader, setOptionLoader] = useState<boolean>(false)
    async function fetchData (strikePrice : number) {
        setOptionLoader(true)
        try {
            const response = await axios.get("http://127.0.0.1:8000/option_pricing/", {
                    params: {
                        strikePrice : strikePrice,
                        lastStock : stockPrice
                    },
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            const call = Number(response.data.call.toFixed(2))
            const put = Number(response.data.put.toFixed(2))
            setOptionPrice({ call, put })
        } catch (error) {
            console.error(error)
        } finally {
            setOptionLoader(false)
        }
    }

    const inputRef = useRef<HTMLInputElement>(null);
    const [strikePrice, setStrikePrice] = useState<number>(0)
    const handleStrokePrice = async () => {
        if (!inputRef.current) return;

        const value = inputRef.current.value.trim();
        if (value === "") {
            toast.warning("가격을 입력해주세요")
            return;
        }
        if (isNaN(Number(value))){
            toast.warning("가격을 입력해야 합니다")
            return
        }
        const strikep = parseInt(value)
        setStrikePrice(strikep)
        onStrikePriceChange(strikep);
        fetchData(strikep)
    }

    useEffect(() => {
        if (optionPrice?.call == 0 || optionPrice?.put == 0) {
            setOptionPrice(null)
            setStrikePrice(0)
            toast.warning("옵션의 프리미엄이 너무 낮습니다. 주식 가격과 비슷한 행사가격을 정해주세요.")
        }
    })

    function handleOption (optionType : "call" | "put") {
        if (!optionPrice) return
        if (optionType == "call") {
            onPageChange(-1 * optionPrice.call)
        }else if (optionType == "put") {
            onPageChange(optionPrice.put)
        }
    }

    useEffect(() => {
        setOptionPrice(undefined)
        setStrikePrice(0)
    }, [stockPrice])

    if (!strikePrice) {
        return (
            <div className="w-full">
                <p className="text-xs flex justify-end">행사가격</p>
                <div className="flex justify-center">
                    <input
                        type="text"
                        className="outline-none w-full font-light h-[50px] text-right rtl"
                        placeholder="적당한 행사가격을 정하세요"
                        ref={inputRef}
                    />
                    <p className="flex items-center ml-1">$</p>
                </div>
                <div className="w-full h-[1px] bg-gray-400 rounded-full"></div>
                <button
                    className="w-full h-[40px] rounded bg-black text-white flex justify-center items-center mt-[10px] cursor-pointer"
                    onClick={handleStrokePrice}
                >Set</button>
            </div>
        )
    }else {
        return (
            <>
                <div className="w-full h-[1px] bg-gray-400 rounded-full"></div>
                <div className="w-full flex justify-between">
                    <button
                            className="bg-none underline text-sm cursor-pointer"
                            onClick={()=>setStrikePrice(0)}
                    >
                        수정
                    </button>
                    <div className="flex items-end mt-2 flex-col">
                        <p className="text-xs">행사가격</p>
                        <p className="text-lg font-bold">{strikePrice}$</p>
                    </div>
                </div>
                <div className="mt-2 flex justify-evenly">
                    <div className="w-1/2 p-1">
                        <button className="flex justify-evenly items-center w-full h-full bg-green-500 rounded-lg p-4 cursor-pointer hover:brightness-90 duration-200"
                            onClick={()=>handleOption("call")}
                        >
                            {opttionLoader ? (
                                <Skeleton className="w-full h-full"></Skeleton>
                            ) : (
                                <>
                                    <p className="text-lg font-bold">Call</p>
                                    <span className="w-[1px] h-full bg-white"></span>
                                    <div>
                                        <p className="font-bold text-white text-sm">Premium</p>
                                        <p className="text-white text-xs">{optionPrice?.call}$</p>
                                    </div>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="w-1/2 p-1">
                        <button className="flex justify-evenly items-center w-full h-full bg-red-500 rounded-lg p-4 cursor-pointer hover:brightness-90 duration-200"
                            onClick={()=>handleOption("put")}
                        >
                            {opttionLoader ? (
                                <Skeleton className="w-full h-full"></Skeleton>
                            ) : (
                                <>
                                    <p className="text-lg font-bold">Put</p>
                                    <span className="w-[1px] h-full bg-white"></span>
                                    <div>
                                        <p className="font-bold text-white text-sm">Premium</p>
                                        <p className="text-white text-xs">{optionPrice?.put}$</p>
                                    </div>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </>
        )
    }
}

export default SaleSection