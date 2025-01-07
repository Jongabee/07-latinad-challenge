import React from "react";
import { Input, Button } from "antd";

interface FiltersProps {
  nameFilter: string;
  setNameFilter: React.Dispatch<React.SetStateAction<string>>;
  sizeTypeFilter: string | null;
  setSizeTypeFilter: React.Dispatch<React.SetStateAction<string | null>>;
  priceFilter: string | null;
  setPriceFilter: React.Dispatch<React.SetStateAction<string | null>>;
  locationTypeFilter: string | null;
  setLocationTypeFilter: React.Dispatch<React.SetStateAction<string | null>>;
}

const Filters: React.FC<FiltersProps> = ({
  nameFilter,
  setNameFilter,
  sizeTypeFilter,
  setSizeTypeFilter,
  priceFilter,
  setPriceFilter,
  locationTypeFilter,
  setLocationTypeFilter,
}) => {
  const clearFilters = () => {
    setNameFilter("");
    setSizeTypeFilter(null);
    setPriceFilter(null);
    setLocationTypeFilter(null);
  };

  return (
    <div>
      <div className="py-1 gap-2">
        <Input
          type="text"
          placeholder="Buscar pantalla..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>
      <div className="bg-white p-2  rounded-lg shadow-lg mb-2">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <p className="font-semibold">Por tamaño</p>
            <label>
              <input
                type="radio"
                value="small"
                checked={sizeTypeFilter === "small"}
                onChange={() => setSizeTypeFilter("small")}
                className="mr-2"
              />
              Pequeño
            </label>
            <label>
              <input
                type="radio"
                value="medium"
                checked={sizeTypeFilter === "medium"}
                onChange={() => setSizeTypeFilter("medium")}
                className="mr-2"
              />
              Mediano
            </label>
            <label>
              <input
                type="radio"
                value="big"
                checked={sizeTypeFilter === "big"}
                onChange={() => setSizeTypeFilter("big")}
                className="mr-2"
              />
              Grande
            </label>
          </div>

          <div className="flex flex-col">
            <p className="font-semibold">Por precio</p>
            <label>
              <input
                type="radio"
                value="less_than_5"
                checked={priceFilter === "less_than_5"}
                onChange={() => setPriceFilter("less_than_5")}
                className="mr-2"
              />
              Menor a 5$
            </label>
            <label>
              <input
                type="radio"
                value="between_5_and_15"
                checked={priceFilter === "between_5_and_15"}
                onChange={() => setPriceFilter("between_5_and_15")}
                className="mr-2"
              />
              Entre 5$ y 15$
            </label>
            <label>
              <input
                type="radio"
                value="greater_than_15"
                checked={priceFilter === "greater_than_15"}
                onChange={() => setPriceFilter("greater_than_15")}
                className="mr-2"
              />
              Mayor a 15$
            </label>
          </div>

          <div className="flex flex-col">
            <p className="font-semibold">Por ubicación</p>
            <label>
              <input
                type="radio"
                value="outdoor"
                checked={locationTypeFilter === "outdoor"}
                onChange={() => setLocationTypeFilter("outdoor")}
                className="mr-2"
              />
              Exterior
            </label>
            <label>
              <input
                type="radio"
                value="indoor"
                checked={locationTypeFilter === "indoor"}
                onChange={() => setLocationTypeFilter("indoor")}
                className="mr-2"
              />
              Interior
            </label>
          </div>
          <Button onClick={clearFilters} type="default">
            Limpiar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
