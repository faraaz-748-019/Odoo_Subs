import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getNavClass = (isActive, themeClass) => {
    return `nav-link ${isActive ? `active ${themeClass}` : ''}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="topbar glass-panel flex items-center">
      <div className="brand flex items-center gap-2">
        <div className="window-controls">
          <div className="dot close"></div>
          <div className="dot minimize"></div>
          <div className="dot maximize"></div>
        </div>
        <span className="brand-text">EcoSphere</span>
      </div>

      <div className="nav-links flex">
        <NavLink to="/" end className={({ isActive }) => getNavClass(isActive, '')}>Dashboard</NavLink>
        <NavLink to="/environmental" className={({ isActive }) => getNavClass(isActive, 'theme-env-text')}>Environmental</NavLink>
        <NavLink to="/social" className={({ isActive }) => getNavClass(isActive, 'theme-social-text')}>Social</NavLink>
        <NavLink to="/governance" className={({ isActive }) => getNavClass(isActive, 'theme-gov-text')}>Governance</NavLink>
        <NavLink to="/gamification" className={({ isActive }) => getNavClass(isActive, 'theme-gamify-text')}>Gamification</NavLink>
        <NavLink to="/reports" className={({ isActive }) => getNavClass(isActive, '')}>Reports</NavLink>
        <NavLink to="/settings" className={({ isActive }) => getNavClass(isActive, '')}>Settings</NavLink>
      </div>

      <div className="flex items-center gap-3" style={{ marginLeft: 'auto' }}>
        {user && (
          <>
            <span className="text-sm text-muted">{user.name}</span>
            {user.accountType === 'demo' && (
              <span className="badge" style={{ borderColor: '#f59e0b', color: '#f59e0b', fontSize: '0.7rem' }}>DEMO</span>
            )}
            <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: '#ef4444' }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
