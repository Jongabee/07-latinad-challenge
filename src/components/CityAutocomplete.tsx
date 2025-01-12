import React, { useState, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';
import Input from './ui/input';

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
  label: string;
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
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<IOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, IOption[]>>(new Map());

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
          label: item.display_name,
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
    setInputValue(value);
    debouncedSearchCity(value);
  };

  const handleSelect = (value: string) => {
    setInputValue(value);
    setOptions([]);
    onSelect(value);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Input
        name="city"
        value={inputValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Ingrese la ciudad o zona"
      />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#ccc',
          }}
        >
          <LoadingOutlined className="text-blue-500 text-lg" />
        </div>
      )}
      <ul
        style={{
          position: 'absolute',
          zIndex: 1000,
          background: 'white',
          width: '100%',
          border: '1px solid #ddd',
          marginTop: 4,
          listStyleType: 'none',
          padding: 0,
        }}
      >
        {isLoading && (
          <li
            style={{
              padding: 8,
              color: '#666',
              cursor: 'default',
              borderBottom: '1px solid #eee',
            }}
          >
            Cargando...
          </li>
        )}

        {!isLoading &&
          options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              style={{
                padding: 8,
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              {option.label}
            </li>
          ))}
      </ul>
      {error && (
        <div style={{ marginTop: 4, fontSize: 12, color: 'red' }}>{error}</div>
      )}
    </div>
  );
};

export default CityAutocomplete;
