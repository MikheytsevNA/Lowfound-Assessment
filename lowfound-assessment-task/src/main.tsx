import React from 'react';
import ReactDOM from 'react-dom/client';
import { App, AppChat } from './App.tsx';
import './index.css';
import './normalize.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/chat',
    element: <AppChat />
  }
]);

ReactDOM.createRoot(document.querySelector('.container') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
