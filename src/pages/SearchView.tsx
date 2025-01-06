import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, DatePicker, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  searchCampaign,
  updateSearchParams,
} from '../redux/campaign/campaignSlice';
import { AppDispatch } from '../redux/store';
import { geocodeLocation } from '../services/geocoding';
import CityAutocomplete from '../components/CityAutocomplete';

const { RangePicker } = DatePicker;

const SearchView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const disabledDate = (current: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!current) return false;

    if (current.toDate() < today) {
      return true;
    }

    if (selectedStartDate && !selectedEndDate) {
      return current.toDate() < selectedStartDate;
    }

    if (selectedEndDate && !selectedStartDate) {
      return current.toDate() > selectedEndDate;
    }

    return false;
  };

  const onFinish = async (values: any) => {
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

    if (values.city) {
      try {
        const coordinates = await geocodeLocation(values.city);
        searchParams.lat_sw = coordinates.lat_sw;
        searchParams.lng_sw = coordinates.lng_sw;
        searchParams.lat_ne = coordinates.lat_ne;
        searchParams.lng_ne = coordinates.lng_ne;
      } catch (error) {
        message.error(
          error instanceof Error
            ? error.message
            : 'Error al geocodificar la ciudad',
        );
        setLoading(false);
        return;
      }
    } else {
      message.error('Por favor, ingrese una ciudad o zona');
      setLoading(false);
      return;
    }

    if (values.price_min !== undefined)
      searchParams.price_min = values.price_min;
    if (values.price_max !== undefined)
      searchParams.price_max = values.price_max;

    dispatch(updateSearchParams(searchParams));

    try {
      await dispatch(searchCampaign(searchParams)).unwrap();
      setLoading(false);
      navigate('/results');
    } catch (error) {
      console.error('Search error:', error);
      message.error('Error al realizar la búsqueda');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscar Campaña</h1>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="dateRange"
          label="Fechas de la campaña"
          rules={[
            { required: true, message: 'Por favor seleccione las fechas' },
          ]}
        >
          <RangePicker
            className="w-full"
            disabledDate={disabledDate}
            onCalendarChange={(dates) => {
              if (dates) {
                setSelectedStartDate(dates[0]?.toDate() || null);
                setSelectedEndDate(dates[1]?.toDate() || null);
              }
            }}
          />
        </Form.Item>
        <Form.Item
          name="city"
          label="Ciudad o zona"
          rules={[
            { required: true, message: 'Por favor ingrese la ciudad o zona' },
          ]}
        >
          <CityAutocomplete
            onSelect={(value) => form.setFieldsValue({ city: value })}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={loading}
          >
            Buscar Pantalla
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchView;
