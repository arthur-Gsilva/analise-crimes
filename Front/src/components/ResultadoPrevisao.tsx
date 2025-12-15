type ResultadoPrevisaoProps = {
    resultado: number
    municipio: string
    mes: string
    ano: string
}

export default function ResultadoPrevisao({ resultado, municipio, mes, ano }: ResultadoPrevisaoProps) {
    const nivelRisco = resultado >= 15 ? 'alto' : resultado >= 5 ? 'medio' : 'baixo'
    const corRisco = nivelRisco === 'alto' ? 'from-red-500 to-red-600' : nivelRisco === 'medio' ? 'from-orange-500 to-orange-600' : 'from-green-500 to-green-600'
    const textoRisco = nivelRisco === 'alto' ? 'Alto Risco' : nivelRisco === 'medio' ? 'Risco Moderado' : 'Baixo Risco'

    return (
        <div className={`bg-gradient-to-br ${corRisco} rounded-2xl shadow-2xl p-8 border-2 border-white/20 h-full flex flex-col justify-center`}>
            <div className="text-center space-y-4">
                
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <p className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-2">
                        Previsão
                    </p>
                    <p className="text-7xl font-black text-white drop-shadow-2xl">
                        {resultado}
                    </p>
                    <p className="text-white/90 text-lg font-medium mt-2">
                        vítimas
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between text-white/90 text-sm">
                        <span className="font-semibold">Local:</span>
                        <span className="font-bold">{municipio}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/90 text-sm">
                        <span className="font-semibold">Período:</span>
                        <span className="font-bold">{mes}/{ano}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/90 text-sm">
                        <span className="font-semibold">Nível:</span>
                        <span className="font-bold">{textoRisco}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
