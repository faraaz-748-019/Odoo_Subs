import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

export default function Dashboard() {
  const { token } = useAuth();
  const [data, setData] = useState({
    scores: { environmental: 0, social: 0, governance: 0, overall: 0 },
    trends: { environmental: 0, social: 0, governance: 0, overall: 0 },
    recentActivity: [],
    departmentRanking: [],
    emissionsTrend: []
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/dashboard/data`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.scores) setData(resData);
      })
      .catch(console.error);
  }, [token]);

  const renderTrend = (value, color) => {
    const isPos = value >= 0;
    return (
      <span className="badge" style={{ background: `rgba(${color}, 0.1)`, color: `rgb(${color})`, border: 'none' }}>
        {isPos ? '↑' : '↓'} {Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="dashboard-layout p-6 flex-col gap-4" style={{ height: '100%', overflowY: 'auto' }}>

      {/* Top Scores */}
      <div className="grid-4 gap-4">
        <Link to="/environmental" className="glass-panel p-4 theme-env flex-col justify-between kpi-tile" style={{ minHeight: '130px' }}>
          <div className="flex justify-between items-start">
            <span className="text-muted text-sm font-semibold">Environmental Score</span>
            {renderTrend(data.trends.environmental, '34, 197, 94')}
          </div>
          <div className="score-value theme-env-text text-4xl" style={{ marginTop: 'auto' }}>{data.scores.environmental} <span className="text-sm text-muted" style={{ fontSize: '1rem' }}>/ 100</span></div>
        </Link>
        <Link to="/social" className="glass-panel p-4 theme-social flex-col justify-between kpi-tile" style={{ minHeight: '130px' }}>
          <div className="flex justify-between items-start">
            <span className="text-muted text-sm font-semibold">Social Score</span>
            {renderTrend(data.trends.social, '56, 189, 248')}
          </div>
          <div className="score-value theme-social-text text-4xl" style={{ marginTop: 'auto' }}>{data.scores.social} <span className="text-sm text-muted" style={{ fontSize: '1rem' }}>/ 100</span></div>
        </Link>
        <Link to="/governance" className="glass-panel p-4 theme-gov flex-col justify-between kpi-tile" style={{ minHeight: '130px' }}>
          <div className="flex justify-between items-start">
            <span className="text-muted text-sm font-semibold">Governance Score</span>
            {renderTrend(data.trends.governance, '168, 85, 247')}
          </div>
          <div className="score-value theme-gov-text text-4xl" style={{ marginTop: 'auto' }}>{data.scores.governance} <span className="text-sm text-muted" style={{ fontSize: '1rem' }}>/ 100</span></div>
        </Link>
        <Link to="/" className="glass-panel p-4 flex-col justify-between kpi-tile overall" style={{ minHeight: '130px' }}>
          <div className="flex justify-between items-start">
            <span className="text-muted text-sm font-semibold">Overall ESG Score</span>
            {renderTrend(data.trends.overall, '96, 165, 250')}
          </div>
          <div className="score-value text-4xl" style={{ color: '#60a5fa', marginTop: 'auto' }}>{data.scores.overall} <span className="text-sm text-muted" style={{ fontSize: '1rem' }}>/ 100</span></div>
        </Link>
      </div>

      <p className="text-xs text-muted" style={{ margin: '8px 0' }}>Data is securely aggregated in real-time across all active environmental, social, and governance modules.</p>

      {/* Charts Row */}
      <div className="grid-2 gap-4" style={{ flex: 1, minHeight: '300px' }}>
        <div className="glass-panel p-4 flex-col">
          <h3 className="text-sm font-semibold mb-4 text-muted flex items-center gap-2">📈 Year-to-Date Emissions Reduction</h3>
          <div style={{ flex: 1, width: '100%', minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.emissionsTrend}>
                <Line type="monotone" dataKey="value" stroke="var(--accent-env)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-env)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel p-4 flex-col">
          <h3 className="text-sm font-semibold mb-4 text-muted flex items-center gap-2">📊 Department ESG Performance</h3>
          <div style={{ flex: 1, width: '100%', minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentRanking} margin={{ bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Bar dataKey="score" fill="#1f4b6b" radius={[6, 6, 6, 6]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-2 gap-4" style={{ paddingBottom: '2rem' }}>
        <div className="glass-panel p-4 flex-col">
          <h3 className="text-sm font-semibold mb-4 text-muted flex items-center gap-2">🕒 Real-Time Company Activity Feed</h3>
          <ul className="flex-col gap-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {data.recentActivity.map(act => (
              <li key={act.id} className="text-sm flex items-center gap-2" style={{ marginBottom: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                {act.type === 'success' && <span style={{ color: '#a78bfa', fontSize: '1.2rem' }}>✔</span>}
                {act.type === 'warning' && <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>⚠</span>}
                {act.type === 'info' && <span style={{ color: '#60a5fa', fontSize: '1.2rem' }}>📈</span>}
                {act.text}
              </li>
            ))}
            {data.recentActivity.length === 0 && <li className="text-muted text-sm">No recent activity found.</li>}
          </ul>
        </div>
        <div className="glass-panel p-6 flex-col">
          <h3 className="text-md font-semibold mb-4 text-main flex items-center gap-2">⚡ Quick Actions</h3>
          <div className="flex-col gap-4 mt-2">
            <Link to="/environmental" className="btn btn-primary-env w-full">⚡ Add Environmental Goal</Link>
            <Link to="/social" className="btn btn-primary-gamify w-full">🏆 Manage Participations</Link>
            <Link to="/governance" className="btn btn-secondary w-full">📄 Track Compliance Issues</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
