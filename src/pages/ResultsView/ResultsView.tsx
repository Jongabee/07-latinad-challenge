import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Spin, Empty, Pagination, Badge, Drawer } from 'antd';
import { AppDispatch, RootState } from '../../redux/store';
import DisplayList from '../../components/DisplayList';
import DisplayMap from '../../components/DisplayMap';
import {
  fetchCampaignStart,
  updateSearchParams,
} from '../../redux/campaign/campaignSlice';
import Filters from '../../components/Filters';
import { CaretRightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Cart from '../../components/Cart';
import { budgetPdf } from '../../utils/BudgetPDF';
import { useNumberOfDays } from '../../hooks/useNumberOfDays';
import { useMediaQuery } from 'react-responsive';
import './ResultsView.css';

const ResultsView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { displays, loading, error, searchParams, pagination } = useSelector(
    (state: RootState) => state.campaign,
  );
  const { items } = useSelector((state: RootState) => state.cart);

  const [nameFilter, setNameFilter] = useState<string>('');
  const [sizeTypeFilter, setSizeTypeFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [locationTypeFilter, setLocationTypeFilter] = useState<string | null>(
    null,
  );

  const [isMapHovered, setIsMapHovered] = useState<boolean>(false);
  const [filtersVisible] = useState<boolean>(true);
  const [isCartVisible, setIsCartVisible] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const numberOfDays = useNumberOfDays();

  const isMobile = useMediaQuery({ maxWidth: 768 });

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
    dispatch(fetchCampaignStart(updatedParams));
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
  const handleCartClick = () => {
    setIsCartVisible(true);
  };
  const handleCloseCart = () => {
    setIsCartVisible(false);
  };

  const handleDrawerOpen = () => {
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };
  const handleDownloadPdf = () => {
    if (items.length > 0 && searchParams.date_from && searchParams.date_to) {
      budgetPdf(items, numberOfDays, {
        dateFrom: searchParams.date_from,
        dateTo: searchParams.date_to,
      });
    }
  };
  console.log(handleDownloadPdf, 'handleDownloadPdf');

  return (
    <div className="relative h-screen flex">
      {isMobile && <CaretRightOutlined onClick={handleDrawerOpen} />}

      {!isMobile && (
        <div
          className={`absolute top-0 left-0 h-full bg-white shadow-lg z-20 transition-all duration-300 ease-in-out overflow-y-auto 
          ${isMapHovered ? 'w-1/4' : 'w-1/2'}`}
          style={{ transitionProperty: 'width' }}
        >
          <div>
            <div className="flex justify-between items-center px-4 py-2 fixed h-full relative ">
              <img src="/latinAd1.svg" alt="Logo" className="logo" />
              <div>
                <Badge
                  count={items.length}
                  offset={[-10, 10]}
                  onClick={handleCartClick}
                  style={{
                    backgroundColor: 'rgba(24, 144, 255, 0.5)',
                    color: 'white',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: -4,
                    right: 0,
                  }}
                >
                  <ShoppingCartOutlined
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                  />
                </Badge>
              </div>
            </div>
            <div className="text-blue-400 text-center font-bold flex items-center">
              <div className="flex-grow border-t border-blue-400"></div>
              <span className="px-4 text-xs">
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
      )}
      <Drawer
        placement="left"
        closable={true}
        open={drawerVisible}
        onClose={handleDrawerClose}
        width="100%"
        styles={{
          body: {
            padding: 0,
            margin: 0,
          },
        }}
      >
        <div className="flex justify-between items-center px-4 py-2 relative">
          <img src="/latinAd1.svg" alt="Logo" className="logo" />
          <Badge
            count={items.length}
            offset={[-10, 10]}
            onClick={handleCartClick}
            style={{
              backgroundColor: 'rgba(24, 144, 255, 0.5)',
              color: 'white',
              boxShadow: 'none',
              cursor: 'pointer',
              position: 'absolute',
              top: -4,
              right: 0,
            }}
          >
            <ShoppingCartOutlined
              style={{ fontSize: '24px', cursor: 'pointer' }}
            />
          </Badge>
        </div>
        <div className="py-2">
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
          <DisplayList
            displays={filteredDisplays}
            pagination={pagination}
            onPageChange={handlePageChange}
            isMapHovered={isMapHovered}
          />
          <Pagination
            current={pagination.current_page}
            total={pagination.total}
            pageSize={pagination.per_page}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </Drawer>

      <div
        className="map-container"
        onMouseEnter={() => setIsMapHovered(true)}
        onMouseLeave={() => setIsMapHovered(false)}
      >
        <DisplayMap displays={filteredDisplays} />
      </div>
      <Cart
        open={isCartVisible}
        onClose={handleCloseCart}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
};

export default ResultsView;
