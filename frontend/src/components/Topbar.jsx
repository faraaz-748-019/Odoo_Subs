import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Topbar() {
  const getNavClass = (isActive, themeClass) => {
    return `nav-link ${isActive ? `active ${themeClass}` : ''}`;
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
        <NavLink to="/app" end className={({isActive}) => getNavClass(isActive, '')}>Dashboard</NavLink>
        <NavLink to="/app/environmental" className={({isActive}) => getNavClass(isActive, 'theme-env-text')}>Environmental</NavLink>
        <NavLink to="/app/social" className={({isActive}) => getNavClass(isActive, 'theme-social-text')}>Social</NavLink>
        <NavLink to="/app/governance" className={({isActive}) => getNavClass(isActive, 'theme-gov-text')}>Governance</NavLink>
        <NavLink to="/app/gamification" className={({isActive}) => getNavClass(isActive, 'theme-gamify-text')}>Gamification</NavLink>
        <NavLink to="/app/reports" className={({isActive}) => getNavClass(isActive, '')}>Reports</NavLink>
        <NavLink to="/app/settings" className={({isActive}) => getNavClass(isActive, '')}>Settings</NavLink>
      </div>
    </nav>
  );
}
