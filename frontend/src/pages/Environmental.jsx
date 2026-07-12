import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Modal from '../components/Modal';

export default function Environmental() {
  const [goals, setGoals] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Filtering States
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Premium UI States
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, isMultiple: false, id: null });
  
  const defaultForm = { name: '', department: 'Manufacturing', target_co2: '', current_co2: '0', deadline: '', status: 'Active' };
  const [formData, setFormData] = useState(defaultForm);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchGoals = () => {
    fetch('http://localhost:5005/api/environmental/goals')
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch(console.error);
  };

  useEffect(() => fetchGoals(), []);

  const openNewModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setModalOpen(true);
  };

  const openEditModal = () => {
    if (selectedIds.size !== 1) {
      return showToast("Please select exactly one goal to edit.");
    }
    const idToEdit = Array.from(selectedIds)[0];
    const goal = goals.find(g => g.id === idToEdit);
    if (goal) {
      setEditingId(goal.id);
      setFormData(goal);
      setModalOpen(true);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`http://localhost:5005/api/environmental/goals/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } else {
      await fetch('http://localhost:5005/api/environmental/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    }
    setModalOpen(false);
    setSelectedIds(new Set());
    showToast(`Goal ${editingId ? 'updated' : 'created'} successfully!`, 'success');
    fetchGoals();
  };

  const promptDelete = (id) => {
    setConfirmDelete({ isOpen: true, isMultiple: false, id });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return showToast("No goals selected.");
    setConfirmDelete({ isOpen: true, isMultiple: true, id: null });
  };

  const executeDelete = async () => {
    if (confirmDelete.isMultiple) {
      await Promise.all(
        Array.from(selectedIds).map(id => fetch(`http://localhost:5005/api/environmental/goals/${id}`, { method: 'DELETE' }))
      );
      setSelectedIds(new Set());
      showToast(`${selectedIds.size} goal(s) deleted.`, 'success');
    } else if (confirmDelete.id) {
      await fetch(`http://localhost:5005/api/environmental/goals/${confirmDelete.id}`, { method: 'DELETE' });
      showToast("Goal deleted.", 'success');
    }
    setConfirmDelete({ isOpen: false, isMultiple: false, id: null });
    fetchGoals();
  };

  const handleExport = () => {
    if (goals.length === 0) return showToast("No data to export.");
    
    // Create CSV header
    const headers = Object.keys(goals[0]).join(',');
    // Create CSV rows
    const rows = goals.map(g => Object.values(g).map(v => `"${v}"`).join(',')).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "environmental_goals_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const filteredGoals = goals.filter(goal => {
    if (filterDept && goal.department !== filterDept) return false;
    if (filterStatus && goal.status !== filterStatus) return false;
    if (searchQuery && !goal.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredGoals.length && filteredGoals.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredGoals.map(g => g.id)));
    }
  };

  return (
    <div className="module-layout p-6 flex-col gap-4" style={{ height: '100%', overflowY: 'auto' }}>
      
      {/* Filters Row */}
      <div className="grid-4 gap-3">
        <select className="select-input w-full" onChange={e => setFilterDept(e.target.value)} value={filterDept}>
          <option value="">Emission Factors (All)</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Logistics">Logistics</option>
          <option value="Corporate">Corporate</option>
        </select>

        <select className="select-input w-full" onChange={e => setFilterStatus(e.target.value)} value={filterStatus}>
          <option value="">Product ESG Profiles (All)</option>
          <option value="Active">Active</option>
          <option value="On Track">On Track</option>
          <option value="Completed">Completed</option>
        </select>

        <select className="select-input w-full">
          <option value="">Carbon Transactions (All)</option>
          <option value="high">High Volume</option>
          <option value="low">Low Volume</option>
        </select>

        <div className="search-input-container w-full">
          <Search size={16} color="var(--text-muted)" />
          <input type="text" placeholder="Search Goals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Action Bar Row */}
      <div className="grid-4 gap-3 mt-2">
        <button className="btn btn-primary-env w-full" onClick={openNewModal}>+ New Goal</button>
        <button className="btn btn-secondary w-full" onClick={openEditModal}>Edit Selected</button>
        <button className="btn btn-danger-outline w-full" onClick={handleDeleteSelected}>Delete Selected</button>
        <button className="btn btn-secondary w-full" onClick={handleExport}>Export to CSV ▾</button>
      </div>

      {/* Data Table */}
      <div className="glass-panel" style={{marginTop: '1rem', overflowX: 'auto'}}>
        <table className="data-table w-full text-left" style={{borderCollapse: 'collapse', whiteSpace: 'nowrap'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border-light)'}}>
              <th className="p-4" style={{width: '40px'}}>
                <input type="checkbox" onChange={toggleSelectAll} checked={filteredGoals.length > 0 && selectedIds.size === filteredGoals.length} />
              </th>
              <th className="p-4 text-sm text-muted font-semibold">Name</th>
              <th className="p-4 text-sm text-muted font-semibold">Department</th>
              <th className="p-4 text-sm text-muted font-semibold">Target CO₂</th>
              <th className="p-4 text-sm text-muted font-semibold">Current CO₂</th>
              <th className="p-4 text-sm text-muted font-semibold">Progress</th>
              <th className="p-4 text-sm text-muted font-semibold">Deadline</th>
              <th className="p-4 text-sm text-muted font-semibold">Status</th>
              <th className="p-4 text-sm text-muted font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGoals.map(goal => {
              const progress = Math.round((goal.current_co2 / goal.target_co2) * 100) || 0;
              return (
                <tr key={goal.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)', background: selectedIds.has(goal.id) ? 'rgba(46, 160, 67, 0.1)' : 'transparent'}}>
                  <td className="p-4">
                    <input type="checkbox" checked={selectedIds.has(goal.id)} onChange={() => toggleSelect(goal.id)} />
                  </td>
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
                  <td className="p-4 text-right">
                    <button className="btn btn-ghost" style={{padding: '0.2rem 0.5rem', color: '#ef4444', borderColor: '#ef4444'}} onClick={() => promptDelete(goal.id)}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <p className="text-xs text-muted" style={{marginTop: '0.5rem'}}>Row actions: View | Edit | Delete • Carbon Transactions auto-generated from Purchase/Manufacturing/Fleet/Expenses</p>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Environmental Goal" : "New Environmental Goal"}>
        <form onSubmit={handleSave}>
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
          
          <label>Current CO₂ Reduction (tons)</label>
          <input required type="number" value={formData.current_co2} onChange={e => setFormData({...formData, current_co2: e.target.value})} placeholder="0" />
          
          <label>Deadline</label>
          <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
          
          <label>Status</label>
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option>Active</option>
            <option>Completed</option>
            <option>On Track</option>
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary-env">{editingId ? "Save Changes" : "Create Goal"}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={confirmDelete.isOpen} onClose={() => setConfirmDelete({isOpen: false})} title="Confirm Deletion">
        <div className="p-2">
          <p className="text-muted mb-6">
            Are you sure you want to delete {confirmDelete.isMultiple ? <strong>{selectedIds.size} selected goal(s)</strong> : 'this goal'}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button className="btn btn-ghost" onClick={() => setConfirmDelete({isOpen: false})}>Cancel</button>
            <button className="btn btn-danger-outline" style={{background: 'rgba(239, 68, 68, 0.1)'}} onClick={executeDelete}>Yes, Delete</button>
          </div>
        </div>
      </Modal>

      {/* Premium Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '2rem', left: '50%', zIndex: 9999,
          background: 'rgba(22, 27, 34, 0.95)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)'}`,
          padding: '1.25rem 2.5rem', borderRadius: 'var(--radius-lg)',
          boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 40px ${toast.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
          display: 'flex', alignItems: 'center', gap: '1rem',
          animation: 'toastDrop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
        }}>
          {toast.type === 'error' ? <span style={{color: '#ef4444', fontSize: '1.6rem'}}>⚠️</span> : <span style={{color: '#10b981', fontSize: '1.6rem'}}>✨</span>}
          <span style={{color: 'var(--text-main)', fontWeight: 600, fontSize: '1.1rem'}}>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
