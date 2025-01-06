import React, { useState } from 'react';
import { List, Card, Modal } from 'antd';
import { IDisplay } from '../types';
import { PlusCircleOutlined } from '@ant-design/icons';
import DisplayDetails from './DisplayDetails';

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

const DisplayList: React.FC<IDisplayListProps> = ({ displays }) => {
  const [selectedDisplay, setSelectedDisplay] = useState<IDisplay | null>(null);

  const handleDisplayClick = (display: IDisplay) => {
    setSelectedDisplay(display);
  };

  const handleCloseModal = () => {
    setSelectedDisplay(null);
  };

  return (
    <>
      <div className=" ">
        <List
          dataSource={displays}
          itemLayout="horizontal"
          renderItem={(display) => (
            <List.Item>
              <Card
                onClick={() => handleDisplayClick(display)}
                className="transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg cursor-pointer"
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
                      <p className="font-bold">{display.formatted_address}</p>
                      <p className="text-blue-400">
                        `${display.price_converted} / día`
                      </p>
                      <hr className="m-1" />
                      <p>
                        `Tamaño: ${display.size_width}m x ${display.size_height}
                        m`
                      </p>
                      <p>
                        `Resolución: ${display.resolution_width}x$
                        {display.resolution_height}`
                      </p>
                    </div>
                    <PlusCircleOutlined className="transform transition-all duration-300 hover:scale-110 hover:text-blue-500" />
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
