import React, { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('departments');
  const [toggles, setToggles] = useState([true, false, true, true]); // Just mock state

  const toggleSetting = (index) => {
    const newToggles = [...toggles];
    newToggles[index] = !newToggles[index];
    setToggles(newToggles);
  };

  const Toggle = ({ active, onClick }) => (
    <div 
      onClick={onClick}
      style={{ 
        width: '42px', height: '24px', 
        background: active ? '#cbd5e1' : 'transparent', 
        border: '1px solid #cbd5e1', 
        borderRadius: '12px', display: 'flex', alignItems: 'center', 
        padding: '2px', cursor: 'pointer', transition: 'all 0.2s',
        marginRight: '12px'
      }}
    >
      <div style={{ 
        width: '16px', height: '16px', 
        background: active ? '#161b22' : '#cbd5e1', 
        borderRadius: '50%', 
        transform: active ? 'translateX(18px)' : 'translateX(0)', 
        transition: 'transform 0.2s' 
      }} />
    </div>
  );

  return (
    <div className="module-layout p-6 flex-col gap-6" style={{ height: '100%', overflowY: 'auto' }}>
      
      {/* Sub-Navigation Tabs */}
      <div className="flex gap-4 border-b border-light pb-2 mb-4 overflow-x-auto no-scrollbar">
        <button 
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'departments' ? 'bg-[var(--bg-panel-solid)] text-white' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('departments')}
          style={{ background: activeTab === 'departments' ? '#cbd5e1' : 'transparent', color: activeTab === 'departments' ? '#161b22' : 'var(--text-muted)' }}
        >
          Departments
        </button>
        <button 
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'categories' ? 'bg-[var(--bg-panel-solid)] text-white' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('categories')}
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Categories
        </button>
        <button 
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'esg' ? 'bg-[var(--bg-panel-solid)] text-white' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('esg')}
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          ESG Configuration
        </button>
        <button 
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'notifications' ? 'bg-[var(--bg-panel-solid)] text-white' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('notifications')}
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Notification Settings
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-4">
        <button 
          className="btn text-sm font-bold"
          style={{ background: '#cbd5e1', color: '#161b22', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem' }}
        >
          + New Department
        </button>
        <button 
          className="btn text-sm font-bold"
          style={{ background: '#f59e0b', color: '#161b22', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem' }}
        >
          Edit
        </button>
        <button 
          className="btn text-sm font-bold"
          style={{ background: '#f87171', color: '#161b22', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem' }}
        >
          Delete
        </button>
      </div>

      {/* Departments Table */}
      <div className="glass-panel overflow-hidden mb-8" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)'}}>
              <th className="p-4 text-xs text-white font-semibold">Name</th>
              <th className="p-4 text-xs text-white font-semibold">Code</th>
              <th className="p-4 text-xs text-white font-semibold">Head</th>
              <th className="p-4 text-xs text-white font-semibold">Parent Dept</th>
              <th className="p-4 text-xs text-white font-semibold">Employees</th>
              <th className="p-4 text-xs text-white font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Manufacturing', code: 'MFC', head: 'S. Nair', parent: '—', emp: '134', status: 'Active' },
              { name: 'Logistics', code: 'LOC', head: 'R. Iyer', parent: 'Manufacturing', emp: '56', status: 'Active' },
              { name: 'Corporate', code: 'COR', head: 'A. Mehta', parent: '—', emp: '41', status: 'Active' }
            ].map((dept, i) => (
              <tr key={dept.name} style={{borderBottom: i !== 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: 'transparent'}}>
                <td className="p-4 text-xs text-muted">{dept.name}</td>
                <td className="p-4 text-xs text-muted">{dept.code}</td>
                <td className="p-4 text-xs text-muted">{dept.head}</td>
                <td className="p-4 text-xs text-muted">{dept.parent}</td>
                <td className="p-4 text-xs text-muted">{dept.emp}</td>
                <td className="p-4">
                  <span className="px-4 py-1 text-xs font-semibold rounded border" style={{ borderColor: '#22c55e', color: '#22c55e', background: 'transparent' }}>
                    {dept.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ESG Configuration & Notifications */}
      <div>
        <h3 className="text-sm font-semibold text-muted mb-4">ESG Configuration & Notifications</h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <Toggle active={toggles[0]} onClick={() => toggleSetting(0)} />
            <span className="text-sm text-white font-semibold">Enable auto emission calculation</span>
          </div>
          
          <div className="flex items-center">
            <Toggle active={toggles[1]} onClick={() => toggleSetting(1)} />
            <span className="text-sm text-white font-semibold">Require evidence for all CSR activities</span>
          </div>

          <div className="flex items-center">
            <Toggle active={toggles[2]} onClick={() => toggleSetting(2)} />
            <span className="text-sm text-white font-semibold">Auto-award badges on challenge completion</span>
          </div>

          <div className="flex items-center">
            <Toggle active={toggles[3]} onClick={() => toggleSetting(3)} />
            <span className="text-sm text-white font-semibold">Email alerts for new compliance issues</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
