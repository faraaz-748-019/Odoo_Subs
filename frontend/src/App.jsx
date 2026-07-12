import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { Dashboard, Environmental, Social, Governance, Gamification, Reports, Settings } from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="environmental" element={<Environmental />} />
          <Route path="social" element={<Social />} />
          <Route path="governance" element={<Governance />} />
          <Route path="gamification" element={<Gamification />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
