import React, { useState } from 'react';
import { List, Card, Modal } from 'antd';
import { IDisplay } from '../types';
import { PlusCircleOutlined } from '@ant-design/icons';
import DisplayDetails from './DisplayDetails';
import { truncateText } from '../utils/truncateText';
import useCustomNotification from '../hooks/useCustomNotification';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { addItemToCart } from '../redux/cart/cartSlice';

interface IDisplayListProps {
  displays: IDisplay[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
  };
  onPageChange: (page: number, pageSize?: number) => void;
  isMapHovered: boolean;
}

const DisplayList: React.FC<IDisplayListProps> = ({
  displays,
  isMapHovered,
}) => {
  const [selectedDisplay, setSelectedDisplay] = useState<IDisplay | null>(null);
  const { openNotification, contextHolder } = useCustomNotification();
  const dispatch = useDispatch<AppDispatch>();
  const handleDisplayClick = (display: IDisplay) => {
    setSelectedDisplay(display);
  };

  const handleCloseModal = () => {
    setSelectedDisplay(null);
  };
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
      <div className=" ">
        <List
          dataSource={displays}
          itemLayout="horizontal"
          renderItem={(display) => (
            <List.Item>
              <Card
                onClick={() => handleDisplayClick(display)}
                className="transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg cursor-pointer"
                styles={{
                  body: {
                    padding: '0 20px',
                    margin: 0,
                  },
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    alt={display.name || 'Imagen de pantalla'}
                    src={
                      display.pictures && display.pictures.length > 0
                        ? display.pictures[0].url
                        : '/placeholder.svg'
                    }
                    className="w-1/2 rounded-lg"
                  />

                  <div className="w-1/2">
                    <div className="text-xs">
                      <p className="font-bold">
                        {isMapHovered
                          ? truncateText(display.formatted_address, 13)
                          : display.formatted_address}
                      </p>
                      <p className="text-blue-400">
                        $ {display.price_converted} / día
                      </p>
                      <hr className="m-1" />
                      <p>
                        {isMapHovered
                          ? truncateText(
                              `Tamaño: ${display.size_width}m x ${display.size_height}
                        m`,
                              13,
                            )
                          : `Tamaño: ${display.size_width}m x ${display.size_height},`}
                      </p>
                      <p>
                        {isMapHovered
                          ? truncateText(
                              `Resolución: ${display.resolution_width}x
                        {display.resolution_height}`,
                              13,
                            )
                          : `Resolución: ${display.resolution_width}x${display.resolution_height} `}
                      </p>
                      {!isMapHovered && (
                        <PlusCircleOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(display);
                          }}
                          className="transform transition-all duration-300 hover:scale-110 hover:text-blue-500"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />

        <Modal
          open={!!selectedDisplay}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
          centered
          className="my-2 h-[calc(100vh-32px)] overflow-auto"
        >
          {selectedDisplay && <DisplayDetails display={selectedDisplay} />}
        </Modal>
      </div>
    </>
  );
};

export default DisplayList;
