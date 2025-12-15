'use client'

import { useState } from "react"
import MunicipiosSelect from "./municipioSelect"

type PrevisaoFormProps = {
    onPrevisao: (resultado: number, dados: { municipio: string; mes: string; ano: string; tem_jogo: boolean }) => void
}

export default function PrevisaoForm({ onPrevisao }: PrevisaoFormProps) {
    const [municipio, setMunicipio] = useState<{ id: number; nome: string } | null>(null)
    const [mes, setMes] = useState("")
    const [ano, setAno] = useState("")
    const [game, setGame] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!municipio || !mes || !ano || game === null) {
            alert("Preencha todos os campos obrigatórios")
            return
        }

        setLoading(true)

        try {
            const payload = {
                municipio: municipio.nome,
                ano: parseInt(ano),
                mes: parseInt(mes),
                tem_jogo: game ? 1 : 0
            }

            console.log('Enviando para API:', JSON.stringify(payload, null, 2))

            const response = await fetch('http://localhost:8000/prever', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            console.log('Status da resposta:', response.status)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Erro da API:', errorText)
                alert(`Erro na API: ${response.status}`)
                setLoading(false)
                return
            }

            const data = await response.json()
            
            console.log('Resposta da API:', JSON.stringify(data, null, 2))
            console.log('vitimas_previstas:', data.vitimas_previstas)
            console.log('Tipo:', typeof data.vitimas_previstas)
            
            if (data.error) {
                console.log('Tem erro na resposta')
                alert(`Erro: ${data.error}`)
                setLoading(false)
                return
            }

            if (data.vitimas_previstas === undefined || data.vitimas_previstas === null) {
                console.error('vitimas_previstas não existe:', data)
                alert('Resposta inválida da API')
                setLoading(false)
                return
            }

            console.log('Tudo OK, chamando onPrevisao com:', data.vitimas_previstas)
            
            onPrevisao(data.vitimas_previstas, { 
                municipio: municipio.nome, 
                mes, 
                ano,
                tem_jogo: game 
            })

            console.log('onPrevisao executado!')
            setLoading(false)
            console.log('Loading desativado!')

            console.log('Salvando no banco...')
            fetch('/api/ocorrencias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jogo: game ? 'T' : 'F',
                    genero: 'N/A',
                    resposta_modelo: `${data.vitimas_previstas}`,
                    municipio: municipio.nome
                })
            }).then(() => console.log('Salvo no banco')).catch(err => console.error('Erro ao salvar:', err))

        } catch (erro) {
            console.error('Erro na previsão:', erro)
            alert("Erro ao conectar com o servidor. Verifique se a API está rodando.")
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                    Município
                </label>
                <MunicipiosSelect onSelect={setMunicipio} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Mês
                    </label>
                    <input 
                        type="number"
                        min="1"
                        max="12"
                        value={mes}
                        onChange={(e) => setMes(e.target.value)}
                        placeholder="1-12"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 font-medium transition"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Ano
                    </label>
                    <input 
                        type="number"
                        min="2020"
                        max="2030"
                        value={ano}
                        onChange={(e) => setAno(e.target.value)}
                        placeholder="2026"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 font-medium transition"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                    Jogo do Brasileirão
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setGame(true)}
                        className={`p-4 rounded-xl border-2 font-bold transition-all ${
                            game === true 
                                ? 'bg-green-500 border-green-600 text-white shadow-lg scale-105' 
                                : 'bg-white border-gray-300 text-gray-700 hover:border-green-400'
                        }`}
                    >
                        Sim
                    </button>

                    <button
                        type="button"
                        onClick={() => setGame(false)}
                        className={`p-4 rounded-xl border-2 font-bold transition-all ${
                            game === false 
                                ? 'bg-red-500 border-red-600 text-white shadow-lg scale-105' 
                                : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                    >
                        Não
                    </button>
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
                {loading ? 'Calculando...' : 'Gerar Previsão'}
            </button>
        </form>
    )
}
