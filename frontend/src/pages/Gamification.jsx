import React, { useState, useEffect, useMemo } from 'react';
import { Award, Star, TrendingUp, Heart, Leaf, Sun, Zap, ChevronDown, ChevronUp, Search, ArrowRight } from 'lucide-react';

export default function Gamification() {
  const [activities, setActivities] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [compareUserA, setCompareUserA] = useState('');
  const [compareUserB, setCompareUserB] = useState('');

  useEffect(() => {
    fetch('http://localhost:5005/api/social/activities')
      .then(res => res.json())
      .then(setActivities)
      .catch(console.error);
      
    fetchParticipations();
  }, []);

  const fetchParticipations = () => {
    fetch('http://localhost:5005/api/social/participations')
      .then(res => res.json())
      .then(setParticipations)
      .catch(console.error);
  };

  const handleRemoveUser = async (name) => {
    await fetch(`http://localhost:5005/api/social/participations/user/${name}`, { method: 'DELETE' });
    fetchParticipations();
  };

  // Aggregate points per employee
  const userScores = {};
  participations.forEach(p => {
    if (p.status === 'Approved') {
      userScores[p.employee_name] = (userScores[p.employee_name] || 0) + (p.points_awarded || 0);
    }
  });

  const leaderboard = Object.entries(userScores)
    .map(([name, points]) => ({ name, points }))
    .sort((a, b) => b.points - a.points);
  
  // Identify unique users for the comparison dropdowns
  const uniqueUsers = leaderboard.map(u => u.name);

  // We are removing truncation since the user wants a full scrollable page organized by priority.
  const displayLeaderboard = [...leaderboard];
  const mockCurrentUser = { name: 'You (Demo User)', points: 15 };
  if (leaderboard.length > 0) displayLeaderboard.push(mockCurrentUser);

  const top3 = leaderboard.slice(0, 3);

  const getAvatar = (name) => {
    const avatars = ['👦', '👧', '👨', '👩', '👨‍🦱', '👩‍🦱', '👱‍♂️', '👱‍♀️', '👨‍🦰', '👩‍🦰', '👨‍🎓', '👩‍🎓'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatars[Math.abs(hash) % avatars.length];
  };

  const getBadge = (pts, name) => {
    const rankIndex = leaderboard.findIndex(u => u.name === name);
    
    // Top 3 always get Gold, Silver, Bronze regardless of points
    if (rankIndex === 0) return { icon: '🥇', name: 'Gold', color: '#fbbf24' };
    if (rankIndex === 1) return { icon: '🥈', name: 'Silver', color: '#94a3b8' };
    if (rankIndex === 2) return { icon: '🥉', name: 'Bronze', color: '#b45309' };
    
    // Everyone else (including Demo User) gets point-based milestone badges
    if (pts >= 100) return { icon: '🏆', name: 'Platinum', color: '#e2e8f0' };
    if (pts >= 50) return { icon: '🌟', name: 'Rising Star', color: '#a855f7' };
    if (pts >= 30) return { icon: '🚀', name: 'Achiever', color: '#3b82f6' };
    return { icon: '🌱', name: 'Seedling', color: '#2ea043' };
  };

  return (
    <div className="module-layout flex-col h-full" style={{ overflowY: 'auto', scrollBehavior: 'smooth' }}>
      
      {/* 1. Sub-Navigation Tabs */}
      <div className="sticky top-0 z-50 px-8 py-4 border-b border-light flex gap-8 mb-6" style={{ background: 'rgba(10, 12, 16, 0.95)', backdropFilter: 'blur(10px)' }}>
        <a href="#challenges" className="text-sm font-bold theme-gamify-text hover:opacity-80 border-b-2" style={{ borderColor: 'var(--accent-gamify)' }}>Challenges</a>
        <a href="#participation" className="text-sm font-semibold text-muted hover:text-white transition-colors">Challenge Participation</a>
        <a href="#badges" className="text-sm font-semibold text-muted hover:text-white transition-colors">Badges</a>
        <a href="#rewards" className="text-sm font-semibold text-muted hover:text-white transition-colors">Rewards</a>
        <a href="#leaderboard" className="text-sm font-semibold text-muted hover:text-white transition-colors">Leaderboard</a>
      </div>

      <div className="p-8 pt-2">
        {/* 2. Leaderboard Podium & Table (Highest Priority) */}
        <div id="leaderboard" className="mb-16 scroll-mt-24">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-main">CSR Leaderboard & Badges</h2>
              <p className="text-sm text-muted mt-1">Earn points by participating in Social and Environmental initiatives.</p>
            </div>
            <div className="glass-panel p-3 text-center" style={{ minWidth: '150px' }}>
              <div className="text-xs text-muted font-semibold">Total Participants</div>
              <div className="text-2xl font-semibold text-main">{leaderboard.length}</div>
            </div>
          </div>
          
          {/* Podium Section */}
          <div className="flex justify-center items-end gap-4 mb-12" style={{ minHeight: '260px' }}>
            {/* Rank 2 */}
            {top3[1] && (
              <div className="flex-col items-center animate-float" style={{ width: '130px', animationDelay: '0.2s' }}>
                <div className="text-center mb-2">
                  <div style={{ fontSize: '1.8rem', marginBottom: '-5px' }}>🥈</div>
                  <div className="text-md font-semibold text-main truncate w-full">{top3[1].name}</div>
                  <div className="text-sm text-muted">{top3[1].points} pts</div>
                </div>
                <div className="glass-panel flex justify-center items-center" style={{ width: '100%', height: '140px', background: 'linear-gradient(180deg, rgba(148,163,184,0.3) 0%, rgba(22,27,34,0) 100%)', borderTop: '2px solid #94a3b8', boxShadow: '0 -5px 15px rgba(148,163,184,0.1)' }}>
                  <div style={{ fontSize: '3.5rem', opacity: 0.8 }}>{getAvatar(top3[1].name)}</div>
                </div>
              </div>
            )}

            {/* Rank 1 */}
            {top3[0] && (
              <div className="flex-col items-center animate-float" style={{ width: '150px' }}>
                <div className="text-center mb-2 relative">
                  <div style={{ fontSize: '2.5rem', animation: 'modalPop 0.5s ease-out', marginBottom: '-10px' }}>👑</div>
                  <div className="text-lg font-bold text-main truncate w-full">{top3[0].name}</div>
                  <div className="text-md theme-gamify-text font-semibold">{top3[0].points} pts</div>
                </div>
                <div className="glass-panel animate-glow flex justify-center items-center" style={{ width: '100%', height: '180px', background: 'linear-gradient(180deg, rgba(251,191,36,0.3) 0%, rgba(22,27,34,0) 100%)', borderTop: '2px solid #fbbf24', zIndex: 10 }}>
                  <div style={{ fontSize: '4.5rem', opacity: 0.9 }}>{getAvatar(top3[0].name)}</div>
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {top3[2] && (
              <div className="flex-col items-center animate-float" style={{ width: '130px', animationDelay: '0.4s' }}>
                <div className="text-center mb-2">
                  <div style={{ fontSize: '1.8rem', marginBottom: '-5px' }}>🥉</div>
                  <div className="text-md font-semibold text-main truncate w-full">{top3[2].name}</div>
                  <div className="text-sm text-muted">{top3[2].points} pts</div>
                </div>
                <div className="glass-panel flex justify-center items-center" style={{ width: '100%', height: '110px', background: 'linear-gradient(180deg, rgba(180,83,9,0.3) 0%, rgba(22,27,34,0) 100%)', borderTop: '2px solid #b45309', boxShadow: '0 -5px 15px rgba(180,83,9,0.1)' }}>
                  <div style={{ fontSize: '3rem', opacity: 0.7 }}>{getAvatar(top3[2].name)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Table */}
          {participations.length > 0 ? (
            <div className="glass-panel overflow-hidden" style={{ border: '1px solid var(--border-light)' }}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{borderBottom: '1px solid var(--border-light)'}}>
                    <th className="p-4 text-sm text-muted font-semibold" style={{width: '60px'}}>Rank</th>
                    <th className="p-4 text-sm text-muted font-semibold">Employee Profile</th>
                    <th className="p-4 text-sm text-muted font-semibold">Points</th>
                    <th className="p-4 text-sm text-muted font-semibold">Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {displayLeaderboard.map((user, index) => {
                    const badge = getBadge(user.points, user.name);
                    const isDemo = user.name === 'You (Demo User)';
                    const rank = isDemo ? '—' : `#${index + 1}`;

                    return (
                      <tr key={user.name} style={{borderBottom: '1px solid rgba(255,255,255,0.05)', background: isDemo ? 'rgba(255, 255, 255, 0.03)' : 'transparent'}}>
                        <td className="p-4 text-sm text-muted font-semibold">{rank}</td>
                        <td className="p-4 text-sm flex items-center gap-3">
                          <div style={{ fontSize: '1.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getAvatar(user.name)}
                          </div>
                          <span className="font-semibold text-sm">{user.name}</span>
                        </td>
                        <td className="p-4 text-sm theme-gamify-text font-semibold">{user.points}</td>
                        <td className="p-4">
                          <span className="badge" style={{ borderColor: badge.color, color: badge.color, background: 'rgba(255,255,255,0.03)' }}>
                            {badge.icon} {badge.name}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="glass-panel p-6 text-center text-muted">No approved participations yet.</div>
          )}
        </div>

        {/* 3. Advanced Challenges Section */}
        <div id="challenges" className="mb-16 scroll-mt-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-main">Challenges</h2>
            <button className="btn font-semibold" style={{ background: 'var(--accent-gamify)', borderColor: 'var(--accent-gamify)', color: 'white' }}>+ New Challenge</button>
          </div>

          {/* Challenge Status Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-6 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-800" style={{ borderColor: 'var(--border-focus)', background: 'transparent', color: 'var(--text-muted)' }}>Draft</button>
            <button className="px-6 py-2 rounded-lg text-sm font-semibold border transition-colors" style={{ borderColor: '#10b981', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>Active</button>
            <button className="px-6 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-800" style={{ borderColor: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>Under Review</button>
            <button className="px-6 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-800" style={{ borderColor: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>Completed</button>
            <button className="px-6 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-800" style={{ borderColor: 'var(--border-focus)', background: 'transparent', color: 'var(--text-muted)' }}>Archived</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Sustainability Sprint */}
            <div className="glass-panel p-6 flex-col gap-3 hover-lift" style={{ border: '2px solid var(--accent-gamify)', borderRadius: '24px' }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: '1.2rem' }}>🌍</span>
                <h3 className="font-bold text-main text-lg">Sustainability Sprint</h3>
              </div>
              <div className="text-sm text-muted flex gap-2"><span>XP: 200</span> • <span>Hard</span></div>
              <div className="text-sm text-muted">Deadline: 07/20</div>
              <div className="mt-2 mb-8">
                <span className="px-3 py-1 text-xs font-semibold rounded border" style={{ borderColor: '#10b981', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>Active</span>
              </div>
              <button className="btn w-full mt-auto font-bold py-3" style={{ background: 'var(--accent-gamify)', color: 'white', border: 'none', borderRadius: '12px' }}>Join Challenge</button>
            </div>

            {/* Recycle Challenge */}
            <div className="glass-panel p-6 flex-col gap-3 hover-lift" style={{ border: '2px solid var(--accent-gamify)', borderRadius: '24px' }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: '1.2rem' }}>♻️</span>
                <h3 className="font-bold text-main text-lg">Recycle Challenge</h3>
              </div>
              <div className="text-sm text-muted flex gap-2"><span>XP: 80</span> • <span>Easy</span></div>
              <div className="text-sm text-muted">Deadline: 07/15</div>
              <div className="mt-2 mb-8">
                <span className="px-3 py-1 text-xs font-semibold rounded border" style={{ borderColor: '#10b981', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>Active</span>
              </div>
              <button className="btn w-full mt-auto font-bold py-3" style={{ background: 'var(--accent-gamify)', color: 'white', border: 'none', borderRadius: '12px' }}>Join Challenge</button>
            </div>

            {/* Commute Green Week */}
            <div className="glass-panel p-6 flex-col gap-3 hover-lift" style={{ border: '2px solid var(--accent-gamify)', borderRadius: '24px' }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: '1.2rem' }}>🚴</span>
                <h3 className="font-bold text-main text-lg">Commute Green Week</h3>
              </div>
              <div className="text-sm text-muted flex gap-2"><span>XP: 120</span> • <span>Medium</span></div>
              <div className="text-sm text-muted">Deadline: 08/01</div>
              <div className="mt-2 mb-8">
                <span className="px-3 py-1 text-xs font-semibold rounded border" style={{ borderColor: 'var(--border-focus)', color: 'var(--text-muted)', background: 'transparent' }}>Draft</span>
              </div>
              <button className="btn w-full mt-auto font-bold py-3" style={{ background: 'var(--accent-gamify)', color: 'white', border: 'none', borderRadius: '12px', opacity: 0.5 }} disabled>Join Challenge</button>
            </div>
          </div>
        </div>

        {/* 4. Badge Gallery */}
        <div id="badges" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-bold text-main mb-6">Badge Gallery</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel p-5 flex items-center gap-4 hover-lift" style={{ border: '2px solid var(--accent-gamify)', borderRadius: '20px' }}>
              <div style={{ fontSize: '1.5rem' }}>🌱</div>
              <div className="font-bold text-main text-sm theme-gamify-text">Green Beginner</div>
            </div>
            <div className="glass-panel p-5 flex items-center gap-4 hover-lift" style={{ border: '2px solid var(--accent-gamify)', borderRadius: '20px' }}>
              <div style={{ fontSize: '1.5rem' }}>🌲</div>
              <div className="font-bold text-main text-sm theme-gamify-text">Carbon Saver</div>
            </div>
            <div className="glass-panel p-5 flex items-center gap-4 hover-lift" style={{ border: '2px solid var(--accent-gamify)', borderRadius: '20px' }}>
              <div style={{ fontSize: '1.5rem' }}>🌍</div>
              <div className="font-bold text-main text-sm theme-gamify-text">Sustainability Champion</div>
            </div>
            <div className="glass-panel p-5 flex items-center gap-4 hover-lift" style={{ border: '2px solid var(--accent-gamify)', borderRadius: '20px' }}>
              <div style={{ fontSize: '1.5rem' }}>🤝</div>
              <div className="font-bold text-main text-sm theme-gamify-text">Team Player</div>
            </div>
          </div>
        </div>

        {/* 5. Positivity Impact Grid */}
        <div id="rewards" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-bold text-main mb-1">Your Impact & Rewards</h2>
          <p className="text-sm text-muted mb-6">Every action you take creates ripples of positive change.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel p-6 hover-lift" style={{ borderLeft: '4px solid #10b981', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                <Leaf size={100} color="#10b981" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="icon-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Leaf size={20}/></div>
                <h3 className="font-semibold text-main">Forest Preserver</h3>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#10b981' }}>24 Trees</p>
              <p className="text-xs text-muted mt-1">Planted on behalf of your points</p>
            </div>

            <div className="glass-panel p-6 hover-lift" style={{ borderLeft: '4px solid #f43f5e', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                <Heart size={100} color="#f43f5e" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="icon-badge" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}><Heart size={20}/></div>
                <h3 className="font-semibold text-main">Community Hero</h3>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#f43f5e' }}>18 Hours</p>
              <p className="text-xs text-muted mt-1">Volunteered in local shelters</p>
            </div>

            <div className="glass-panel p-6 hover-lift" style={{ borderLeft: '4px solid #3b82f6', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                <Zap size={100} color="#3b82f6" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="icon-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><Zap size={20}/></div>
                <h3 className="font-semibold text-main">Energy Saver</h3>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>450 kWh</p>
              <p className="text-xs text-muted mt-1">Conserved across all challenges</p>
            </div>

            <div className="glass-panel p-6 hover-lift" style={{ borderLeft: '4px solid #eab308', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                <Sun size={100} color="#eab308" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="icon-badge" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}><Sun size={20}/></div>
                <h3 className="font-semibold text-main">Positivity Spark</h3>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#eab308' }}>Top 5%</p>
              <p className="text-xs text-muted mt-1">Inspiring peers globally</p>
            </div>
          </div>
        </div>

        {/* 6. Head-to-Head Comparison Tool */}
        <div id="participation" className="glass-panel p-8 scroll-mt-24" style={{ borderLeft: '4px solid #a855f7' }}>
          <h2 className="text-xl font-bold text-main mb-2">Head-to-Head Comparison</h2>
          <p className="text-sm text-muted mb-8">Compare two profiles to see what they are doing to earn points and how to climb the ranks.</p>
          
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex-1" style={{ minWidth: '200px' }}>
              <label className="text-xs text-muted font-semibold uppercase mb-2 block">User A</label>
              <select className="form-input w-full" value={compareUserA} onChange={e => setCompareUserA(e.target.value)}>
                <option value="">Select a user...</option>
                {uniqueUsers.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            
            <div className="flex items-center justify-center p-4 rounded-full mt-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Search size={20} className="text-muted" />
            </div>

            <div className="flex-1" style={{ minWidth: '200px' }}>
              <label className="text-xs text-muted font-semibold uppercase mb-2 block">User B</label>
              <select className="form-input w-full" value={compareUserB} onChange={e => setCompareUserB(e.target.value)}>
                <option value="">Select a user...</option>
                {uniqueUsers.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
          </div>

          {compareUserA && compareUserB && compareUserA !== compareUserB ? (
            (() => {
              const userAData = leaderboard.find(u => u.name === compareUserA);
              const userBData = leaderboard.find(u => u.name === compareUserB);
              
              const userAParts = participations.filter(p => p.employee_name === compareUserA && p.status === 'Approved');
              const userBParts = participations.filter(p => p.employee_name === compareUserB && p.status === 'Approved');
              
              const ptDiff = userBData.points - userAData.points;
              
              return (
                <div className="animate-fade-in">
                  <div className="grid-2 gap-8 mb-6">
                    {/* User A Card */}
                    <div className="glass-panel p-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-center gap-4 mb-6">
                        <div style={{ fontSize: '3rem' }}>{getAvatar(compareUserA)}</div>
                        <div>
                          <div className="font-bold text-xl text-main">{compareUserA}</div>
                          <div className="text-md theme-gamify-text font-semibold">{userAData.points} pts</div>
                        </div>
                      </div>
                      <h4 className="text-xs font-semibold text-muted uppercase mb-4">Recent Approved Activities</h4>
                      <ul className="text-sm space-y-3">
                        {userAParts.length === 0 ? <li className="text-muted italic">No activities found.</li> : 
                          userAParts.map(p => <li key={p.id} className="flex justify-between border-b border-light pb-2"><span>{p.activity_title || 'Activity #'+p.activity_id}</span> <span className="font-bold text-main">+{p.points_awarded}</span></li>)}
                      </ul>
                    </div>

                    {/* User B Card */}
                    <div className="glass-panel p-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-center gap-4 mb-6">
                        <div style={{ fontSize: '3rem' }}>{getAvatar(compareUserB)}</div>
                        <div>
                          <div className="font-bold text-xl text-main">{compareUserB}</div>
                          <div className="text-md theme-gamify-text font-semibold">{userBData.points} pts</div>
                        </div>
                      </div>
                      <h4 className="text-xs font-semibold text-muted uppercase mb-4">Recent Approved Activities</h4>
                      <ul className="text-sm space-y-3">
                        {userBParts.length === 0 ? <li className="text-muted italic">No activities found.</li> : 
                          userBParts.map(p => <li key={p.id} className="flex justify-between border-b border-light pb-2"><span>{p.activity_title || 'Activity #'+p.activity_id}</span> <span className="font-bold text-main">+{p.points_awarded}</span></li>)}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Action Plan */}
                  <div className="p-6 rounded-lg flex items-start gap-4 mt-8" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                    <TrendingUp color="#a855f7" size={28} style={{ marginTop: '2px' }}/>
                    <div>
                      <h3 className="font-bold text-main mb-2 text-lg" style={{ color: '#c084fc' }}>Action Plan</h3>
                      <p className="text-md text-muted leading-relaxed">
                        {ptDiff > 0 ? (
                          <><strong>{compareUserA}</strong> needs <strong className="text-white">{ptDiff} more points</strong> to match <strong>{compareUserB}</strong>. We recommend participating in environmental activities like "Beach Cleanup" or submitting ideas to close the gap!</>
                        ) : ptDiff < 0 ? (
                          <><strong>{compareUserB}</strong> needs <strong className="text-white">{Math.abs(ptDiff)} more points</strong> to match <strong>{compareUserA}</strong>. We recommend participating in environmental activities to close the gap!</>
                        ) : (
                          <>Both users are perfectly tied at <strong className="text-white">{userAData.points} points</strong>! A true display of equally dedicated engagement.</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : compareUserA && compareUserB && compareUserA === compareUserB ? (
            <div className="text-center p-8 text-muted italic">Please select two different users to compare.</div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
