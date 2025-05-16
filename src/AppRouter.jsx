import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ConfigPage from './pages/ConfigPage.jsx';
import GamePage from './pages/GamePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
