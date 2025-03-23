"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Company } from "@/../types/type"

interface CompanySelectorProps {
  companies: Company[]
  onSelect: (symbol: string) => void
  selected: string | null
}

export function CompanySelector({ companies, onSelect, selected }: CompanySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  ) 

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Search companies..."
          className="pl-10 border-slate-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {filteredCompanies.map((company) => (
          <button
            key={company.symbol}
            className={`flex items-center space-x-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-100 ${
              selected === company.symbol ? "bg-slate-100 ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelect(company.symbol)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 shadow-sm">
              <Image src={`/logos/${company.logoId}.svg`} alt={company.name} width={24} height={24} unoptimized />
            </div>
            <div>
              <div className="font-medium text-slate-900">{company.name}</div>
              <div className="text-sm text-slate-500">{company.symbol}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

