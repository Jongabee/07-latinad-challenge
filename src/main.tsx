import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import esES from 'antd/lib/locale/es_ES';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from './redux/store.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider locale={esES}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>,
);
