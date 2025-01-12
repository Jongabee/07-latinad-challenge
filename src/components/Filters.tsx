import React, { useState } from 'react';
import { Input, Button, Radio, Collapse, Space } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
} from '@ant-design/icons';

const { Panel } = Collapse;

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
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);

  const clearFilters = () => {
    setNameFilter('');
    setSizeTypeFilter(null);
    setPriceFilter(null);
    setLocationTypeFilter(null);
    setActiveKey(undefined);
  };

  const onInnerCollapseChange = (key: string | string[]) => {
    if (typeof key === 'string') {
      setActiveKey((prevKey) => (prevKey === key ? undefined : key));
    } else {
      setActiveKey(undefined);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Space direction="vertical" size="middle" className="w-full">
        <Input
          size="large"
          placeholder="Buscar pantalla..."
          prefix={<SearchOutlined />}
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-full"
        />

        <Collapse
          expandIcon={({ isActive }) => (
            <DownOutlined rotate={isActive ? 180 : 0} />
          )}
        >
          <Panel
            header={
              <span className="font-semibold">
                <FilterOutlined className="mr-2" />
                Más filtros
              </span>
            }
            key="1"
          >
            <Collapse activeKey={activeKey} onChange={onInnerCollapseChange}>
              <Panel header="Por tamaño" key="size">
                <Radio.Group
                  value={sizeTypeFilter}
                  onChange={(e) => setSizeTypeFilter(e.target.value)}
                  className="flex flex-col space-y-2"
                >
                  <Radio value="small">Pequeño</Radio>
                  <Radio value="medium">Mediano</Radio>
                  <Radio value="big">Grande</Radio>
                </Radio.Group>
              </Panel>
              <Panel header="Por precio" key="price">
                <Radio.Group
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="flex flex-col space-y-2"
                >
                  <Radio value="less_than_5">Menor a 5$</Radio>
                  <Radio value="between_5_and_15">Entre 5$ y 15$</Radio>
                  <Radio value="greater_than_15">Mayor a 15$</Radio>
                </Radio.Group>
              </Panel>
              <Panel header="Por ubicación" key="location">
                <Radio.Group
                  value={locationTypeFilter}
                  onChange={(e) => setLocationTypeFilter(e.target.value)}
                  className="flex flex-col space-y-2"
                >
                  <Radio value="outdoor">Exterior</Radio>
                  <Radio value="indoor">Interior</Radio>
                </Radio.Group>
              </Panel>
            </Collapse>

            <div className="mt-4">
              <Button
                onClick={clearFilters}
                type="default"
                size="middle"
                className="bg-blue-500 text-white hover:bg-blue-600 border-none w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </Panel>
        </Collapse>
      </Space>
    </div>
  );
};

export default Filters;
