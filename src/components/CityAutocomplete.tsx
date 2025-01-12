import React, { useState, useRef } from 'react';
import { AutoComplete } from 'antd';
import axios from 'axios';
import { debounce } from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';

interface ICityAutocompleteProps {
  onSelect: (value: string) => void;
}

interface ICityResponse {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    country: string;
  };
}

interface IOption {
  value: string;
  label: React.ReactNode;
}

const allowedCountries = [
  'Argentina',
  'Perú',
  'Ecuador',
  'Colombia',
  'Chile',
  'Costa Rica',
  'El Salvador',
  'Guatemala',
  'Honduras',
  'Nicaragua',
  'Panamá',
];

const CityAutocomplete: React.FC<ICityAutocompleteProps> = ({ onSelect }) => {
  const [options, setOptions] = useState<IOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, IOption[]>>(new Map());

  const highlightMatch = (text: string, search: string) => {
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  };

  const searchCity = async (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      setOptions([]);
      return;
    }

    if (cacheRef.current.has(trimmedValue)) {
      setOptions(cacheRef.current.get(trimmedValue)!);
      return;
    }

    setIsLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await axios.get<ICityResponse[]>(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: trimmedValue,
            format: 'json',
            addressdetails: 1,
            limit: 5,
          },
          signal: abortController.signal,
        },
      );

      const filteredResults: IOption[] = response.data
        .filter(
          (item) =>
            item.address && allowedCountries.includes(item.address.country),
        )
        .map((item) => ({
          value: item.display_name,
          label: (
            <span
              dangerouslySetInnerHTML={{
                __html: highlightMatch(item.display_name, trimmedValue),
              }}
            />
          ),
        }));

      cacheRef.current.set(trimmedValue, filteredResults);

      setOptions(filteredResults);
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.log('Solicitud cancelada');
      } else {
        console.error('Error fetching city suggestions:', error);
        setError('Hubo un problema al cargar las ciudades. Intente de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearchCity = debounce(searchCity, 500);

  const handleSearch = (value: string) => {
    debouncedSearchCity(value);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <AutoComplete
        style={{ width: '100%' }}
        options={options}
        onSearch={handleSearch}
        onSelect={handleSelect}
        placeholder={isLoading ? 'Buscando...' : 'Ingrese la ciudad o zona'}
        suffixIcon={isLoading ? <LoadingOutlined /> : null}
      />
      {error && (
        <div style={{ marginTop: 4, fontSize: 12, color: 'red' }}>{error}</div>
      )}
    </div>
  );
};

export default CityAutocomplete;
