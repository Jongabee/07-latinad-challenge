import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  DatePicker,
  Button,
  message,
  Typography,
  Card,
  Row,
  Col,
  Carousel,
} from 'antd';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import {
  fetchCampaignStart,
  updateSearchParams,
} from '../../redux/campaign/campaignSlice';
import { AppDispatch } from '../../redux/store';
import CityAutocomplete from '../../components/CityAutocomplete';
import { motion } from 'framer-motion';
import './SearchView.css';
import { carouselItems } from './carouselItems';
import { useMediaQuery } from 'react-responsive';

const { RangePicker } = DatePicker;
const { Title, Paragraph } = Typography;

const SearchView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const disabledDate = (current: any) => {
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  const onFinish = (values: any) => {
    setLoading(true);
    const searchParams: any = {
      page: 1,
      per_page: 10,
    };

    if (values.dateRange) {
      const [startDate, endDate] = values.dateRange;
      searchParams.date_from = startDate.format('YYYY-MM-DD');
      searchParams.date_to = endDate.format('YYYY-MM-DD');
    } else {
      message.error('Por favor, seleccione un rango de fechas');
      setLoading(false);
      return;
    }

    if (!values.city) {
      message.error('Por favor, ingrese una ciudad o zona');
      setLoading(false);
      return;
    }

    searchParams.city = values.city;

    dispatch(updateSearchParams(searchParams));
    dispatch(fetchCampaignStart(searchParams));
    navigate('/results');
  };

  return (
    <div className="gradient-background">
      <Card className="styled-card">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <Carousel autoplay effect="fade" className="styled-carousel">
              {carouselItems.map((item, index) => (
                <div key={index}>
                  <div className="feature-icon" style={{ textAlign: 'center' }}>
                    {item.icon}
                  </div>
                  <Title
                    level={2}
                    style={{ textAlign: 'center', marginBottom: 16 }}
                  >
                    {item.title}
                  </Title>
                  <Paragraph style={{ fontSize: '16px', textAlign: 'center' }}>
                    {item.description}
                  </Paragraph>
                </div>
              ))}
            </Carousel>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Title level={4} style={{ textAlign: 'center', marginTop: 24 }}>
                ¡Comienza tu campaña hoy y destaca en la ciudad!
              </Title>
            </motion.div>
          </Col>

          <Col xs={24} lg={12}>
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Form.Item
                  name="dateRange"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor seleccione las fechas',
                    },
                  ]}
                >
                  <RangePicker
                    style={{ width: isMobile ? '100%' : 'auto' }}
                    disabledDate={disabledDate}
                    format="DD/MM/YYYY"
                    placeholder={['Inicio de campaña', 'Fin de campaña']}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Form.Item
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor ingrese la ciudad o zona',
                    },
                  ]}
                >
                  <CityAutocomplete
                    onSelect={(value) => form.setFieldsValue({ city: value })}
                  />
                </Form.Item>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                    style={{ width: '100%', height: '50px', fontSize: '18px' }}
                  >
                    Descubre Pantallas Disponibles
                  </Button>
                </Form.Item>
              </motion.div>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SearchView;
