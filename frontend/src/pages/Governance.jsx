import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';

export default function Governance() {
  const [audits, setAudits] = useState([]);
  const [issues, setIssues] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', department: 'Procurement', auditor: '', audit_date: '', findings: 'Pending review', status: 'Under Review' });

  const fetchData = () => {
    fetch('http://localhost:5005/api/governance/audits').then(res => res.json()).then(setAudits).catch(console.error);
    fetch('http://localhost:5005/api/governance/issues').then(res => res.json()).then(setIssues).catch(console.error);
  };

  useEffect(() => fetchData(), []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5005/api/governance/audits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setModalOpen(false);
    setFormData({ title: '', department: 'Procurement', auditor: '', audit_date: '', findings: 'Pending review', status: 'Under Review' });
    fetchData();
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this audit record?")) return;
    await fetch(`http://localhost:5005/api/governance/audits/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleResolveIssue = async (id) => {
    await fetch(`http://localhost:5005/api/governance/issues/${id}/resolve`, { method: 'PUT' });
    fetchData();
  };

  return (
    <div className="module-layout p-6 flex-col gap-4" style={{ height: '100%', overflowY: 'auto' }}>
      
      {/* Sub-Navigation */}
      <div className="sub-nav flex gap-2">
        <button className="btn btn-ghost flex-1" style={{padding: '0.8rem'}}>Policies</button>
        <button className="btn btn-ghost flex-1" style={{padding: '0.8rem'}}>Policy Acknowledgements</button>
        <button className="btn flex-1" style={{padding: '0.8rem', background: '#c084fc', color: '#3b0764', border: 'none'}}>Audits</button>
        <button className="btn btn-ghost flex-1" style={{padding: '0.8rem'}}>Compliance Issues</button>
      </div>

      {/* Action Bar */}
      <div className="action-bar flex justify-between items-center" style={{marginTop: '1rem'}}>
        <div className="flex gap-3">
          <button className="btn" style={{background: '#d8b4fe', color: '#4c1d95', border: 'none'}} onClick={() => setModalOpen(true)}>+ New Audit</button>
          <button className="btn btn-ghost">Export ▾</button>
        </div>
      </div>
      
      {/* Audits Table */}
      <div className="glass-panel" style={{marginTop: '1rem', overflowX: 'auto'}}>
        <table className="data-table w-full text-left" style={{borderCollapse: 'collapse', whiteSpace: 'nowrap'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border-light)'}}>
              <th className="p-4 text-sm text-muted font-semibold">Title</th>
              <th className="p-4 text-sm text-muted font-semibold">Department</th>
              <th className="p-4 text-sm text-muted font-semibold">Auditor</th>
              <th className="p-4 text-sm text-muted font-semibold">Date</th>
              <th className="p-4 text-sm text-muted font-semibold">Findings</th>
              <th className="p-4 text-sm text-muted font-semibold">Status</th>
              <th className="p-4 text-sm text-muted font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {audits.map(audit => (
              <tr key={audit.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                <td className="p-4 text-sm text-muted">{audit.title}</td>
                <td className="p-4 text-sm text-muted">{audit.department}</td>
                <td className="p-4 text-sm text-muted">{audit.auditor}</td>
                <td className="p-4 text-sm text-muted">{audit.audit_date}</td>
                <td className="p-4 text-sm text-muted">{audit.findings}</td>
                <td className="p-4">
                  <span className="badge" style={{ background: 'transparent', borderColor: audit.status === 'Completed' ? '#3b82f6' : '#a855f7', color: audit.status === 'Completed' ? '#3b82f6' : '#a855f7' }}>
                    {audit.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="btn btn-ghost" style={{padding: '0.2rem 0.5rem', color: '#ef4444', borderColor: '#ef4444'}} onClick={() => handleDelete(audit.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compliance Issues Section */}
      <h3 className="text-sm font-semibold text-muted" style={{marginTop: '2rem', marginBottom: '0.5rem'}}>Compliance Issues raised from Audits — severity tagged, resolution tracked</h3>
      <div className="glass-panel" style={{overflowX: 'auto', marginBottom: '2rem'}}>
        <table className="data-table w-full text-left" style={{borderCollapse: 'collapse', whiteSpace: 'nowrap'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border-light)'}}>
              <th className="p-4 text-sm text-muted font-semibold">Issue</th>
              <th className="p-4 text-sm text-muted font-semibold">Severity</th>
              <th className="p-4 text-sm text-muted font-semibold">Department</th>
              <th className="p-4 text-sm text-muted font-semibold">Status</th>
              <th className="p-4 text-sm text-muted font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
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
                    <button className="btn" style={{background: '#22c55e', color: 'white', padding: '0.2rem 0.5rem', fontSize: '0.8rem'}} onClick={() => handleResolveIssue(issue.id)}>
                      Mark Resolved
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New Audit">
        <form onSubmit={handleCreate}>
          <label>Audit Title</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Q3 Safety Check" />
          
          <label>Department</label>
          <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
            <option>Procurement</option>
            <option>Manufacturing</option>
            <option>Logistics</option>
            <option>Corporate</option>
          </select>
          
          <label>Auditor Name</label>
          <input required type="text" value={formData.auditor} onChange={e => setFormData({...formData, auditor: e.target.value})} placeholder="e.g. S. Nair" />
          
          <label>Audit Date</label>
          <input required type="date" value={formData.audit_date} onChange={e => setFormData({...formData, audit_date: e.target.value})} />
          
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn" style={{background: '#c084fc', color: '#3b0764', border: 'none'}}>Create Audit</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
