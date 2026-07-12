import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Modal from '../components/Modal';

export default function Environmental() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', department: 'Manufacturing', target_co2: '', current_co2: '0', deadline: '', status: 'Active' });

  const fetchGoals = () => {
    fetch('http://localhost:5000/api/environmental/goals')
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch(console.error);
  };

  useEffect(() => fetchGoals(), []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/environmental/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setModalOpen(false);
    setFormData({ name: '', department: 'Manufacturing', target_co2: '', current_co2: '0', deadline: '', status: 'Active' });
    fetchGoals();
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this goal?")) return;
    await fetch(`http://localhost:5000/api/environmental/goals/${id}`, { method: 'DELETE' });
    fetchGoals();
  };

  return (
    <div className="module-layout p-6 flex-col gap-4" style={{ height: '100%', overflowY: 'auto' }}>
      
      {/* Sub-Navigation */}
      <div className="sub-nav flex gap-2">
        <button className="btn btn-ghost flex-1" style={{padding: '0.8rem'}}>Emission Factors</button>
        <button className="btn btn-ghost flex-1" style={{padding: '0.8rem'}}>Product ESG Profiles</button>
        <button className="btn btn-ghost flex-1" style={{padding: '0.8rem'}}>Carbon Transactions</button>
        <button className="btn btn-primary-env flex-1" style={{padding: '0.8rem', opacity: 0.9}}>Environmental Goals</button>
      </div>

      {/* Action Bar */}
      <div className="action-bar flex justify-between items-center" style={{marginTop: '1rem'}}>
        <div className="flex gap-3">
          <button className="btn btn-primary-env" onClick={() => setModalOpen(true)}>+ New Goal</button>
          <button className="btn" style={{background: '#d97706', color: 'white'}}>Edit</button>
          <button className="btn" style={{background: '#ef4444', color: 'white'}}>Delete Selected</button>
          <button className="btn btn-ghost">Export ▾</button>
        </div>
        <div className="search-box flex items-center gap-2 px-3 py-2" style={{border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-panel)'}}>
          <Search size={16} color="var(--text-muted)" />
          <input type="text" placeholder="Search goals..." style={{background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', width: '200px', margin: 0, padding: 0}} />
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel" style={{marginTop: '1rem', overflowX: 'auto'}}>
        <table className="data-table w-full text-left" style={{borderCollapse: 'collapse', whiteSpace: 'nowrap'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border-light)'}}>
              <th className="p-4 text-sm text-muted font-semibold">Name</th>
              <th className="p-4 text-sm text-muted font-semibold">Department</th>
              <th className="p-4 text-sm text-muted font-semibold">Target CO₂</th>
              <th className="p-4 text-sm text-muted font-semibold">Current CO₂</th>
              <th className="p-4 text-sm text-muted font-semibold">Progress</th>
              <th className="p-4 text-sm text-muted font-semibold">Deadline</th>
              <th className="p-4 text-sm text-muted font-semibold">Status</th>
              <th className="p-4 text-sm text-muted font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(goal => {
              const progress = Math.round((goal.current_co2 / goal.target_co2) * 100) || 0;
              return (
                <tr key={goal.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                  <td className="p-4 text-sm">{goal.name}</td>
                  <td className="p-4 text-sm text-muted">{goal.department}</td>
                  <td className="p-4 text-sm">{goal.target_co2} t</td>
                  <td className="p-4 text-sm">{goal.current_co2} t</td>
                  <td className="p-4 text-sm flex items-center gap-2">
                    <div style={{width: '100px', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden'}}>
                      <div style={{width: `${Math.min(progress, 100)}%`, height: '100%', background: 'var(--accent-env)'}}></div>
                    </div>
                    <span className="text-muted" style={{fontSize: '0.8rem'}}>{progress}%</span>
                  </td>
                  <td className="p-4 text-sm text-muted">{goal.deadline}</td>
                  <td className="p-4">
                    <span className={`badge badge-${goal.status.replace(/\s+/g, '-').toLowerCase()}`}>
                      {goal.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="btn btn-ghost" style={{padding: '0.2rem 0.5rem', color: '#ef4444', borderColor: '#ef4444'}} onClick={() => handleDelete(goal.id)}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <p className="text-xs text-muted" style={{marginTop: '0.5rem'}}>Row actions: View | Edit | Delete • Carbon Transactions auto-generated from Purchase/Manufacturing/Fleet/Expenses</p>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New Environmental Goal">
        <form onSubmit={handleCreate}>
          <label>Goal Name</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Cut Packaging Waste" />
          
          <label>Department</label>
          <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
            <option>Manufacturing</option>
            <option>Logistics</option>
            <option>Corporate</option>
          </select>
          
          <label>Target CO₂ Reduction (tons)</label>
          <input required type="number" value={formData.target_co2} onChange={e => setFormData({...formData, target_co2: e.target.value})} placeholder="500" />
          
          <label>Deadline</label>
          <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
          
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary-env">Create Goal</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
