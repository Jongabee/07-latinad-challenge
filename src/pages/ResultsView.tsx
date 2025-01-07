import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Spin, Empty, Pagination } from 'antd';
import { AppDispatch, RootState } from '../redux/store';
import DisplayList from '../components/DisplayList';
import DisplayMap from '../components/DisplayMap';
import {
  searchCampaign,
  updateSearchParams,
} from '../redux/campaign/campaignSlice';
import Filters from '../components/Filters';

const ResultsView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { displays, loading, error, searchParams, pagination } = useSelector(
    (state: RootState) => state.campaign,
  );

  const [nameFilter, setNameFilter] = useState<string>('');
  const [sizeTypeFilter, setSizeTypeFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [locationTypeFilter, setLocationTypeFilter] = useState<string | null>(
    null,
  );

  const [isMapHovered, setIsMapHovered] = useState<boolean>(false);
  const [filtersVisible] = useState<boolean>(true);

  useEffect(() => {
    if (displays.length === 0 && !loading && !error) {
      navigate('/');
    }
  }, [displays, loading, error, navigate]);

  const handlePageChange = (page: number, pageSize?: number) => {
    const updatedParams = {
      ...searchParams,
      page: page,
      per_page: pageSize || searchParams.per_page,
    };

    dispatch(updateSearchParams(updatedParams));
    dispatch(searchCampaign(updatedParams));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (displays.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Empty description="No se encontraron resultados" />
      </div>
    );
  }

  const filteredDisplays = displays.filter((display) => {
    const matchesNameFilter =
      display.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
      display.formatted_address
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

    const matchesSizeFilter = sizeTypeFilter
      ? display.size_type === sizeTypeFilter
      : true;

    const matchesPriceFilter = priceFilter
      ? priceFilter === 'less_than_5'
        ? display.price_per_day < 5
        : priceFilter === 'between_5_and_15'
          ? display.price_per_day >= 5 && display.price_per_day <= 15
          : display.price_per_day > 15
      : true;

    const matchesLocationFilter = locationTypeFilter
      ? display.location_type === locationTypeFilter
      : true;

    return (
      matchesNameFilter &&
      matchesSizeFilter &&
      matchesPriceFilter &&
      matchesLocationFilter
    );
  });

  return (
    <div className="relative h-screen flex">
      <div
        className={`absolute top-0 left-0 h-full bg-white shadow-lg z-20 transition-all duration-300 ease-in-out overflow-y-auto 
          ${isMapHovered ? 'w-1/4' : 'w-1/2'}`}
        style={{ transitionProperty: 'width' }}
      >
        <div>
          <div className="text-blue-400 text-center font-bold flex items-center">
            <div className="flex-grow border-t border-blue-400"></div>
            <span className="px-4">
              Se han encontrado {pagination.total} pantallas
            </span>
            <div className="flex-grow border-t border-blue-400"></div>
          </div>
          {!isMapHovered && filtersVisible && (
            <Filters
              nameFilter={nameFilter}
              setNameFilter={setNameFilter}
              sizeTypeFilter={sizeTypeFilter}
              setSizeTypeFilter={setSizeTypeFilter}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              locationTypeFilter={locationTypeFilter}
              setLocationTypeFilter={setLocationTypeFilter}
            />
          )}
          <div className="max-h-68 overflow-y-auto overflow-x-hidden">
            <DisplayList
              displays={filteredDisplays}
              pagination={pagination}
              onPageChange={handlePageChange}
              isMapHovered={isMapHovered}
            />
          </div>
          <div className="py-2 flex justify-center">
            <Pagination
              current={pagination.current_page}
              total={pagination.total}
              pageSize={pagination.per_page}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      <div
        className="h-full w-3/4 ml-auto relative z-0"
        onMouseEnter={() => setIsMapHovered(true)}
        onMouseLeave={() => setIsMapHovered(false)}
      >
        <DisplayMap displays={filteredDisplays} />
      </div>
    </div>
  );
};

export default ResultsView;
