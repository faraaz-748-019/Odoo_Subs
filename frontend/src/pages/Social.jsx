import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, ShieldAlert, Award, FileText } from 'lucide-react';
import { API_BASE } from '../config';

export default function Social() {
  const { token } = useAuth();
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState('csr');
  const [activities, setActivities] = useState([]);
  const [queue, setQueue] = useState([]);

  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', is_evidence_required: true, status: 'Active' });
  const [actionLoadingId, setActionLoadingId] = useState('');

  const fetchData = () => {
    fetch(`${API_BASE}/api/social/activities`, { headers })
      .then(res => res.json())
      .then(setActivities)
      .catch(console.error);
    fetch(`${API_BASE}/api/social/participations`, { headers })
      .then(res => res.json())
      .then(setQueue)
      .catch(console.error);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoadingId('create');
    try {
      const res = await fetch(`${API_BASE}/api/social/activities`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setModalOpen(false);
        setFormData({ title: '', is_evidence_required: true, status: 'Active' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    await fetch(`${API_BASE}/api/social/activities/${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  const handleApprove = async (id) => {
    setActionLoadingId(`approve-${id}`);
    try {
      await fetch(`${API_BASE}/api/social/participations/${id}/approve`, { method: 'POST', headers });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId('');
    }
  };

  const handleReject = async (id) => {
    setActionLoadingId(`reject-${id}`);
    try {
      await fetch(`${API_BASE}/api/social/participations/${id}/reject`, { method: 'POST', headers });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId('');
    }
  };

  return (
    <div className="module-layout p-6 flex-col gap-4" style={{ height: '100%', overflowY: 'auto' }}>
      
      <div>
        <h2 className="text-2xl font-bold theme-social-text">Social Metrics & Corporate Responsibility</h2>
        <p className="text-sm text-muted mt-1">Manage employee engagement activities, monitor CSR project approvals, and track workforce diversity.</p>
      </div>

      {/* Sub-Navigation */}
      <div className="sub-nav" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        {[
          { key: 'csr', label: 'CSR Activities' },
          { key: 'participation', label: 'Employee Participation' },
          { key: 'diversity', label: 'Diversity Dashboard' }
        ].map(tab => (
          <button
            key={tab.key}
            className="text-sm font-semibold rounded-t-lg transition-colors"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              background: activeTab === tab.key ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent-social)' : '2px solid transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab contents */}
      {activeTab === 'csr' && (
        <div className="animate-fade-in flex-col gap-4">
          <div className="action-bar flex justify-between items-center" style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary-social" style={{ background: 'var(--accent-social)', color: 'white', border: 'none' }} onClick={() => setModalOpen(true)}>+ New Activity</button>
          </div>

          <div className="grid-4 gap-4" style={{ marginTop: '1rem' }}>
            {activities.map(act => (
              <div key={act.id} className="glass-panel p-4 flex-col gap-2 relative" style={{ borderColor: 'var(--accent-social)', borderRadius: '16px' }}>
                <button onClick={() => handleDelete(act.id)} style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete Activity">✖</button>
                <h4 className="text-md font-semibold flex items-center gap-2 mr-4">
                  {act.title.includes('Tree') && '🌳'}
                  {act.title.includes('Blood') && '🩸'}
                  {act.title.includes('Beach') && '🏖️'}
                  {act.title.includes('Safety') && '🛡️'}
                  {act.title}
                </h4>
                <div className="flex-col mt-2 text-sm text-muted">
                  <span>{act.joined_count} joined</span>
                  <span>{act.is_evidence_required ? 'Evidence Required' : 'Open'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'participation' && (
        <div className="animate-fade-in flex-col gap-4">
          <h3 className="text-md font-semibold text-main" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Employee Participation: approval queue</h3>
          <div className="glass-panel" style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
            <table className="data-table w-full text-left" style={{ borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <th className="p-4 text-sm text-muted font-semibold">Employee</th>
                  <th className="p-4 text-sm text-muted font-semibold">Activity/Challenge</th>
                  <th className="p-4 text-sm text-muted font-semibold">Proof</th>
                  <th className="p-4 text-sm text-muted font-semibold">Points</th>
                  <th className="p-4 text-sm text-muted font-semibold">Status</th>
                  <th className="p-4 text-sm text-muted font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="p-4 text-sm text-muted">{row.employee_name}</td>
                    <td className="p-4 text-sm text-muted">{row.activity_title || `Activity #${row.activity_id}`}</td>
                    <td className="p-4 text-sm text-muted">{row.proof_url}</td>
                    <td className="p-4 text-sm text-muted">{row.points_awarded}</td>
                    <td className="p-4">
                      <span className={`badge`} style={{ 
                        borderColor: row.status === 'Approved' ? '#10b981' : row.status === 'Pending' ? '#f59e0b' : '#ef4444',
                        color: row.status === 'Approved' ? '#10b981' : row.status === 'Pending' ? '#f59e0b' : '#ef4444',
                        background: 'transparent' 
                      }}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {row.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            className="btn btn-primary-social" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} 
                            onClick={() => handleApprove(row.id)}
                            disabled={actionLoadingId === `approve-${row.id}`}
                          >
                            {actionLoadingId === `approve-${row.id}` ? '...' : 'Approve'}
                          </button>
                          <button 
                            className="btn" 
                            style={{ background: '#ff7b72', color: 'black', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} 
                            onClick={() => handleReject(row.id)}
                            disabled={actionLoadingId === `reject-${row.id}`}
                          >
                            {actionLoadingId === `reject-${row.id}` ? '...' : 'Reject'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {queue.length === 0 && (
                  <tr><td colSpan="6" className="p-4 text-center text-muted">No pending participations.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'diversity' && (
        <div className="animate-fade-in grid-2 gap-6" style={{ marginTop: '1rem' }}>
          {/* Gender Demographics */}
          <div className="glass-panel p-6 flex-col">
            <h3 className="text-md font-bold text-main mb-6 flex items-center gap-2">
              <Users size={20} color="var(--accent-social)" /> Gender Representation
            </h3>
            
            <div className="flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Female Demographics</span>
                  <span>48%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '48%', height: '100%', background: 'var(--accent-social)', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Male Demographics</span>
                  <span>52%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '52%', height: '100%', background: '#3b82f6', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="glass-panel p-6 flex-col">
            <h3 className="text-md font-bold text-main mb-6 flex items-center gap-2">
              <Award size={20} color="var(--accent-social)" /> Executive & Leadership
            </h3>

            <div className="grid-2 gap-4">
              <div className="glass-panel p-4 text-center">
                <div className="text-xs text-muted uppercase">Female Board Members</div>
                <div className="text-2xl font-bold text-white mt-1">35%</div>
              </div>
              <div className="glass-panel p-4 text-center">
                <div className="text-xs text-muted uppercase">Employee Retention Rate</div>
                <div className="text-2xl font-bold text-white mt-1">94.2%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create CSR Activity">
        <form onSubmit={handleCreate}>
          <label className="text-xs text-muted block mb-2 font-semibold">Activity Title</label>
          <input 
            required 
            type="text" 
            value={formData.title} 
            onChange={e => setFormData({ ...formData, title: e.target.value })} 
            placeholder="e.g. Tree Plantation Drive" 
            className="form-input mb-4"
          />

          <label className="text-xs text-muted block mb-2 font-semibold">Evidence Required?</label>
          <select 
            value={formData.is_evidence_required} 
            onChange={e => setFormData({ ...formData, is_evidence_required: e.target.value === 'true' })}
            className="form-input mb-4"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <label className="text-xs text-muted block mb-2 font-semibold">Status</label>
          <select 
            value={formData.status} 
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="form-input mb-6"
          >
            <option value="Active">Active</option>
            <option value="Open">Open</option>
            <option value="Draft">Draft</option>
          </select>

          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary-social" style={{ background: 'var(--accent-social)', border: 'none' }} disabled={actionLoadingId === 'create'}>
              {actionLoadingId === 'create' ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
