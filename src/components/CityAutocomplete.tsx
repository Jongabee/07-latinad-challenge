import React, { useState, useRef } from "react";
import { AutoComplete } from "antd";
import axios from "axios";
import { debounce } from "lodash";

interface ICityAutocompleteProps {
  onSelect: (value: string) => void;
}

interface ICityResponse {
  display_name: string;
  lat: string;
  lon: string;
}

interface IOption {
  value: string;
  label: string;
}

const CityAutocomplete: React.FC<ICityAutocompleteProps> = ({ onSelect }) => {
  const [options, setOptions] = useState<IOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const searchCity = async (value: string) => {
    if (value.length > 2) {
      setIsLoading(true);
      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await axios.get<ICityResponse[]>(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: value,
              format: "json",
              addressdetails: 1,
              limit: 5,
            },
            signal: abortController.signal,
          }
        );

        const results: IOption[] = response.data.map((item) => ({
          value: item.display_name,
          label: item.display_name,
        }));

        setOptions(results);
      } catch (error: unknown) {
        if (axios.isCancel(error)) {
          console.log("Solicitud cancelada");
        } else {
          console.error("Error fetching city suggestions:", error);
          setError(
            "Hubo un problema al cargar las ciudades. Intente de nuevo."
          );
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setOptions([]);
    }
  };

  const debouncedSearchCity = debounce(searchCity, 300);

  const handleSearch = (value: string) => {
    debouncedSearchCity(value);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <AutoComplete
        style={{ width: "100%" }}
        options={options}
        onSearch={handleSearch}
        onSelect={handleSelect}
        placeholder="Ingrese la ciudad o zona"
      />
      {isLoading && (
        <div style={{ marginTop: 4, fontSize: 12, color: "gray" }}>
          Cargando...
        </div>
      )}
      {error && (
        <div style={{ marginTop: 4, fontSize: 12, color: "red" }}>{error}</div>
      )}
    </div>
  );
};

export default CityAutocomplete;
