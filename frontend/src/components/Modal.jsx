import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="glass-panel p-6 relative" style={{ width: '450px', background: 'var(--bg-panel-solid)' }}>
        <button onClick={onClose} style={{position: 'absolute', top: 15, right: 15, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem'}}>✖</button>
        <h2 className="text-xl mb-4 font-semibold pr-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}
