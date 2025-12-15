export interface Municipio {
  id: number
  nome: string
}

export interface MunicipiosSelectProps {
  onSelect: (municipio: Municipio) => void
}