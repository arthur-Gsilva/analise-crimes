from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

modelo = joblib.load('../Modelo/modelo_random_forest.pkl')
encoder = joblib.load('../Modelo/encoder_municipio.pkl')

class PrevisaoRequest(BaseModel):
    municipio: str
    ano: int
    mes: int
    tem_jogo: int

@app.get("/municipios")
def listar_municipios():
    return {
        "municipios": list(encoder.classes_),
        "total": len(encoder.classes_)
    }

@app.post("/prever")
def prever_vitimas(dados: PrevisaoRequest):
    try:
        municipio_normalizado = dados.municipio.upper()
        
        if municipio_normalizado not in encoder.classes_:
            return {
                "error": f"Município '{dados.municipio}' não encontrado no dataset"
            }
        
        municipio_codificado = encoder.transform([municipio_normalizado])[0]
        
        entrada = pd.DataFrame({
            "MUNICIPIO_ENCODED": [municipio_codificado],
            "ANO": [dados.ano],
            "MES": [dados.mes],
            "TEM_JOGO": [dados.tem_jogo]
        })
        
        previsao = modelo.predict(entrada)[0]
        
        print(f"Previsão: {municipio_normalizado} - {dados.mes}/{dados.ano}: {previsao:.1f} vítimas")
        
        return {
            "municipio": municipio_normalizado,
            "ano": dados.ano,
            "mes": dados.mes,
            "tem_jogo": bool(dados.tem_jogo),
            "vitimas_previstas": round(previsao, 1)
        }
        
    except Exception as erro:
        print(f"Erro: {str(erro)}")
        return {"error": str(erro)}
