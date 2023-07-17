import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route,RouterProvider, createBrowserRouter } from 'react-router-dom'
import { App, AppChat } from './App';

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

export function createApp () {
  return (
    <Suspense>
      <RouterProvider
        router={router}
      />
    </Suspense>
  )
}