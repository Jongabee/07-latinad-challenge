import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Tabs, Typography, Space, Button } from 'antd';
import {
  EnvironmentOutlined,
  DollarOutlined,
  ColumnWidthOutlined,
  PictureOutlined,
  InfoCircleOutlined,
  FieldTimeOutlined,
  GlobalOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IDisplay } from '../types';
import useCustomNotification from '../hooks/useCustomNotification';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { addItemToCart } from '../redux/cart/cartSlice';

const { Paragraph } = Typography;
const { TabPane } = Tabs;

interface IDisplayDetailsProps {
  display: IDisplay;
}

const DisplayDetails: React.FC<IDisplayDetailsProps> = ({ display }) => {
  const [activeTab, setActiveTab] = useState('1');
  const { openNotification, contextHolder } = useCustomNotification();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   if (activeTab === '3' && mapRef.current && !leafletMapRef.current) {
  //     leafletMapRef.current = L.map(mapRef.current).setView(
  //       [display.latitude, display.longitude],
  //       15,
  //     );

  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution:
  //         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //     }).addTo(leafletMapRef.current);

  //     L.marker([display.latitude, display.longitude])
  //       .addTo(leafletMapRef.current)
  //       .bindPopup(
  //         `
  //         <strong>${display.name}</strong><br />
  //         ${display.formatted_address}<br />
  //         Precio: ${display.price_converted}  /día
  //       `,
  //       )
  //       .openPopup();
  //   }
  // }, [activeTab, display]);
  useEffect(() => {
    if (activeTab === '3' && mapRef.current) {
      if (!leafletMapRef.current) {
        leafletMapRef.current = L.map(mapRef.current).setView(
          [display.latitude, display.longitude],
          15,
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(leafletMapRef.current);

        L.marker([display.latitude, display.longitude])
          .addTo(leafletMapRef.current)
          .bindPopup(
            `
            <strong>${display.name}</strong><br />
            ${display.formatted_address}<br />
            Precio: ${display.price_converted}  /día
          `,
          )
          .openPopup();
      } else {
        leafletMapRef.current.invalidateSize();
      }
    }
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [activeTab, display]);
  const handleAddToCart = (display: IDisplay) => {
    const isItemInCart = JSON.parse(localStorage.getItem('cart') || '[]').some(
      (item: { name: string }) => item.name === display.name,
    );
    if (isItemInCart) {
      openNotification(
        'bottomRight',
        'Ítem duplicado',
        `El ítem "${display.name}" ya está en el carrito.`,
        { tailwindClass: 'bg-red-300 rounded-md text-gray-50' },
      );
    } else {
      dispatch(addItemToCart(display));

      openNotification(
        'bottomRight',
        'Ítem agregado',
        `El ítem "${display.name}" fue agregado al carrito.`,
        { tailwindClass: 'bg-green-200 rounded-md text-gray-50' },
      );
    }
  };
  return (
    <>
      {contextHolder}
      <div className="container mx-auto px-4">
        <h1 className="text-center text-blue-400 font-bold text-lg">
          {display.name}
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="bg-white p-2 rounded-lg shadow-lg overflow-hidden">
              <Carousel autoplay dots={true} effect="fade">
                {display.pictures &&
                  display.pictures.map((picture, index) => (
                    <div key={index} className="relative h-full">
                      <img
                        src={picture.url}
                        alt={`${display.name} - ${index + 1}`}
                        className="w-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                        {index + 1} / {display.pictures.length}
                      </div>
                    </div>
                  ))}
              </Carousel>
              <div className="m-3">
                <Paragraph>{display.description}</Paragraph>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              type="card"
              className="bg-white rounded-lg shadow-lg p-2 "
            >
              <TabPane
                tab={
                  <span>
                    <InfoCircleOutlined /> Detalles
                  </span>
                }
                key="1"
              >
                <Space direction="vertical" size="middle" className="w-full">
                  <InfoItem
                    icon={<PictureOutlined />}
                    label="Resolución"
                    value={`${display.resolution_width}x${display.resolution_height}`}
                  />
                  <InfoItem
                    icon={<EnvironmentOutlined />}
                    label="Ubicación"
                    value={display.formatted_address}
                  />
                  <InfoItem
                    icon={<DollarOutlined />}
                    label="Precio por día"
                    value={`$${display.price_converted.toFixed(2)} `}
                  />
                  <InfoItem
                    icon={<EnvironmentOutlined />}
                    label="Tipo"
                    value={display.location_type}
                  />
                </Space>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <ColumnWidthOutlined /> Tamaño
                  </span>
                }
                key="2"
              >
                <Space direction="vertical" size="middle" className="w-full">
                  <InfoItem
                    icon={<ColumnWidthOutlined />}
                    label="Tamaño"
                    value={`${display.size_width}m x ${display.size_height}m (${display.size_type})`}
                  />
                  <InfoItem
                    icon={<InfoCircleOutlined />}
                    label="Espacios disponibles"
                    value={display.slots.toString()}
                  />
                  <InfoItem
                    icon={<FieldTimeOutlined />}
                    label="Duración de cada espacio"
                    value={`${display.slot_length / 1000} segundos`}
                  />
                  <InfoItem
                    icon={<FieldTimeOutlined />}
                    label="Shows por hora"
                    value={display.shows_per_hour.toFixed(2)}
                  />
                </Space>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <GlobalOutlined /> Mapa
                  </span>
                }
                key="3"
              >
                <div
                  ref={mapRef}
                  className="h-[300px] w-full mt-3 rounded-lg shadow-md"
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <Button
          className="bg-blue-500 text-white  border-none w-full mt-2"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(display);
          }}
        >
          <p>Agregar</p>
          <ShoppingCartOutlined />
        </Button>
      </div>
    </>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <span className="text-gray-500">{icon}</span>
    <span className="font-semibold">{label}:</span>
    <span>{value}</span>
  </div>
);

export default DisplayDetails;
