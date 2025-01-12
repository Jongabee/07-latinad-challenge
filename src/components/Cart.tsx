import React from 'react';
import { Modal, Button, List, Row, Col, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { removeItemFromCart } from '../redux/cart/cartSlice';
import { useNumberOfDays } from '../hooks/useNumberOfDays';

interface ICart {
  open: boolean;
  onClose: () => void;
  onDownloadPdf: () => void;
}

const Cart: React.FC<ICart> = ({
  open,
  onClose,
  onDownloadPdf,
}: {
  open: boolean;
  onClose: () => void;
  onDownloadPdf: () => void;
}) => {
  const items = useSelector((state: RootState) => state.cart.items);
  console.log(items, 'items');

  const dispatch = useDispatch();
  const numberOfDays = useNumberOfDays();

  const handleRemoveItem = (name: string) => {
    dispatch(removeItemFromCart(name));
  };

  const totalCartPrice = items.reduce(
    (acc, item) => acc + item.price * numberOfDays,
    0,
  );

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={600}>
      <Row justify="center">
        <Col>
          <img src="/latinAd1.svg" alt="Logo" className="w-16 h-auto" />
        </Col>
      </Row>
      <Divider />
      {items.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item) => {
            const totalForItem = item.price * numberOfDays;
            return (
              <List.Item
                actions={[
                  <Button
                    onClick={() => handleRemoveItem(item.name)}
                    type="link"
                  >
                    Eliminar
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`Precio por día: $${item.price.toFixed(
                    2,
                  )} - Total: $${totalForItem.toFixed(2)}`}
                />
              </List.Item>
            );
          }}
        />
      )}
      <Divider />
      <Row justify="end" gutter={16} className="gap-3">
        <h3 className="mt-1 text-blue-500">
          Total del carrito: ${totalCartPrice.toFixed(2)}
        </h3>
        <Button type="default" onClick={onDownloadPdf}>
          Descargar PDF
        </Button>
        <Button type="primary" onClick={onClose}>
          Cerrar
        </Button>
      </Row>
    </Modal>
  );
};

export default Cart;
