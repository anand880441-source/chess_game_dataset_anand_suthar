import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store/store';
import App from './App';
import './index.css';

const theme = localStorage.getItem('theme');
if (theme === 'dark') {
    document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <HelmetProvider>
                <App />
                <Toaster position="top-right" />
            </HelmetProvider>
        </Provider>
    </React.StrictMode>
);
