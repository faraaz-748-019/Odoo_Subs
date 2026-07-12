import React, { useState } from 'react';
import { 
  FileText, Download, Filter, BarChart2, PieChart, Activity, 
  CheckCircle, AlertTriangle, Users, TrendingUp, Play, Leaf, Heart, Shield, LayoutGrid, Settings2
} from 'lucide-react';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('esg-summary');
  const [generating, setGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleGenerate = (reportName) => {
    setGenerating(true);
    setSuccessMessage('');
    
    // Simulate generation time
    setTimeout(() => {
      setGenerating(false);
      setSuccessMessage(`${reportName} generated and downloaded successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  return (
    <div className="module-layout p-6 flex-col gap-6" style={{ height: '100%', overflowY: 'auto' }}>
      
      <div className="mb-2">
        <h2 className="text-2xl font-bold theme-reports-text">Reports: Analytics & Custom Report Builder</h2>
        <p className="text-sm text-muted mt-1">Generate comprehensive insights, track long-term trends, and export ESG disclosures.</p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-4 border-b border-light pb-2 mb-4 overflow-x-auto no-scrollbar">
        <button 
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'environmental' ? 'bg-panel-solid text-white border-b-2 border-green-500' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('environmental')}
        >
          Environmental
        </button>
        <button 
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'social' ? 'bg-panel-solid text-white border-b-2 border-rose-500' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('social')}
        >
          Social
        </button>
        <button 
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'governance' ? 'bg-panel-solid text-white border-b-2 border-blue-500' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('governance')}
        >
          Governance
        </button>
        <button 
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'esg-summary' ? 'bg-[var(--bg-panel-solid)] text-white border-b-2 border-gray-400' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('esg-summary')}
          style={{ background: activeTab === 'esg-summary' ? 'rgba(255,255,255,0.05)' : 'transparent', borderColor: activeTab === 'esg-summary' ? '#cbd5e1' : 'transparent' }}
        >
          ESG Summary
        </button>
        <button 
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'custom' ? 'bg-panel-solid text-white border-b-2 border-[var(--accent-reports)]' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('custom')}
        >
          Custom Builder
        </button>
      </div>

      {successMessage && (
        <div className="glass-panel p-4 mb-2 flex items-center gap-3 animate-fade-in" style={{ borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
          <CheckCircle color="#10b981" size={20} />
          <div className="text-sm font-semibold" style={{ color: '#10b981' }}>{successMessage}</div>
        </div>
      )}

      {/* Pre-Built Report Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Environmental Report */}
        <div className="glass-panel p-6 flex flex-col hover-lift" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={20} color="#10b981" />
            <h3 className="font-bold text-main">Environmental Report</h3>
          </div>
          <p className="text-xs text-muted mb-8">Emissions, goals, vendor & product breakdown</p>
          <button 
            className="btn mt-auto font-semibold py-2 px-6 rounded-lg self-start transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={() => handleGenerate('Environmental Report')}
            disabled={generating}
          >
            {generating ? <Activity className="animate-spin inline mr-2" size={16} /> : null} Generate
          </button>
        </div>

        {/* Social Report */}
        <div className="glass-panel p-6 flex flex-col hover-lift" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Heart size={20} color="#f43f5e" />
            <h3 className="font-bold text-main">Social Report</h3>
          </div>
          <p className="text-xs text-muted mb-8">Diversity, CSR participation, training completion</p>
          <button 
            className="btn mt-auto font-semibold py-2 px-6 rounded-lg self-start transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={() => handleGenerate('Social Report')}
            disabled={generating}
          >
            {generating ? <Activity className="animate-spin inline mr-2" size={16} /> : null} Generate
          </button>
        </div>

        {/* Governance Report */}
        <div className="glass-panel p-6 flex flex-col hover-lift" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} color="#3b82f6" />
            <h3 className="font-bold text-main">Governance Report</h3>
          </div>
          <p className="text-xs text-muted mb-8">Policies, audits, compliance & risk summary</p>
          <button 
            className="btn mt-auto font-semibold py-2 px-6 rounded-lg self-start transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={() => handleGenerate('Governance Report')}
            disabled={generating}
          >
            {generating ? <Activity className="animate-spin inline mr-2" size={16} /> : null} Generate
          </button>
        </div>

        {/* ESG Summary */}
        <div className="glass-panel p-6 flex flex-col hover-lift" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid size={20} className="theme-reports-text" />
            <h3 className="font-bold text-main">ESG Summary</h3>
          </div>
          <p className="text-xs text-muted mb-8">Executive overview: all 4 scores + dept comparison</p>
          <button 
            className="btn mt-auto font-semibold py-2 px-6 rounded-lg self-start transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={() => handleGenerate('ESG Summary Report')}
            disabled={generating}
          >
            {generating ? <Activity className="animate-spin inline mr-2" size={16} /> : null} Generate
          </button>
        </div>

      </div>

      {/* Custom Report Builder */}
      <div className="glass-panel p-8" style={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 className="text-lg font-bold text-main mb-6 flex items-center gap-2">
          <Settings2 size={20} className="theme-reports-text" /> Custom Report Builder: Filters
        </h3>
        
        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <select className="form-input w-full rounded-lg" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
              <option value="">Date Range</option>
              <option value="ytd">Year to Date</option>
              <option value="q1">Q1 2026</option>
              <option value="q2">Q2 2026</option>
              <option value="q3">Q3 2026</option>
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <select className="form-input w-full rounded-lg" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
              <option value="">Department</option>
              <option value="eng">Engineering</option>
              <option value="sales">Sales</option>
              <option value="hr">Human Resources</option>
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <select className="form-input w-full rounded-lg" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
              <option value="">Module</option>
              <option value="env">Environmental</option>
              <option value="soc">Social</option>
              <option value="gov">Governance</option>
              <option value="gam">Gamification</option>
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <select className="form-input w-full rounded-lg" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
              <option value="">Employee</option>
              <option value="all">All Employees</option>
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <select className="form-input w-full rounded-lg" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
              <option value="">Challenge</option>
              <option value="all">All Challenges</option>
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <select className="form-input w-full rounded-lg" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
              <option value="">ESG Category</option>
              <option value="emissions">Emissions</option>
              <option value="diversity">Diversity</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-4">
          <button 
            className="btn flex items-center gap-2 font-bold py-2 px-6 rounded-lg transition-all"
            style={{ background: 'transparent', border: '1px solid var(--accent-reports)', color: 'var(--accent-reports)' }}
            onClick={() => handleGenerate('Custom Report')}
            disabled={generating}
          >
            {generating ? <Activity className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
            Run Report
          </button>
          
          <button 
            className="btn flex items-center gap-2 font-semibold py-2 px-6 rounded-lg transition-all"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-muted)' }}
            onClick={() => handleGenerate('PDF Export')}
            disabled={generating}
          >
            Export: PDF
          </button>
          
          <button 
            className="btn flex items-center gap-2 font-semibold py-2 px-6 rounded-lg transition-all"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-muted)' }}
            onClick={() => handleGenerate('Excel Export')}
            disabled={generating}
          >
            Export: Excel
          </button>

          <button 
            className="btn flex items-center gap-2 font-semibold py-2 px-6 rounded-lg transition-all"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-muted)' }}
            onClick={() => handleGenerate('CSV Export')}
            disabled={generating}
          >
            Export: CSV
          </button>
        </div>
      </div>
      
    </div>
  );
}
