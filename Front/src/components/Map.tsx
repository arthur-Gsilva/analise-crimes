'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { normalizeName } from '../utils/normalize'
import { useMemo } from 'react'

const REGION_COLORS: Record<string, string> = {
  '15+': '#990000',
  '5 a 15': '#ff6666',
  '1 a 5': '#3399ff',
  'sem ocorrências': '#cccccc',
}

type Props = {
  year: number,
  month: number
}

type GeoJsonProperties = Record<string, string | undefined>

type GeoJsonFeature = {
  properties: GeoJsonProperties
}

type GeoJsonData = {
  features: GeoJsonFeature[]
  type: 'FeatureCollection'
}

type LeafletLayer = {
  on: (event: string, callback: () => void) => void
  bindPopup: (content: string) => { openPopup: () => void }
}

const MapPernambuco = ({ year, month }: Props) => {
  const [geoJson, setGeoJson] = useState<GeoJsonData | null>(null)
  const [contagemMortes, setContagemMortes] = useState<Record<string, number>>({})
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    fetch('/geo/geojs-26-mun.json')
      .then(res => res.json())
      .then((data: GeoJsonData) => {
        data.features.forEach((f: GeoJsonFeature) => {
          const props = f.properties || {}
          const nome = props.NM_MUN || props.NM_MUNICIP || props.nome || props.NOME || props.name || props.municipio || props.NAME || ''
          f.properties._mun_norm = normalizeName(nome)
        })
        setGeoJson(data)
      })
  }, [])

  useEffect(() => {
    setCarregando(true)
    fetch(`/api/mapa-dados?ano=${year}&mes=${month}`)
      .then(res => res.json())
      .then(resposta => {
        setContagemMortes(resposta.dados || {})
        setCarregando(false)
      })
      .catch(erro => {
        console.error('Erro ao buscar dados do mapa:', erro)
        setContagemMortes({})
        setCarregando(false)
      })
  }, [year, month])

  function estilizarFeature(feature?: GeoJsonFeature) {
    const props = feature?.properties || {}
    const mortes = contagemMortes[props._mun_norm || ''] || 0

    let corPreenchimento = '#cccccc'
    if (mortes >= 1 && mortes <= 5) corPreenchimento = '#3399ff'
    else if (mortes > 5 && mortes < 15) corPreenchimento = '#ff6666'
    else if (mortes >= 15) corPreenchimento = '#990000'

    return {
      color: '#222222',
      weight: 0.6,
      fillColor: corPreenchimento,
      fillOpacity: 0.7,
    }
  }

  function aoClicarFeature(feature: GeoJsonFeature, layer: LeafletLayer) {
    const props = feature?.properties || {}
    const nome = props._mun_norm ? props._mun_norm.charAt(0).toUpperCase() + props._mun_norm.slice(1) : props.name || '---'
    layer.on('click', () => {
      const mortes = contagemMortes[props._mun_norm || ''] || 0
      layer.bindPopup(`<strong>${nome}</strong><br/>Mortes no mês: ${mortes}`).openPopup()
    })
  }

  const chaveGeoJson = useMemo(() => {
    const hash = Object.keys(contagemMortes).length
    return `${year}-${month}-${hash}`
  }, [year, month, contagemMortes])

  if (!geoJson) return <div className="flex items-center justify-center h-full text-gray-600">Carregando malha de Pernambuco...</div>

  if (carregando) return <div className="flex items-center justify-center h-full text-gray-600">Carregando dados...</div>

  return (
    <div className="h-full w-full">
      <MapContainer center={[-8.5, -37.5]} zoom={8} style={{ height: '100%', width: '100%' }} minZoom={6}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors & CARTO'
        />
        <GeoJSON key={chaveGeoJson} data={geoJson as never} style={estilizarFeature} onEachFeature={aoClicarFeature} />
        <Legenda />
      </MapContainer>
    </div>
  )
}

const Legenda: React.FC = () => {
  const mapa = useMap()
  useEffect(() => {
    const controle = new L.Control({ position: 'bottomright' })
    controle.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend')
      let conteudo = '<strong>Gravidade</strong><br/>'
      for (const [categoria, cor] of Object.entries(REGION_COLORS)) {
        conteudo += `<i style="background:${cor}; width:18px; height:12px; display:inline-block; margin-right:8px;"></i>${categoria}<br/>`
      }
      div.innerHTML = conteudo
      return div
    }
    controle.addTo(mapa)
    return () => {
      controle.remove()
    }
  }, [mapa])
  return null
}

export default MapPernambuco
