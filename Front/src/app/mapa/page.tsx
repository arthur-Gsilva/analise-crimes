'use client'

import GetDate from "@/components/GetDate"
import { Header } from "@/components/Header"
import dynamic from "next/dynamic"
import { useState } from "react"

const DynamicMap = dynamic(() => import('../../components/Map'), {
  ssr: false,
})

const Page = () => {
    const now = new Date()
    const [month, setMonth] = useState(now.getMonth())
    const [year, setYear] = useState(now.getFullYear())

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

    return(
        <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 overflow-hidden">
            <Header />

            <div className="flex-1 flex flex-col container mx-auto px-6 py-4 max-w-7xl overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                            Mapa de Calor - Pernambuco
                        </h1>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Visualização geográfica de ocorrências por município
                        </p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200">
                        <p className="text-xs text-gray-500 mb-0.5">Período</p>
                        <p className="text-lg font-bold text-gray-900">
                            {monthNames[month]} / {year}
                        </p>
                    </div>
                </div>

                <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-gray-200/50 flex flex-col overflow-hidden">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                            <GetDate 
                                selectedMonth={month}
                                selectedYear={year}
                                onChange={(newMonth, newYear) => {
                                    setMonth(newMonth)
                                    setYear(newYear)
                                }}
                            />
                        </div>
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-2.5 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <span className="text-gray-600">Legenda:</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 bg-gray-300 rounded-sm shadow-sm"></div>
                                    <span className="text-gray-700">0</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 bg-blue-400 rounded-sm shadow-sm"></div>
                                    <span className="text-gray-700">1-5</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 bg-red-400 rounded-sm shadow-sm"></div>
                                    <span className="text-gray-700">5-15</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 bg-red-700 rounded-sm shadow-sm"></div>
                                    <span className="text-gray-700">15+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full rounded-xl overflow-hidden border border-gray-300 shadow-lg ring-1 ring-black/5">
                        <DynamicMap year={year} month={month}/>
                    </div>

                    <div className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 shadow-sm">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-blue-700">Dica:</span> Clique em qualquer município no mapa para visualizar os detalhes das ocorrências.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page