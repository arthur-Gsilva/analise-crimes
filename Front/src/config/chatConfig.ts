import OpenAI from 'openai'

export const OPENAI_MODEL = 'gpt-4o'
export const OPENAI_TIMEOUT_MS = 60000

export const SYSTEM_PROMPT = `Você é o Assistente de Análise Criminal da Polícia Civil de Pernambuco.

SUAS CAPACIDADES:
- Consultar dados históricos de crimes (Janeiro/2004 a Outubro/2025) - DADOS REAIS
- Fazer previsões usando modelo de Machine Learning APENAS para períodos APÓS Outubro/2025
- Comparar municípios e regiões
- Identificar tendências e padrões
- Analisar impacto de jogos do Brasileirão nos índices usando a função analisar_impacto_jogos

REGRAS CRÍTICAS - LEIA COM ATENÇÃO:
1. NUNCA INVENTE NÚMEROS - use APENAS dados retornados pelas funções
2. Se você não chamou uma função para obter um dado, NÃO PODE usar esse dado na resposta
3. Para dados de Janeiro/2004 até Outubro/2025, use SEMPRE consultar_estatisticas
4. Para previsões APÓS Outubro/2025, use fazer_previsao
5. NUNCA apresente números que não vieram de uma função - isso é PROIBIDO
6. Se precisar comparar períodos, chame as funções para AMBOS os períodos
7. Responda APENAS sobre análise criminal de Pernambuco
8. Se perguntarem sobre outros assuntos, diga: "Sou especializado apenas em análise de dados criminais de Pernambuco"

PROIBIÇÃO ABSOLUTA:
- NUNCA apresente dados que você não obteve via função
- Se não chamou consultar_estatisticas para um período, NÃO PODE mostrar dados desse período
- Se não chamou fazer_previsao para um mês, NÃO PODE mostrar previsão desse mês
- Inventar dados é uma FALHA GRAVE que compromete a confiabilidade do sistema

IMPORTANTE: 2024 e Janeiro-Outubro/2025 TÊM DADOS REAIS NO BANCO. Use consultar_estatisticas para obtê-los!

FORMATO DAS RESPOSTAS:
- Use linguagem clara e profissional
- Apresente números com contexto
- Use markdown simples: **negrito**, listas com -, e ### para títulos

PROIBIÇÃO DE LATEX (CRÍTICO):
- NUNCA use \[ \] ou \( \) ou \frac ou \left ou \right ou qualquer notação LaTeX
- NUNCA mostre fórmulas matemáticas - mostre apenas o RESULTADO
- Exemplo ERRADO: \[\left(\frac{1057 - 755}{1057}\right) \times 100\]
- Exemplo CORRETO: "Redução de 28.58%"
- Se precisar mostrar um cálculo, use texto simples: "(1057 - 755) / 1057 = 28.58%"

REGRAS PARA ANÁLISE DE CRESCIMENTO:
- Mostre apenas o RESULTADO percentual, não a fórmula
- Exemplo: "Agreste: redução de 28.58%" (NÃO mostre a fórmula)

REGRAS PARA PREVISÕES (CRÍTICO):
- O modelo ML prevê vítimas POR MÊS, não por ano
- SEMPRE especifique qual mês está sendo previsto (ex: "Janeiro/2026: 8.9 vítimas")
- Se pedirem previsão anual, faça 12 previsões (uma por mês) e some ou mostre a média mensal
- Mencione a margem de erro (MAE ≈ 1.2 vítimas)

REGIÕES DISPONÍVEIS: Agreste, Sertão, Zona da Mata, Região Metropolitana, Capital
PERÍODO DE DADOS REAIS NO BANCO: Janeiro/2004 a Outubro/2025`

export const ferramentas: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "consultar_estatisticas",
      description: "Busca estatísticas de crimes no banco de dados de Pernambuco. Use esta função para consultar dados de um MUNICÍPIO ESPECÍFICO ou região. Para calcular variação percentual de um município, chame esta função duas vezes (uma para cada ano) e calcule a diferença.",
      parameters: {
        type: "object",
        properties: {
          municipio: {
            type: "string",
            description: "Nome do município específico (ex: RECIFE, CARUARU, PETROLINA). Use para consultar dados de UM município."
          },
          regiao: {
            type: "string",
            description: "Região geográfica (AGRESTE, SERTÃO, ZONA DA MATA, REGIÃO METROPOLITANA, CAPITAL). Use apenas se não especificar município."
          },
          anoInicio: {
            type: "integer",
            description: "Ano inicial do período (2004-2025). Para consultar um ano específico, use o mesmo valor em anoInicio e anoFim."
          },
          anoFim: {
            type: "integer",
            description: "Ano final do período (2004-2025). Para consultar um ano específico, use o mesmo valor em anoInicio e anoFim."
          },
          agruparPor: {
            type: "string",
            enum: ["ano", "mes", "municipio", "regiao", "genero"],
            description: "Como agrupar os resultados. Use 'ano' para ver evolução anual."
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "fazer_previsao",
      description: "Usa o modelo de Machine Learning para prever número de vítimas. ATENÇÃO: Use APENAS para períodos FUTUROS (após Outubro/2025). Para dados de 2004-2025, use consultar_estatisticas.",
      parameters: {
        type: "object",
        properties: {
          municipio: {
            type: "string",
            description: "Nome do município para previsão"
          },
          mes: {
            type: "integer",
            minimum: 1,
            maximum: 12,
            description: "Mês da previsão (1-12)"
          },
          ano: {
            type: "integer",
            minimum: 2025,
            description: "Ano da previsão (use apenas para Novembro/2025 em diante ou 2026+)"
          },
          temJogo: {
            type: "boolean",
            description: "Se há jogo do Brasileirão no período"
          }
        },
        required: ["municipio", "mes", "ano", "temJogo"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "listar_municipios",
      description: "Lista todos os municípios disponíveis no sistema",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "analisar_impacto_jogos",
      description: "Analisa o impacto dos jogos do Brasileirão nos índices de criminalidade em Recife, comparando meses COM jogos de times de PE (Sport, Náutico, Santa Cruz) versus meses SEM jogos",
      parameters: {
        type: "object",
        properties: {
          anoInicio: {
            type: "integer",
            description: "Ano inicial da análise (2004-2025)"
          },
          anoFim: {
            type: "integer",
            description: "Ano final da análise (2004-2025)"
          },
          time: {
            type: "string",
            description: "Time específico para analisar (Sport, Nautico, Santa Cruz). Se não informado, analisa todos os times de PE."
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "calcular_crescimento",
      description: "Retorna um RANKING dos municípios com maior crescimento em uma REGIÃO. Use APENAS quando perguntarem 'quais municípios tiveram maior crescimento em [região]'. Para consultar crescimento de um MUNICÍPIO ESPECÍFICO (ex: Caruaru), use consultar_estatisticas duas vezes e calcule a diferença.",
      parameters: {
        type: "object",
        properties: {
          regiao: {
            type: "string",
            description: "Região geográfica para fazer o ranking (AGRESTE, SERTÃO, ZONA DA MATA, REGIÃO METROPOLITANA, CAPITAL)"
          },
          anoInicial: {
            type: "integer",
            description: "Ano inicial para comparação (ex: 2018)"
          },
          anoFinal: {
            type: "integer",
            description: "Ano final para comparação (ex: 2024 ou 2025)"
          },
          limite: {
            type: "integer",
            description: "Quantidade de municípios a retornar (padrão: 3)"
          }
        },
        required: ["regiao", "anoInicial", "anoFinal"]
      }
    }
  }
]
