import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IDisplay } from '../types';
import { useDispatch } from 'react-redux';
import DisplayDetails from './DisplayDetails';
import { Modal } from 'antd';
import { addItemToCart } from '../redux/cart/cartSlice';
import useCustomNotification from '../hooks/useCustomNotification';

interface IDisplayMap {
  displays: IDisplay[];
}

const DisplayMap: React.FC<IDisplayMap> = ({ displays }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [selectedDisplay, setSelectedDisplay] = useState<IDisplay | null>(null);
  const dispatch = useDispatch();
  const { openNotification, contextHolder } = useCustomNotification();

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([-34.6037, -58.3816], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    const customIcon = new L.Icon({
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    displays.forEach((display) => {
      const popupContent = document.createElement('div');
      popupContent.style.display = 'flex';
      popupContent.style.flexDirection = 'column';

      popupContent.innerHTML = `
        <div class="flex items-center space-x-2">
          <strong class="text-lg">${display.name}</strong>
        </div>
        <div class="mt-2 text-sm text-gray-600">
          ${display.formatted_address}<br>
          Precio: $${display.price_converted} /día
        </div>
        <div class="flex gap-2 mt-3">
          <button 
            id="info-button-${display.id}" 
            class="bg-white border border-blue-500 text-blue-500 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
            title="Ver detalle"
          >
            !
          </button>
          <button 
            id="add-to-cart-${display.id}" 
            class="bg-blue-500 text-white rounded-full py-1 px-3 cursor-pointer"
            title="Agregar al carrito"
          >
            Agregar
          </button>
        </div>
      `;

      const marker = L.marker([display.latitude, display.longitude], {
        icon: customIcon,
      }).addTo(map);
      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const infoButton = document.getElementById(`info-button-${display.id}`);
        const addToCartButton = document.getElementById(
          `add-to-cart-${display.id}`,
        );

        if (infoButton) {
          infoButton.onclick = () => {
            setSelectedDisplay(display);
          };
        }
        if (addToCartButton) {
          addToCartButton.onclick = () => {
            const isItemInCart = JSON.parse(
              localStorage.getItem('cart') || '[]',
            ).some((item: { name: string }) => item.name === display.name);

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
        }
      });
    });

    if (displays.length > 0) {
      const bounds = L.latLngBounds(
        displays.map((d) => [d.latitude, d.longitude]),
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [displays, dispatch, openNotification]);

  return (
    <>
      {contextHolder}
      <div
        id="map"
        className="h-[calc(100vh-20px)] w-full mt-3 rounded-lg shadow-md"
      />
      <Modal
        open={!!selectedDisplay}
        onCancel={() => setSelectedDisplay(null)}
        footer={null}
        width={800}
        centered
        className="my-2 h-[calc(100vh-32px)] overflow-auto"
      >
        {selectedDisplay && <DisplayDetails display={selectedDisplay} />}
      </Modal>
    </>
  );
};

export default DisplayMap;
