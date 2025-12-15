'use client';

import React, { useEffect, useState } from 'react';

type Municipio = {
  id: number;
  nome: string;
};

type MunicipiosSelectProps = {
  onSelect: (municipio: Municipio) => void;
};

const MunicipiosSelect: React.FC<MunicipiosSelectProps> = ({ onSelect }) => {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/26/municipios');
        const data = await response.json();
        setMunicipios(data);
      } catch (error) {
        console.error('Erro ao buscar municípios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const selectedMunicipio = municipios.find(m => m.id === selectedId);
    if (selectedMunicipio) {
      onSelect(selectedMunicipio);
    }
  };

  if (loading) return <p className="text-gray-600 text-center py-3">⏳ Carregando municípios...</p>;

  return (
    <select 
      onChange={handleChange} 
      defaultValue="" 
      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 font-medium transition appearance-none cursor-pointer'
    >
      <option value="" disabled>Selecione um município</option>
      {municipios.map((municipio) => (
        <option key={municipio.id} value={municipio.id}>
          {municipio.nome}
        </option>
      ))}
    </select>
  );
};

export default MunicipiosSelect;
