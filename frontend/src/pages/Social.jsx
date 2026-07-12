import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';

export default function Social() {
  const [activities, setActivities] = useState([]);
  const [queue, setQueue] = useState([]);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', is_evidence_required: true, status: 'Active' });

  const fetchData = () => {
    fetch('http://localhost:5000/api/social/activities').then(res => res.json()).then(setActivities).catch(console.error);
    fetch('http://localhost:5000/api/social/participations').then(res => res.json()).then(setQueue).catch(console.error);
  };

  useEffect(() => fetchData(), []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/social/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setModalOpen(false);
    setFormData({ title: '', is_evidence_required: true, status: 'Active' });
    fetchData();
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this activity?")) return;
    await fetch(`http://localhost:5000/api/social/activities/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleApprove = async (id) => {
    await fetch(`http://localhost:5000/api/social/participations/${id}/approve`, { method: 'POST' });
    fetchData();
  };
  
  const handleReject = async (id) => {
    await fetch(`http://localhost:5000/api/social/participations/${id}/reject`, { method: 'POST' });
    fetchData();
  };

  return (
    <div className="module-layout p-6 flex-col gap-4" style={{ height: '100%', overflowY: 'auto' }}>
      
      {/* Sub-Navigation */}
      <div className="sub-nav flex gap-2">
        <button className="btn btn-primary-social flex-1" style={{padding: '0.8rem', opacity: 0.9}}>CSR Activities</button>
        <button className="btn btn-ghost flex-1" style={{padding: '0.8rem'}}>Employee Participation</button>
        <button className="btn btn-ghost flex-1" style={{padding: '0.8rem'}}>Diversity Dashboard</button>
      </div>

      {/* Action Bar */}
      <div className="action-bar flex justify-between items-center" style={{marginTop: '1rem'}}>
        <button className="btn btn-primary-social" onClick={() => setModalOpen(true)}>+ New Activity</button>
      </div>
      
      {/* Activities Grid */}
      <div className="grid-4 gap-4" style={{marginTop: '1rem'}}>
        {activities.map(act => (
          <div key={act.id} className="glass-panel p-4 flex-col gap-2 relative" style={{borderColor: 'var(--accent-social)', borderRadius: '16px'}}>
            <button onClick={() => handleDelete(act.id)} style={{position: 'absolute', top: 10, right: 10, background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer'}} title="Delete Activity">✖</button>
            <h4 className="text-md font-semibold flex items-center gap-2 mr-4">
              {act.title.includes('Tree') && '🌳'}
              {act.title.includes('Blood') && '🩸'}
              {act.title.includes('Beach') && '🏖️'}
              {act.title.includes('ESG') && '📚'}
              {act.title}
            </h4>
            <div className="flex-col mt-2 text-sm text-muted">
              <span>{act.joined_count} joined</span>
              <span>{act.is_evidence_required ? 'Evidence Required' : 'Open'}</span>
            </div>
            <button className="btn btn-primary-social" style={{width: 'fit-content', marginTop: '0.5rem', borderRadius: '8px', padding: '0.4rem 1.2rem'}}>Join</button>
          </div>
        ))}
      </div>

      {/* Approval Queue Table */}
      <h3 className="text-md font-semibold text-main" style={{marginTop: '2rem', marginBottom: '0.5rem'}}>Employee Participation: approval queue</h3>
      <div className="glass-panel" style={{overflowX: 'auto', paddingBottom: '1rem'}}>
        <table className="data-table w-full text-left" style={{borderCollapse: 'collapse', whiteSpace: 'nowrap'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border-light)'}}>
              <th className="p-4 text-sm text-muted font-semibold">Employee</th>
              <th className="p-4 text-sm text-muted font-semibold">Activity/Challenge</th>
              <th className="p-4 text-sm text-muted font-semibold">Proof</th>
              <th className="p-4 text-sm text-muted font-semibold">Points</th>
              <th className="p-4 text-sm text-muted font-semibold">Approval</th>
              <th className="p-4 text-sm text-muted font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.map(row => (
              <tr key={row.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                <td className="p-4 text-sm text-muted">{row.employee_name}</td>
                <td className="p-4 text-sm text-muted">{row.activity_title || `Activity #${row.activity_id}`}</td>
                <td className="p-4 text-sm text-muted">{row.proof_url}</td>
                <td className="p-4 text-sm text-muted">{row.points_awarded}</td>
                <td className="p-4">
                  <span className={`badge badge-${row.status.toLowerCase()}`} style={{background: 'transparent'}}>
                    {row.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                   {row.status === 'Pending' && (
                     <div className="flex justify-end gap-2">
                       <button className="btn btn-primary-social" style={{padding: '0.2rem 0.5rem', fontSize: '0.8rem'}} onClick={() => handleApprove(row.id)}>Approve</button>
                       <button className="btn" style={{background: '#ff7b72', color: 'black', padding: '0.2rem 0.5rem', fontSize: '0.8rem'}} onClick={() => handleReject(row.id)}>Reject</button>
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
      
      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create CSR Activity">
        <form onSubmit={handleCreate}>
          <label>Activity Title</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Tree Plantation Drive" />
          
          <label>Evidence Required?</label>
          <select value={formData.is_evidence_required} onChange={e => setFormData({...formData, is_evidence_required: e.target.value === 'true'})}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          
          <label>Status</label>
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option>Active</option>
            <option>Open</option>
            <option>Draft</option>
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary-social">Create Activity</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
