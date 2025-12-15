import { jsPDF } from 'jspdf'
import { Mensagem } from '@/types/chat'

interface LinhaFormatada {
  texto: string
  tipo: 'titulo1' | 'titulo2' | 'titulo3' | 'titulo4' | 'lista' | 'normal'
  negrito?: boolean
}

function processarMarkdown(texto: string): LinhaFormatada[] {
  const linhas: LinhaFormatada[] = []
  const linhasTexto = texto.split('\n')
  
  linhasTexto.forEach(linha => {
    if (!linha.trim()) {
      linhas.push({ texto: '', tipo: 'normal' })
      return
    }
    
    if (linha.startsWith('#### ')) {
      linhas.push({ texto: linha.replace(/^####\s+/, ''), tipo: 'titulo4', negrito: true })
    } else if (linha.startsWith('### ')) {
      linhas.push({ texto: linha.replace(/^###\s+/, ''), tipo: 'titulo3', negrito: true })
    } else if (linha.startsWith('## ')) {
      linhas.push({ texto: linha.replace(/^##\s+/, ''), tipo: 'titulo2', negrito: true })
    } else if (linha.startsWith('# ')) {
      linhas.push({ texto: linha.replace(/^#\s+/, ''), tipo: 'titulo1', negrito: true })
    } else if (linha.match(/^[-*]\s+/)) {
      linhas.push({ texto: '• ' + linha.replace(/^[-*]\s+/, ''), tipo: 'lista' })
    } else {
      const textoProcessado = linha
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
      
      linhas.push({ texto: textoProcessado, tipo: 'normal' })
    }
  })
  
  return linhas
}

function quebrarTexto(doc: jsPDF, texto: string, larguraMax: number): string[] {
  const linhas: string[] = []
  const palavras = texto.split(' ')
  let linhaAtual = ''

  palavras.forEach(palavra => {
    const teste = linhaAtual ? `${linhaAtual} ${palavra}` : palavra
    const largura = doc.getTextWidth(teste)

    if (largura > larguraMax) {
      if (linhaAtual) {
        linhas.push(linhaAtual)
        linhaAtual = palavra
      } else {
        linhas.push(palavra)
      }
    } else {
      linhaAtual = teste
    }
  })

  if (linhaAtual) {
    linhas.push(linhaAtual)
  }

  return linhas
}

export function exportarConversaParaPDF(
  mensagens: Mensagem[],
  titulo: string = 'Conversa com Assistente Criminal'
) {
  const doc = new jsPDF()
  
  const margemEsquerda = 20
  const margemDireita = 20
  const margemSuperior = 20
  const larguraPagina = doc.internal.pageSize.getWidth()
  const alturaPagina = doc.internal.pageSize.getHeight()
  const larguraUtil = larguraPagina - margemEsquerda - margemDireita
  const larguraMensagem = larguraUtil * 0.7
  
  let y = margemSuperior

  const verificarNovaPagina = (alturaExtra: number) => {
    if (y + alturaExtra > alturaPagina - 20) {
      doc.addPage()
      y = margemSuperior
      return true
    }
    return false
  }

  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, larguraPagina, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Polícia Civil de Pernambuco', margemEsquerda, 15)
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text('Assistente de Análise Criminal', margemEsquerda, 25)
  
  doc.setFontSize(10)
  doc.text(new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }), margemEsquerda, 33)

  y = 50

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  const tituloLinhas = quebrarTexto(doc, titulo, larguraUtil)
  tituloLinhas.forEach(linha => {
    doc.text(linha, margemEsquerda, y)
    y += 7
  })
  
  y += 5
  doc.setLineWidth(0.5)
  doc.setDrawColor(200, 200, 200)
  doc.line(margemEsquerda, y, larguraPagina - margemDireita, y)
  y += 10

  mensagens.forEach((mensagem, index) => {
    if (mensagem.carregando) return

    const ehUsuario = mensagem.papel === 'usuario'
    const linhasFormatadas = processarMarkdown(mensagem.conteudo)
    
    verificarNovaPagina(15)
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    
    if (ehUsuario) {
      doc.setTextColor(37, 99, 235)
      doc.text('Você', margemEsquerda, y)
    } else {
      doc.setTextColor(16, 185, 129)
      doc.text('Assistente', margemEsquerda, y)
    }
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    const timestamp = mensagem.timestamp.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
    doc.text(timestamp, margemEsquerda + 25, y)
    
    y += 7

    doc.setTextColor(0, 0, 0)
    
    linhasFormatadas.forEach(linhaFormatada => {
      let tamanhoFonte = 10
      let espacoExtra = 0
      let indentacao = 0
      
      switch (linhaFormatada.tipo) {
        case 'titulo1':
          tamanhoFonte = 14
          espacoExtra = 3
          doc.setFont('helvetica', 'bold')
          break
        case 'titulo2':
          tamanhoFonte = 13
          espacoExtra = 2
          doc.setFont('helvetica', 'bold')
          break
        case 'titulo3':
          tamanhoFonte = 12
          espacoExtra = 2
          doc.setFont('helvetica', 'bold')
          break
        case 'titulo4':
          tamanhoFonte = 11
          espacoExtra = 1
          doc.setFont('helvetica', 'bold')
          break
        case 'lista':
          tamanhoFonte = 10
          indentacao = 5
          doc.setFont('helvetica', 'normal')
          break
        default:
          tamanhoFonte = 10
          doc.setFont('helvetica', 'normal')
      }
      
      doc.setFontSize(tamanhoFonte)
      
      if (!linhaFormatada.texto.trim()) {
        y += 3
        return
      }
      
      const linhasQuebradas = quebrarTexto(doc, linhaFormatada.texto, larguraMensagem - indentacao)
      
      linhasQuebradas.forEach((linha) => {
        verificarNovaPagina(8)
        
        const xBase = ehUsuario 
          ? larguraPagina - margemDireita - doc.getTextWidth(linha) - indentacao
          : margemEsquerda + 5 + indentacao
        
        doc.text(linha, xBase, y)
        y += tamanhoFonte * 0.4 + 3
      })
      
      y += espacoExtra
    })
    
    y += 5
    
    if (index < mensagens.length - 1) {
      verificarNovaPagina(5)
      doc.setDrawColor(240, 240, 240)
      doc.setLineWidth(0.3)
      doc.line(margemEsquerda, y, larguraPagina - margemDireita, y)
      y += 8
    }
  })

  const totalPaginas = doc.getNumberOfPages()
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Página ${i} de ${totalPaginas}`,
      larguraPagina / 2,
      alturaPagina - 10,
      { align: 'center' }
    )
    doc.text(
      'Documento gerado pelo Sistema de Análise Criminal - Polícia Civil de PE',
      larguraPagina / 2,
      alturaPagina - 5,
      { align: 'center' }
    )
  }

  const nomeArquivo = `conversa-${new Date().getTime()}.pdf`
  doc.save(nomeArquivo)
}
