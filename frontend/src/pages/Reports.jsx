import React, { useState } from 'react';
import { 
  FileText, Download, Filter, BarChart2, PieChart, Activity, 
  CheckCircle, AlertTriangle, Users, TrendingUp, Play, Leaf, Heart, Shield, LayoutGrid, Settings2
} from 'lucide-react';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('esg-summary');
  
  // Track separate loading keys instead of a single boolean
  const [generatingKey, setGeneratingKey] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');

  // Filter States
  const [filters, setFilters] = useState({
    dateRange: 'ytd',
    department: 'all',
    module: 'all',
    employee: 'all',
    challenge: 'all',
    esgCategory: 'all'
  });

  // Report output state
  const [reportOutput, setReportOutput] = useState(null);

  const handleGenerate = (reportName, key) => {
    setGeneratingKey(key);
    setSuccessMessage('');
    
    // Simulate generation time
    setTimeout(() => {
      setGeneratingKey('');
      setSuccessMessage(`${reportName} generated and downloaded successfully.`);
      
      // Simulate file download by creating a blob
      const fileContent = `EcoSphere ESG Platform - ${reportName}\nGenerated on: ${new Date().toLocaleDateString()}\nStatus: Verified`;
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setSuccessMessage(''), 4000);
    }, 1500);
  };

  const handleRunReport = (e) => {
    e.preventDefault();
    setGeneratingKey('run-report');
    
    setTimeout(() => {
      setGeneratingKey('');
      
      // Generate some nice, filtered mock rows based on selection
      const mockData = [
        { id: 1, date: '2026-07-02', dept: filters.department === 'all' ? 'Manufacturing' : filters.department, module: filters.module === 'all' ? 'Environmental' : filters.module, metric: 'CO2 Reduction', value: '24%', status: 'Completed' },
        { id: 2, date: '2026-07-05', dept: filters.department === 'all' ? 'Engineering' : filters.department, module: filters.module === 'all' ? 'Social' : filters.module, metric: 'CSR Participation', value: '85%', status: 'Active' },
        { id: 3, date: '2026-07-08', dept: filters.department === 'all' ? 'Corporate' : filters.department, module: filters.module === 'all' ? 'Governance' : filters.module, metric: 'Audits Completed', value: '100%', status: 'Under Review' }
      ];

      setReportOutput({
        timestamp: new Date().toLocaleTimeString(),
        filtersUsed: { ...filters },
        rows: mockData
      });
    }, 1200);
  };

  const triggerExport = (format) => {
    setGeneratingKey(`export-${format}`);
    
    setTimeout(() => {
      setGeneratingKey('');
      setSuccessMessage(`Custom Report successfully exported as ${format.toUpperCase()}`);
      
      // Dynamic Blob download for real functionality
      let fileContent = '';
      let mimeType = 'text/plain';
      let extension = 'txt';

      if (format === 'csv') {
        fileContent = 'ID,Date,Department,Module,Metric,Value,Status\n1,2026-07-02,Manufacturing,Environmental,CO2 Reduction,24%,Completed\n2,2026-07-05,Engineering,Social,CSR Participation,85%,Active';
        mimeType = 'text/csv';
        extension = 'csv';
      } else {
        fileContent = `EcoSphere ESG Export - Format: ${format.toUpperCase()}\nGenerated on: ${new Date().toLocaleDateString()}\nData summary matches active filters.`;
      }

      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `esg_report_export.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setSuccessMessage(''), 4000);
    }, 1200);
  };

  return (
    <div className="module-layout p-6 flex-col gap-6" style={{ height: '100%', overflowY: 'auto' }}>
      
      <div className="mb-2">
        <h2 className="text-2xl font-bold theme-reports-text">Reports: Analytics & Custom Report Builder</h2>
        <p className="text-sm text-muted mt-1">Generate comprehensive insights, track long-term trends, and export ESG disclosures.</p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="sub-nav" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        {[
          { key: 'environmental', label: 'Environmental', color: '#10b981' },
          { key: 'social', label: 'Social', color: '#f43f5e' },
          { key: 'governance', label: 'Governance', color: '#3b82f6' },
          { key: 'esg-summary', label: 'ESG Summary', color: '#cbd5e1' },
          { key: 'custom', label: 'Custom Builder', color: 'var(--accent-reports)' }
        ].map(tab => (
          <button
            key={tab.key}
            className="text-sm font-semibold rounded-t-lg transition-colors"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              background: activeTab === tab.key ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
              borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : '2px solid transparent',
              border: activeTab !== tab.key ? 'none' : undefined,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
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
        <div className="glass-panel p-6 flex-col hover-lift" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={20} color="#10b981" />
            <h3 className="font-bold text-main">Environmental Report</h3>
          </div>
          <p className="text-xs text-muted mb-8">Emissions, goals, vendor & product breakdown</p>
          <button 
            className="btn mt-auto font-semibold py-2 px-6 rounded-lg self-start transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={() => handleGenerate('Environmental Report', 'env-rep')}
            disabled={generatingKey !== ''}
          >
            {generatingKey === 'env-rep' ? <Activity className="animate-spin inline mr-2" size={16} /> : null} 
            {generatingKey === 'env-rep' ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Social Report */}
        <div className="glass-panel p-6 flex-col hover-lift" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Heart size={20} color="#f43f5e" />
            <h3 className="font-bold text-main">Social Report</h3>
          </div>
          <p className="text-xs text-muted mb-8">Diversity, CSR participation, training completion</p>
          <button 
            className="btn mt-auto font-semibold py-2 px-6 rounded-lg self-start transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={() => handleGenerate('Social Report', 'soc-rep')}
            disabled={generatingKey !== ''}
          >
            {generatingKey === 'soc-rep' ? <Activity className="animate-spin inline mr-2" size={16} /> : null} 
            {generatingKey === 'soc-rep' ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Governance Report */}
        <div className="glass-panel p-6 flex-col hover-lift" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} color="#3b82f6" />
            <h3 className="font-bold text-main">Governance Report</h3>
          </div>
          <p className="text-xs text-muted mb-8">Policies, audits, compliance & risk summary</p>
          <button 
            className="btn mt-auto font-semibold py-2 px-6 rounded-lg self-start transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={() => handleGenerate('Governance Report', 'gov-rep')}
            disabled={generatingKey !== ''}
          >
            {generatingKey === 'gov-rep' ? <Activity className="animate-spin inline mr-2" size={16} /> : null} 
            {generatingKey === 'gov-rep' ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* ESG Summary */}
        <div className="glass-panel p-6 flex-col hover-lift" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid size={20} className="theme-reports-text" />
            <h3 className="font-bold text-main">ESG Summary</h3>
          </div>
          <p className="text-xs text-muted mb-8">Executive overview: all 4 scores + dept comparison</p>
          <button 
            className="btn mt-auto font-semibold py-2 px-6 rounded-lg self-start transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={() => handleGenerate('ESG Summary Report', 'esg-rep')}
            disabled={generatingKey !== ''}
          >
            {generatingKey === 'esg-rep' ? <Activity className="animate-spin inline mr-2" size={16} /> : null} 
            {generatingKey === 'esg-rep' ? 'Generating...' : 'Generate'}
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
            <label className="text-xs text-muted block mb-1 font-semibold">Date Range</label>
            <select 
              value={filters.dateRange} 
              onChange={e => setFilters({ ...filters, dateRange: e.target.value })}
              className="form-input w-full rounded-lg" 
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <option value="ytd">Year to Date</option>
              <option value="q1">Q1 2026</option>
              <option value="q2">Q2 2026</option>
              <option value="q3">Q3 2026</option>
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <label className="text-xs text-muted block mb-1 font-semibold">Department</label>
            <select 
              value={filters.department} 
              onChange={e => setFilters({ ...filters, department: e.target.value })}
              className="form-input w-full rounded-lg" 
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <option value="all">All Departments</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Logistics">Logistics</option>
              <option value="Corporate">Corporate</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <label className="text-xs text-muted block mb-1 font-semibold">Module</label>
            <select 
              value={filters.module} 
              onChange={e => setFilters({ ...filters, module: e.target.value })}
              className="form-input w-full rounded-lg" 
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <option value="all">All Modules</option>
              <option value="Environmental">Environmental</option>
              <option value="Social">Social</option>
              <option value="Governance">Governance</option>
              <option value="Gamification">Gamification</option>
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <label className="text-xs text-muted block mb-1 font-semibold">Employee</label>
            <select 
              value={filters.employee} 
              onChange={e => setFilters({ ...filters, employee: e.target.value })}
              className="form-input w-full rounded-lg" 
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <option value="all">All Employees</option>
              <option value="Aditi Rao">Aditi Rao</option>
              <option value="Karan Shah">Karan Shah</option>
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <label className="text-xs text-muted block mb-1 font-semibold">Challenge</label>
            <select 
              value={filters.challenge} 
              onChange={e => setFilters({ ...filters, challenge: e.target.value })}
              className="form-input w-full rounded-lg" 
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <option value="all">All Challenges</option>
              <option value="Zero Waste Week">Zero Waste Week</option>
              <option value="Diversity Training">Diversity Training</option>
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: '150px' }}>
            <label className="text-xs text-muted block mb-1 font-semibold">ESG Category</label>
            <select 
              value={filters.esgCategory} 
              onChange={e => setFilters({ ...filters, esgCategory: e.target.value })}
              className="form-input w-full rounded-lg" 
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <option value="all">All Categories</option>
              <option value="Emissions">Emissions</option>
              <option value="Diversity">Diversity</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-4">
          <button 
            className="btn flex items-center gap-2 font-bold py-2 px-6 rounded-lg transition-all"
            style={{ background: 'transparent', border: '1px solid var(--accent-reports)', color: 'var(--accent-reports)' }}
            onClick={handleRunReport}
            disabled={generatingKey !== ''}
          >
            {generatingKey === 'run-report' ? <Activity className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
            Run Report
          </button>
          
          <button 
            className="btn flex items-center gap-2 font-semibold py-2 px-6 rounded-lg transition-all"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-muted)' }}
            onClick={() => triggerExport('pdf')}
            disabled={generatingKey !== ''}
          >
            {generatingKey === 'export-pdf' ? <Activity className="animate-spin" size={16} /> : 'Export: PDF'}
          </button>
          
          <button 
            className="btn flex items-center gap-2 font-semibold py-2 px-6 rounded-lg transition-all"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-muted)' }}
            onClick={() => triggerExport('excel')}
            disabled={generatingKey !== ''}
          >
            {generatingKey === 'export-excel' ? <Activity className="animate-spin" size={16} /> : 'Export: Excel'}
          </button>

          <button 
            className="btn flex items-center gap-2 font-semibold py-2 px-6 rounded-lg transition-all"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-muted)' }}
            onClick={() => triggerExport('csv')}
            disabled={generatingKey !== ''}
          >
            {generatingKey === 'export-csv' ? <Activity className="animate-spin" size={16} /> : 'Export: CSV'}
          </button>
        </div>

        {/* Live Filter Output Area */}
        {reportOutput && (
          <div className="mt-8 p-6 glass-panel animate-fade-in" style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.01)' }}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-main">Report Output — Generated at {reportOutput.timestamp}</h4>
              <span className="text-xs text-muted">Found {reportOutput.rows.length} rows</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <th className="p-3 text-xs text-muted font-semibold">Date</th>
                    <th className="p-3 text-xs text-muted font-semibold">Department</th>
                    <th className="p-3 text-xs text-muted font-semibold">Module</th>
                    <th className="p-3 text-xs text-muted font-semibold">Metric</th>
                    <th className="p-3 text-xs text-muted font-semibold">Value</th>
                    <th className="p-3 text-xs text-muted font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportOutput.rows.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="p-3 text-xs text-muted">{row.date}</td>
                      <td className="p-3 text-xs text-muted">{row.dept}</td>
                      <td className="p-3 text-xs text-muted">{row.module}</td>
                      <td className="p-3 text-xs text-muted">{row.metric}</td>
                      <td className="p-3 text-xs text-main font-semibold">{row.value}</td>
                      <td className="p-3">
                        <span className="badge" style={{ 
                          borderColor: row.status === 'Completed' ? '#10b981' : row.status === 'Active' ? '#f59e0b' : '#3b82f6',
                          color: row.status === 'Completed' ? '#10b981' : row.status === 'Active' ? '#f59e0b' : '#3b82f6'
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
}
