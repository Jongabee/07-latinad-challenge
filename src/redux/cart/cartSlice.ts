import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDisplay } from '../../types';

interface ICart {
  items: { name: string; price: number; date_from: string; date_to: string }[];
}

const initialState: ICart = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<IDisplay>) => {
      const { name, price_converted, date_from, date_to } = action.payload;

      const exists = state.items.find((item) => item.name === name);

      if (!exists) {
        state.items.push({
          name,
          price: price_converted,
          date_from,
          date_to,
        });
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },

    removeItemFromCart: (state, action: PayloadAction<string>) => {
      const itemName = action.payload;
      const itemExists = state.items.find((item) => item.name === itemName);

      if (itemExists) {
        state.items = state.items.filter((item) => item.name !== itemName);
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
