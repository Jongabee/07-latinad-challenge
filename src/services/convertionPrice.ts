import axios from 'axios';

export async function fetchDollarBlue(): Promise<number> {
  try {
    const response = await axios.get('https://dolarapi.com/v1/dolares/blue');
    const rate = response.data.venta;
    console.log('Tasa de cambio del dólar blue obtenida:', rate);
    return rate;
  } catch (error) {
    console.error('Error al obtener el dólar blue:', error);
    throw new Error('No se pudo obtener la tasa de cambio del dólar blue.');
  }
}

export function convertToPesos(
  amountInDollars: number,
  dollarRate: number,
): number {
  return amountInDollars * dollarRate;
}
