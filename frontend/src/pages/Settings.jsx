import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

export default function Settings() {
  const { token } = useAuth();
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState('departments');
  const [toggles, setToggles] = useState({
    autoEmission: true,
    requireEvidence: false,
    autoAwardBadge: true,
    emailAlerts: true
  });

  // Modal States
  const [isDeptModalOpen, setDeptModalOpen] = useState(false);
  const [isCatModalOpen, setCatModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSettings = () => {
    fetch(`${API_BASE}/api/settings`, { headers })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setToggles(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token]);

  const [depts, setDepts] = useState([
    { name: 'Manufacturing', code: 'MFC', head: 'S. Nair', parent: '—', emp: '134', status: 'Active' },
    { name: 'Logistics', code: 'LOC', head: 'R. Iyer', parent: 'Manufacturing', emp: '56', status: 'Active' },
    { name: 'Corporate', code: 'COR', head: 'A. Mehta', parent: '—', emp: '41', status: 'Active' },
    { name: 'Engineering', code: 'ENG', head: 'J. Doe', parent: '—', emp: '88', status: 'Active' }
  ]);

  const [categories, setCategories] = useState([
    { name: 'Emissions', module: 'Environmental', weight: '35%', desc: 'Scope 1, 2, and 3 carbon metrics' },
    { name: 'Diversity & Inclusion', module: 'Social', weight: '25%', desc: 'Gender, ethnic and age representation' },
    { name: 'Corporate Governance', module: 'Governance', weight: '20%', desc: 'Board metrics, risk management & audits' },
    { name: 'CSR Volunteering', module: 'Social', weight: '20%', desc: 'Community hours and employee CSR initiatives' }
  ]);

  const [newDept, setNewDept] = useState({ name: '', code: '', head: '', parent: '—', emp: '0', status: 'Active' });
  const [newCat, setNewCat] = useState({ name: '', module: 'Environmental', weight: '10%', desc: '' });

  const toggleSetting = async (key) => {
    const newValue = !toggles[key];
    setToggles(prev => ({ ...prev, [key]: newValue }));
    triggerMessage('Configuration updated successfully.');

    try {
      await fetch(`${API_BASE}/api/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ key, value: newValue })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const triggerMessage = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddDept = (e) => {
    e.preventDefault();
    setDepts(prev => [...prev, newDept]);
    setDeptModalOpen(false);
    setNewDept({ name: '', code: '', head: '', parent: '—', emp: '0', status: 'Active' });
    triggerMessage('Department added successfully.');
  };

  const handleAddCat = (e) => {
    e.preventDefault();
    setCategories(prev => [...prev, newCat]);
    setCatModalOpen(false);
    setNewCat({ name: '', module: 'Environmental', weight: '10%', desc: '' });
    triggerMessage('ESG Category added successfully.');
  };

  const Toggle = ({ active, onClick }) => (
    <div 
      onClick={onClick}
      style={{ 
        width: '42px', height: '24px', 
        background: active ? '#10b981' : 'transparent', 
        border: active ? '1px solid #10b981' : '1px solid #cbd5e1', 
        borderRadius: '12px', display: 'flex', alignItems: 'center', 
        padding: '2px', cursor: 'pointer', transition: 'all 0.2s',
        marginRight: '12px'
      }}
    >
      <div style={{ 
        width: '16px', height: '16px', 
        background: active ? '#161b22' : '#cbd5e1', 
        borderRadius: '50%', 
        transform: active ? 'translateX(20px)' : 'translateX(0)', 
        transition: 'transform 0.2s' 
      }} />
    </div>
  );

  return (
    <div className="module-layout p-6 flex-col gap-6" style={{ height: '100%', overflowY: 'auto' }}>
      
      <div>
        <h2 className="text-2xl font-bold text-main">System Configuration & Settings</h2>
        <p className="text-sm text-muted mt-1">Manage platform hierarchies, ESG scopes, categories, and settings.</p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="sub-nav" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        {[
          { key: 'departments', label: 'Departments' },
          { key: 'categories', label: 'Categories' },
          { key: 'esg', label: 'ESG Configuration' },
          { key: 'notifications', label: 'Notification Settings' }
        ].map(tab => (
          <button
            key={tab.key}
            className="text-sm font-semibold rounded-t-lg transition-colors"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              background: activeTab === tab.key ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
              borderBottom: activeTab === tab.key ? '2px solid #cbd5e1' : '2px solid transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {successMsg && (
        <div className="glass-panel p-4 animate-fade-in" style={{ borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
          <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>{successMsg}</span>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === 'departments' && (
        <div className="animate-fade-in">
          <div className="flex gap-4 mb-6">
            <button 
              className="btn text-sm font-bold"
              onClick={() => setDeptModalOpen(true)}
              style={{ background: '#cbd5e1', color: '#161b22', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem' }}
            >
              + New Department
            </button>
          </div>

          <div className="glass-panel overflow-hidden mb-8" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
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
                {depts.map((dept, i) => (
                  <tr key={dept.name} style={{borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'transparent'}}>
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
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="animate-fade-in">
          <div className="flex gap-4 mb-6">
            <button 
              className="btn text-sm font-bold"
              onClick={() => setCatModalOpen(true)}
              style={{ background: '#cbd5e1', color: '#161b22', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem' }}
            >
              + New Category
            </button>
          </div>

          <div className="glass-panel overflow-hidden mb-8" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)'}}>
                  <th className="p-4 text-xs text-white font-semibold">Name</th>
                  <th className="p-4 text-xs text-white font-semibold">ESG Pillar</th>
                  <th className="p-4 text-xs text-white font-semibold">Weight</th>
                  <th className="p-4 text-xs text-white font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, i) => (
                  <tr key={cat.name} style={{borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'transparent'}}>
                    <td className="p-4 text-xs text-main font-semibold">{cat.name}</td>
                    <td className="p-4 text-xs text-muted">{cat.module}</td>
                    <td className="p-4 text-xs text-muted">{cat.weight}</td>
                    <td className="p-4 text-xs text-muted">{cat.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'esg' && (
        <div className="glass-panel p-6 animate-fade-in" style={{ borderRadius: '16px' }}>
          <h3 className="text-md font-semibold text-main mb-6">ESG Scoring & Audit Configurations</h3>
          
          <div className="flex-col gap-6">
            <div className="flex items-center justify-between p-3 border-b border-light">
              <div>
                <div className="text-sm text-white font-semibold">Enable Auto Emission Calculation</div>
                <div className="text-xs text-muted">Automatically calculate facility footprint metrics based on monthly resource logs.</div>
              </div>
              <Toggle active={toggles.autoEmission} onClick={() => toggleSetting('autoEmission')} />
            </div>

            <div className="flex items-center justify-between p-3 border-b border-light">
              <div>
                <div className="text-sm text-white font-semibold">Require Evidence Uploads</div>
                <div className="text-xs text-muted">Force upload of receipts/logs for all user CSR activity approvals.</div>
              </div>
              <Toggle active={toggles.requireEvidence} onClick={() => toggleSetting('requireEvidence')} />
            </div>

            <div className="flex items-center justify-between p-3">
              <div>
                <div className="text-sm text-white font-semibold">Auto-Award Gamification Badges</div>
                <div className="text-xs text-muted">Instantly unlock badges for users who cross the required point milestone.</div>
              </div>
              <Toggle active={toggles.autoAwardBadge} onClick={() => toggleSetting('autoAwardBadge')} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="glass-panel p-6 animate-fade-in" style={{ borderRadius: '16px' }}>
          <h3 className="text-md font-semibold text-main mb-6">Security & Alerts Configuration</h3>
          
          <div className="flex items-center justify-between p-3">
            <div>
              <div className="text-sm text-white font-semibold">Email Alerts for compliance issues</div>
              <div className="text-xs text-muted">Send immediate email notifications to auditors if a compliance issue remains open.</div>
            </div>
            <Toggle active={toggles.emailAlerts} onClick={() => toggleSetting('emailAlerts')} />
          </div>
        </div>
      )}

      {/* Modal Add Department */}
      <Modal isOpen={isDeptModalOpen} onClose={() => setDeptModalOpen(false)} title="New Department">
        <form onSubmit={handleAddDept}>
          <label className="text-xs text-muted block mb-2 font-semibold">Department Name</label>
          <input 
            required 
            type="text" 
            value={newDept.name} 
            onChange={e => setNewDept({ ...newDept, name: e.target.value })} 
            className="form-input mb-4"
          />

          <label className="text-xs text-muted block mb-2 font-semibold">Code</label>
          <input 
            required 
            type="text" 
            value={newDept.code} 
            onChange={e => setNewDept({ ...newDept, code: e.target.value })} 
            className="form-input mb-4"
          />

          <label className="text-xs text-muted block mb-2 font-semibold">Head of Department</label>
          <input 
            required 
            type="text" 
            value={newDept.head} 
            onChange={e => setNewDept({ ...newDept, head: e.target.value })} 
            className="form-input mb-6"
          />

          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setDeptModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn" style={{ background: '#cbd5e1', color: '#161b22' }}>Create</button>
          </div>
        </form>
      </Modal>

      {/* Modal Add Category */}
      <Modal isOpen={isCatModalOpen} onClose={() => setCatModalOpen(false)} title="New ESG Category">
        <form onSubmit={handleAddCat}>
          <label className="text-xs text-muted block mb-2 font-semibold">Category Name</label>
          <input 
            required 
            type="text" 
            value={newCat.name} 
            onChange={e => setNewCat({ ...newCat, name: e.target.value })} 
            className="form-input mb-4"
          />

          <label className="text-xs text-muted block mb-2 font-semibold">ESG Pillar</label>
          <select 
            value={newCat.module} 
            onChange={e => setNewCat({ ...newCat, module: e.target.value })}
            className="form-input mb-4"
          >
            <option value="Environmental">Environmental</option>
            <option value="Social">Social</option>
            <option value="Governance">Governance</option>
          </select>

          <label className="text-xs text-muted block mb-2 font-semibold">Pillar Weight (%)</label>
          <input 
            required 
            type="text" 
            value={newCat.weight} 
            onChange={e => setNewCat({ ...newCat, weight: e.target.value })} 
            className="form-input mb-4"
          />

          <label className="text-xs text-muted block mb-2 font-semibold">Description</label>
          <input 
            type="text" 
            value={newCat.desc} 
            onChange={e => setNewCat({ ...newCat, desc: e.target.value })} 
            className="form-input mb-6"
          />

          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setCatModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn" style={{ background: '#cbd5e1', color: '#161b22' }}>Create</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
