# Sistema de Análise Preditiva de Crimes - Pernambuco

Sistema desenvolvido para análise e previsão de criminalidade em Pernambuco utilizando dados históricos e Machine Learning.

## Sobre o Projeto

Projeto Integrador do 5º período de Análise e Desenvolvimento de Sistemas para auxiliar na análise de dados criminais de Pernambuco.

## Tecnologias

- Next.js 14 + TypeScript
- FastAPI (Python)
- PostgreSQL
- Tailwind CSS
- Leaflet (mapas)
- Recharts (gráficos)

## Funcionalidades

- Previsão de ocorrências por município
- Mapa de calor interativo
- Painéis analíticos com gráficos
- Chatbot para consultas
- Exportação de relatórios em PDF

## Instalação

### Requisitos
- Node.js 18+
- Python 3.8+
- PostgreSQL 14+

### Configuração

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/analise-preditiva-crimes-pe.git
cd analise-preditiva-crimes-pe
```

2. Configure o Frontend
```bash
cd Front
npm install
cp .env.example .env.local
```

3. Configure o Backend Python
```bash
cd python-ml
pip install -r requirements.txt
```

4. Configure o banco de dados PostgreSQL

## Executando

Backend Python:
```bash
cd python-ml
uvicorn main:app --reload
```

Frontend:
```bash
cd Front
npm run dev
```

Acesse: http://localhost:3000

## Estrutura

```
├── Front/          # Frontend Next.js
├── python-ml/      # API Python
└── Modelo/         # Modelo ML treinado
```

## Modelo de Machine Learning

- Algoritmo: Random Forest
- Acurácia: R² = 0.916
- Dados: 84.982 registros (2004-2025)

## Autores

Projeto Integrador - 5º Período ADS
