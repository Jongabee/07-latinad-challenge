import axios from 'axios';

interface ICoordinates {
  lat_sw: number;
  lng_sw: number;
  lat_ne: number;
  lng_ne: number;
}

export const geocodeLocation = async (city: string): Promise<ICoordinates> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: city,
          format: 'json',
          limit: 1,
        },
        timeout: 10000,
      },
    );

    if (response.data && response.data.length > 0) {
      const { boundingbox } = response.data[0];
      const [lat_sw, lat_ne, lng_sw, lng_ne] = boundingbox.map(Number);

      return {
        lat_sw,
        lng_sw,
        lat_ne,
        lng_ne,
      };
    } else {
      throw new Error(
        'No se encontraron resultados para la ciudad proporcionada',
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error(
          'La solicitud de geocodificación ha excedido el tiempo de espera. Por favor, inténtelo de nuevo.',
        );
      }
      throw new Error(`Error de geocodificación: ${error.message}`);
    }
    throw new Error('Error inesperado durante la geocodificación');
  }
};
