import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { Shield, FileText, CheckSquare, AlertOctagon, UserCheck } from 'lucide-react';
import { API_BASE } from '../config';

export default function Governance() {
  const { token } = useAuth();
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState('audits');
  const [audits, setAudits] = useState([]);
  const [issues, setIssues] = useState([]);

  // Modal / Form States
  const [isAuditModalOpen, setAuditModalOpen] = useState(false);
  const [isPolicyModalOpen, setPolicyModalOpen] = useState(false);
  const [auditForm, setAuditForm] = useState({ title: '', department: 'Procurement', auditor: '', audit_date: '' });
  
  const [policies, setPolicies] = useState([
    { name: 'Code of Business Conduct', code: 'POL-CBC', version: 'v3.2', status: 'Published', date: '2026-01-10', ackRate: 98 },
    { name: 'Environmental Compliance Policy', code: 'POL-ECP', version: 'v2.0', status: 'Published', date: '2026-02-15', ackRate: 92 },
    { name: 'Whistleblower Policy', code: 'POL-WBP', version: 'v1.4', status: 'Published', date: '2026-03-01', ackRate: 95 },
    { name: 'Supplier Code of Conduct', code: 'POL-SCC', version: 'v1.0', status: 'Draft', date: '2026-07-01', ackRate: 0 }
  ]);

  const [newPolicy, setNewPolicy] = useState({ name: '', code: '', version: 'v1.0', status: 'Draft', date: new Date().toISOString().split('T')[0], ackRate: 0 });
  
  // Loading states
  const [actionLoadingId, setActionLoadingId] = useState('');

  const fetchData = () => {
    fetch(`${API_BASE}/api/governance/audits`, { headers }).then(res => res.json()).then(setAudits).catch(console.error);
    fetch(`${API_BASE}/api/governance/issues`, { headers }).then(res => res.json()).then(setIssues).catch(console.error);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleCreateAudit = async (e) => {
    e.preventDefault();
    setActionLoadingId('create-audit');
    try {
      const res = await fetch(`${API_BASE}/api/governance/audits`, {
        method: 'POST',
        headers,
        body: JSON.stringify(auditForm)
      });
      if (res.ok) {
        setAuditModalOpen(false);
        setAuditForm({ title: '', department: 'Procurement', auditor: '', audit_date: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId('');
    }
  };

  const handleCreatePolicy = (e) => {
    setPolicies(prev => [...prev, newPolicy]);
    setPolicyModalOpen(false);
    setNewPolicy({ name: '', code: '', version: 'v1.0', status: 'Draft', date: new Date().toISOString().split('T')[0], ackRate: 0 });
  };

  const handleDeleteAudit = async (id) => {
    if (!window.confirm("Delete this audit record?")) return;
    await fetch(`${API_BASE}/api/governance/audits/${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  const handleResolveIssue = async (id) => {
    setActionLoadingId(`resolve-${id}`);
    try {
      await fetch(`${API_BASE}/api/governance/issues/${id}/resolve`, { method: 'PUT', headers });
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
        <h2 className="text-2xl font-bold theme-gov-text">Governance, Compliance & Policies</h2>
        <p className="text-sm text-muted mt-1">Audit compliance regulations, manage company policies, track acknowledgement and resolve issues.</p>
      </div>

      {/* Sub-Navigation */}
      <div className="sub-nav" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        {[
          { key: 'policies', label: 'Policies' },
          { key: 'ack', label: 'Policy Acknowledgements' },
          { key: 'audits', label: 'Audits' },
          { key: 'issues', label: 'Compliance Issues' }
        ].map(tab => (
          <button
            key={tab.key}
            className="text-sm font-semibold rounded-t-lg transition-colors"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              background: activeTab === tab.key ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent-gov)' : '2px solid transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'policies' && (
        <div className="animate-fade-in flex-col gap-4">
          <div className="action-bar" style={{ marginTop: '1rem' }}>
            <button className="btn" style={{ background: 'var(--accent-gov)', color: 'white', border: 'none' }} onClick={() => setPolicyModalOpen(true)}>+ New Policy</button>
          </div>

          <div className="glass-panel overflow-hidden mb-8" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)'}}>
                  <th className="p-4 text-xs text-white font-semibold">Policy Name</th>
                  <th className="p-4 text-xs text-white font-semibold">Code</th>
                  <th className="p-4 text-xs text-white font-semibold">Version</th>
                  <th className="p-4 text-xs text-white font-semibold">Effective Date</th>
                  <th className="p-4 text-xs text-white font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map(policy => (
                  <tr key={policy.code} style={{borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'transparent'}}>
                    <td className="p-4 text-xs text-main font-semibold">{policy.name}</td>
                    <td className="p-4 text-xs text-muted">{policy.code}</td>
                    <td className="p-4 text-xs text-muted">{policy.version}</td>
                    <td className="p-4 text-xs text-muted">{policy.date}</td>
                    <td className="p-4">
                      <span className="px-4 py-1 text-xs font-semibold rounded border" style={{ 
                        borderColor: policy.status === 'Published' ? '#22c55e' : '#f59e0b', 
                        color: policy.status === 'Published' ? '#22c55e' : '#f59e0b', 
                        background: 'transparent' 
                      }}>
                        {policy.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ack' && (
        <div className="animate-fade-in grid-2 gap-6" style={{ marginTop: '1rem' }}>
          <div className="glass-panel p-6 flex-col">
            <h3 className="text-md font-bold text-main mb-6 flex items-center gap-2">
              <UserCheck size={20} color="var(--accent-gov)" /> Employee Acknowledgement Metrics
            </h3>
            
            <div className="flex-col gap-4">
              {policies.filter(p => p.status === 'Published').map(p => (
                <div key={p.code}>
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>{p.name}</span>
                    <span>{p.ackRate}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.ackRate}%`, height: '100%', background: 'var(--accent-gov)', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audits' && (
        <div className="animate-fade-in flex-col gap-4">
          <div className="action-bar" style={{ marginTop: '1rem' }}>
            <button className="btn" style={{ background: 'var(--accent-gov)', color: 'white', border: 'none' }} onClick={() => setAuditModalOpen(true)}>+ New Audit</button>
          </div>

          <div className="glass-panel overflow-hidden" style={{ marginTop: '1rem', overflowX: 'auto' }}>
            <table className="data-table w-full text-left" style={{ borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <th className="p-4 text-sm text-muted font-semibold">Title</th>
                  <th className="p-4 text-sm text-muted font-semibold">Department</th>
                  <th className="p-4 text-sm text-muted font-semibold">Auditor</th>
                  <th className="p-4 text-sm text-muted font-semibold">Date</th>
                  <th className="p-4 text-sm text-muted font-semibold">Findings</th>
                  <th className="p-4 text-sm text-muted font-semibold">Status</th>
                  <th className="p-4 text-sm text-muted font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {audits.map(audit => (
                  <tr key={audit.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="p-4 text-sm text-muted">{audit.title}</td>
                    <td className="p-4 text-sm text-muted">{audit.department}</td>
                    <td className="p-4 text-sm text-muted">{audit.auditor}</td>
                    <td className="p-4 text-sm text-muted">{audit.audit_date}</td>
                    <td className="p-4 text-sm text-muted">{audit.findings}</td>
                    <td className="p-4">
                      <span className="badge" style={{ 
                        background: 'transparent', 
                        borderColor: audit.status === 'Completed' ? '#10b981' : '#a855f7', 
                        color: audit.status === 'Completed' ? '#10b981' : '#a855f7' 
                      }}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="btn btn-ghost" style={{ padding: '0.2rem 0.5rem', color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDeleteAudit(audit.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="animate-fade-in flex-col gap-4">
          <h3 className="text-sm font-semibold text-muted" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Compliance Issues raised from Audits</h3>
          <div className="glass-panel overflow-hidden" style={{ overflowX: 'auto', marginBottom: '2rem' }}>
            <table className="data-table w-full text-left" style={{ borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <th className="p-4 text-sm text-muted font-semibold">Issue</th>
                  <th className="p-4 text-sm text-muted font-semibold">Severity</th>
                  <th className="p-4 text-sm text-muted font-semibold">Department</th>
                  <th className="p-4 text-sm text-muted font-semibold">Status</th>
                  <th className="p-4 text-sm text-muted font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="p-4 text-sm text-muted">{issue.issue_text}</td>
                    <td className="p-4">
                      <span className="badge" style={{ background: 'transparent', borderColor: issue.severity === 'High' ? '#ef4444' : '#f59e0b', color: issue.severity === 'High' ? '#ef4444' : '#f59e0b' }}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted">{issue.department}</td>
                    <td className="p-4">
                      <span className="badge" style={{ background: 'transparent', borderColor: issue.status === 'Open' ? '#ef4444' : '#22c55e', color: issue.status === 'Open' ? '#ef4444' : '#22c55e' }}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {issue.status === 'Open' && (
                        <button 
                          className="btn" 
                          style={{ background: '#22c55e', color: 'white', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} 
                          onClick={() => handleResolveIssue(issue.id)}
                          disabled={actionLoadingId === `resolve-${issue.id}`}
                        >
                          {actionLoadingId === `resolve-${issue.id}` ? 'Resolving...' : 'Mark Resolved'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Audit Modal */}
      <Modal isOpen={isAuditModalOpen} onClose={() => setAuditModalOpen(false)} title="New Audit">
        <form onSubmit={handleCreateAudit}>
          <label className="text-xs text-muted block mb-2 font-semibold">Audit Title</label>
          <input required type="text" value={auditForm.title} onChange={e => setAuditForm({ ...auditForm, title: e.target.value })} placeholder="e.g. Q3 Safety Check" className="form-input mb-4" />
          
          <label className="text-xs text-muted block mb-2 font-semibold">Department</label>
          <select value={auditForm.department} onChange={e => setAuditForm({ ...auditForm, department: e.target.value })} className="form-input mb-4">
            <option value="Procurement">Procurement</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Logistics">Logistics</option>
            <option value="Corporate">Corporate</option>
          </select>
          
          <label className="text-xs text-muted block mb-2 font-semibold">Auditor Name</label>
          <input required type="text" value={auditForm.auditor} onChange={e => setAuditForm({ ...auditForm, auditor: e.target.value })} placeholder="e.g. S. Nair" className="form-input mb-4" />
          
          <label className="text-xs text-muted block mb-2 font-semibold">Audit Date</label>
          <input required type="date" value={auditForm.audit_date} onChange={e => setAuditForm({ ...auditForm, audit_date: e.target.value })} className="form-input mb-6" />
          
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setAuditModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn" style={{ background: 'var(--accent-gov)', color: 'white', border: 'none' }} disabled={actionLoadingId === 'create-audit'}>
              {actionLoadingId === 'create-audit' ? 'Creating...' : 'Create Audit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* New Policy Modal */}
      <Modal isOpen={isPolicyModalOpen} onClose={() => setPolicyModalOpen(false)} title="New Corporate Policy">
        <form onSubmit={handleCreatePolicy}>
          <label className="text-xs text-muted block mb-2 font-semibold">Policy Name</label>
          <input required type="text" value={newPolicy.name} onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value })} placeholder="e.g. Anti-Bribery Policy" className="form-input mb-4" />
          
          <label className="text-xs text-muted block mb-2 font-semibold">Code</label>
          <input required type="text" value={newPolicy.code} onChange={e => setNewPolicy({ ...newPolicy, code: e.target.value })} placeholder="e.g. POL-ABP" className="form-input mb-4" />
          
          <label className="text-xs text-muted block mb-2 font-semibold">Version</label>
          <input required type="text" value={newPolicy.version} onChange={e => setNewPolicy({ ...newPolicy, version: e.target.value })} placeholder="e.g. v1.0" className="form-input mb-4" />
          
          <label className="text-xs text-muted block mb-2 font-semibold">Effective Date</label>
          <input required type="date" value={newPolicy.date} onChange={e => setNewPolicy({ ...newPolicy, date: e.target.value })} className="form-input mb-6" />
          
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setPolicyModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn" style={{ background: 'var(--accent-gov)', color: 'white', border: 'none' }}>Create Policy</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
