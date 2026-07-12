import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';

export default function AppLayout() {
  return (
    <div className="app-container">
      <Topbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
