import React, { useState, useEffect, useMemo } from 'react';
import { Award, Star, TrendingUp, Heart, Leaf, Sun, Zap, ChevronDown, ChevronUp, Search, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Gamification() {
  const { token, user } = useAuth();
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const [activities, setActivities] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [currentPoints, setCurrentPoints] = useState(0);

  // Filter States
  const [activeChallengeStatus, setActiveChallengeStatus] = useState('Active');
  
  // Modal States
  const [isChallengeModalOpen, setChallengeModalOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', type: 'Environmental', points: 100, requirements: '' });
  const [selectedBadge, setSelectedBadge] = useState(null);
  
  // Loading States per item
  const [joiningIds, setJoiningIds] = useState(new Set());
  const [creatingChallenge, setCreatingChallenge] = useState(false);

  // Compare Tool States
  const [compareUserA, setCompareUserA] = useState('');
  const [compareUserB, setCompareUserB] = useState('');

  const fetchData = () => {
    // Fetch Activities
    fetch('http://localhost:5005/api/social/activities', { headers })
      .then(res => res.json())
      .then(setActivities)
      .catch(console.error);

    // Fetch Participations
    fetch('http://localhost:5005/api/social/participations', { headers })
      .then(res => res.json())
      .then(data => {
        setParticipations(data);
        // Calculate current user's points
        const userTotal = data
          .filter(p => p.employee_name === user?.name && p.status === 'Approved')
          .reduce((sum, p) => sum + (p.points_awarded || 0), 0);
        setCurrentPoints(userTotal);
      })
      .catch(console.error);

    // Fetch Challenges
    fetch('http://localhost:5005/api/gamification/challenges', { headers })
      .then(res => res.json())
      .then(setChallenges)
      .catch(console.error);

    // Fetch Badges
    fetch('http://localhost:5005/api/gamification/badges', { headers })
      .then(res => res.json())
      .then(setBadges)
      .catch(console.error);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token, user]);

  // Aggregate points per employee
  const userScores = useMemo(() => {
    const scores = {};
    participations.forEach(p => {
      if (p.status === 'Approved') {
        scores[p.employee_name] = (scores[p.employee_name] || 0) + (p.points_awarded || 0);
      }
    });
    return scores;
  }, [participations]);

  const leaderboard = useMemo(() => {
    return Object.entries(userScores)
      .map(([name, points]) => ({ name, points }))
      .sort((a, b) => b.points - a.points);
  }, [userScores]);

  const uniqueUsers = useMemo(() => leaderboard.map(u => u.name), [leaderboard]);

  const displayLeaderboard = useMemo(() => {
    const list = [...leaderboard];
    const userExists = list.some(u => u.name === user?.name);
    if (!userExists && user) {
      list.push({ name: user.name, points: currentPoints });
    }
    return list.sort((a, b) => b.points - a.points);
  }, [leaderboard, user, currentPoints]);

  const top3 = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);

  const getAvatar = (name) => {
    const avatars = ['👦', '👧', '👨', '👩', '👨‍🦱', '👩‍🦱', '👱‍♂️', '👱‍♀️', '👨‍🦰', '👩‍🦰', '👨‍🎓', '👩‍🎓'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatars[Math.abs(hash) % avatars.length];
  };

  const getLeaderboardBadge = (pts, name) => {
    const rankIndex = leaderboard.findIndex(u => u.name === name);
    if (rankIndex === 0) return { icon: '🥇', name: 'Gold', color: '#fbbf24' };
    if (rankIndex === 1) return { icon: '🥈', name: 'Silver', color: '#94a3b8' };
    if (rankIndex === 2) return { icon: '🥉', name: 'Bronze', color: '#b45309' };
    
    if (pts >= 1000) return { icon: '🏆', name: 'Platinum', color: '#e2e8f0' };
    if (pts >= 500) return { icon: '🌟', name: 'Rising Star', color: '#a855f7' };
    if (pts >= 100) return { icon: '🚀', name: 'Achiever', color: '#3b82f6' };
    return { icon: '🌱', name: 'Seedling', color: '#2ea043' };
  };

  const handleJoinChallenge = async (challengeId) => {
    setJoiningIds(prev => new Set([...prev, challengeId]));
    try {
      const res = await fetch(`http://localhost:5005/api/gamification/challenges/${challengeId}/join`, {
        method: 'POST',
        headers
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to join challenge');
      } else {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setJoiningIds(prev => {
        const next = new Set(prev);
        next.delete(challengeId);
        return next;
      });
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setCreatingChallenge(true);
    try {
      const res = await fetch('http://localhost:5005/api/gamification/challenges', {
        method: 'POST',
        headers,
        body: JSON.stringify(newChallenge)
      });
      if (res.ok) {
        setChallengeModalOpen(false);
        setNewChallenge({ title: '', description: '', type: 'Environmental', points: 100, requirements: '' });
        fetchData();
      } else {
        alert('Failed to create challenge');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingChallenge(false);
    }
  };

  const isUserJoined = (challengeId) => {
    return participations.some(p => p.employee_name === user?.name && p.activity_id === challengeId);
  };

  return (
    <div className="module-layout flex-col h-full" style={{ overflowY: 'auto', scrollBehavior: 'smooth' }}>
      
      {/* 1. Sub-Navigation Tabs */}
      <div className="sticky top-0 z-50 px-8 py-4 border-b border-light flex gap-8 mb-6" style={{ background: 'rgba(10, 12, 16, 0.95)', backdropFilter: 'blur(10px)' }}>
        <a href="#challenges" className="text-sm font-bold theme-gamify-text hover:opacity-80 border-b-2" style={{ borderColor: 'var(--accent-gamify)' }}>Challenges</a>
        <a href="#badges" className="text-sm font-semibold text-muted hover:text-white transition-colors">Badge Gallery</a>
        <a href="#rewards" className="text-sm font-semibold text-muted hover:text-white transition-colors">Your Rewards</a>
        <a href="#leaderboard" className="text-sm font-semibold text-muted hover:text-white transition-colors">Leaderboard</a>
        <a href="#comparison" className="text-sm font-semibold text-muted hover:text-white transition-colors">Head-to-Head</a>
      </div>

      <div className="p-8 pt-2">
        {/* 2. Leaderboard Podium & Table */}
        <div id="leaderboard" className="mb-16 scroll-mt-24">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-main">CSR Leaderboard & Badges</h2>
              <p className="text-sm text-muted mt-1">Earn points by participating in Social and Environmental initiatives.</p>
            </div>
            <div className="glass-panel p-3 text-center" style={{ minWidth: '150px' }}>
              <div className="text-xs text-muted font-semibold">Your Total Points</div>
              <div className="text-2xl font-semibold text-main theme-gamify-text">{currentPoints} XP</div>
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
                  <div style={{ fontSize: '2.5rem', marginBottom: '-10px' }}>👑</div>
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
          {displayLeaderboard.length > 0 ? (
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
                  {displayLeaderboard.map((item, index) => {
                    const badge = getLeaderboardBadge(item.points, item.name);
                    const isSelf = item.name === user?.name;

                    return (
                      <tr key={item.name} style={{borderBottom: '1px solid rgba(255,255,255,0.05)', background: isSelf ? 'rgba(255, 255, 255, 0.03)' : 'transparent'}}>
                        <td className="p-4 text-sm text-muted font-semibold">{`#${index + 1}`}</td>
                        <td className="p-4 text-sm flex items-center gap-3">
                          <div style={{ fontSize: '1.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getAvatar(item.name)}
                          </div>
                          <span className={`font-semibold text-sm ${isSelf ? 'theme-gamify-text font-bold' : ''}`}>
                            {item.name} {isSelf && '(You)'}
                          </span>
                        </td>
                        <td className="p-4 text-sm theme-gamify-text font-semibold">{item.points}</td>
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
            <div className="glass-panel p-6 text-center text-muted">No scoreboard entries yet.</div>
          )}
        </div>

        {/* 3. Challenges Section */}
        <div id="challenges" className="mb-16 scroll-mt-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-main">Challenges</h2>
            <button 
              className="btn font-semibold" 
              onClick={() => setChallengeModalOpen(true)}
              style={{ background: 'var(--accent-gamify)', borderColor: 'var(--accent-gamify)', color: 'white' }}
            >
              + Create Challenge
            </button>
          </div>

          {/* Challenge Status Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['Draft', 'Active', 'Under Review', 'Completed', 'Archived'].map(status => (
              <button 
                key={status}
                onClick={() => setActiveChallengeStatus(status)}
                className="px-6 py-2 rounded-lg text-sm font-semibold border transition-colors" 
                style={{ 
                  borderColor: activeChallengeStatus === status ? 'var(--accent-gamify)' : 'var(--border-focus)', 
                  background: activeChallengeStatus === status ? 'rgba(168, 85, 247, 0.1)' : 'transparent', 
                  color: activeChallengeStatus === status ? 'var(--accent-gamify)' : 'var(--text-muted)' 
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {challenges.filter(c => c.status === activeChallengeStatus).map(challenge => {
              const joined = isUserJoined(challenge.id);
              const joining = joiningIds.has(challenge.id);

              return (
                <div key={challenge.id} className="glass-panel p-6 flex-col gap-3 hover-lift animate-fade-in" style={{ border: '2px solid var(--accent-gamify)', borderRadius: '24px' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: '1.2rem' }}>🎯</span>
                    <h3 className="font-bold text-main text-lg">{challenge.title}</h3>
                  </div>
                  <p className="text-sm text-muted">{challenge.description}</p>
                  <div className="text-sm text-muted flex gap-2"><span>Points: {challenge.points} XP</span> • <span>Type: {challenge.type}</span></div>
                  {challenge.requirements && <div className="text-xs text-muted italic">Req: {challenge.requirements}</div>}
                  <div className="mt-2 mb-8">
                    <span className="px-3 py-1 text-xs font-semibold rounded border" style={{ borderColor: '#10b981', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>{challenge.status}</span>
                  </div>
                  <button 
                    onClick={() => handleJoinChallenge(challenge.id)}
                    disabled={joined || joining || challenge.status !== 'Active'}
                    className="btn w-full mt-auto font-bold py-3" 
                    style={{ 
                      background: joined ? '#10b981' : 'var(--accent-gamify)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      opacity: challenge.status !== 'Active' ? 0.5 : 1
                    }}
                  >
                    {joining ? 'Joining...' : joined ? '✓ Joined' : 'Join Challenge'}
                  </button>
                </div>
              );
            })}
            {challenges.filter(c => c.status === activeChallengeStatus).length === 0 && (
              <div className="glass-panel p-8 text-center text-muted" style={{ gridColumn: '1/-1' }}>
                No challenges found in this status category.
              </div>
            )}
          </div>
        </div>

        {/* 4. Badge Gallery */}
        <div id="badges" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-bold text-main mb-2">Badge Gallery</h2>
          <p className="text-sm text-muted mb-6">Click on any locked badge to see how to earn it.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {badges.map(badge => {
              const isAchieved = badge.earned_at || currentPoints >= badge.required_points;
              return (
                <div 
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className="glass-panel p-5 flex items-center gap-4 hover-lift cursor-pointer" 
                  style={{ 
                    border: '2px solid var(--accent-gamify)', 
                    borderRadius: '20px',
                    opacity: isAchieved ? 1 : 0.6,
                    background: isAchieved ? 'rgba(168, 85, 247, 0.05)' : 'transparent'
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>
                    {isAchieved ? badge.icon : <Lock size={28} className="text-muted" />}
                  </div>
                  <div>
                    <div className="font-bold text-main text-sm theme-gamify-text">{badge.name}</div>
                    <div className="text-xs text-muted mt-1">{isAchieved ? '✓ Unlocked' : '🔒 Locked'}</div>
                  </div>
                </div>
              );
            })}
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
              <p className="text-2xl font-bold" style={{ color: '#10b981' }}>{Math.floor(currentPoints / 50)} Trees</p>
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
              <p className="text-2xl font-bold" style={{ color: '#f43f5e' }}>{Math.floor(currentPoints / 100) * 2} Hours</p>
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
              <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{currentPoints * 10} kWh</p>
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
        <div id="comparison" className="glass-panel p-8 scroll-mt-24" style={{ borderLeft: '4px solid #a855f7' }}>
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
              const userAData = leaderboard.find(u => u.name === compareUserA) || { points: 0 };
              const userBData = leaderboard.find(u => u.name === compareUserB) || { points: 0 };
              
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
                      <h4 className="text-xs font-semibold text-muted uppercase mb-4">Approved Activities</h4>
                      <ul className="text-sm space-y-3">
                        {userAParts.length === 0 ? <li className="text-muted italic">No activities found.</li> : 
                          userAParts.map(p => <li key={p.id} className="flex justify-between border-b border-light pb-2"><span>{p.activity_title || 'Challenge #'+p.activity_id}</span> <span className="font-bold text-main">+{p.points_awarded}</span></li>)}
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
                      <h4 className="text-xs font-semibold text-muted uppercase mb-4">Approved Activities</h4>
                      <ul className="text-sm space-y-3">
                        {userBParts.length === 0 ? <li className="text-muted italic">No activities found.</li> : 
                          userBParts.map(p => <li key={p.id} className="flex justify-between border-b border-light pb-2"><span>{p.activity_title || 'Challenge #'+p.activity_id}</span> <span className="font-bold text-main">+{p.points_awarded}</span></li>)}
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

      {/* Challenge Creation Modal */}
      <Modal isOpen={isChallengeModalOpen} onClose={() => setChallengeModalOpen(false)} title="Create New Challenge">
        <form onSubmit={handleCreateChallenge}>
          <label className="text-xs text-muted block mb-2 font-semibold">Challenge Title</label>
          <input 
            required 
            type="text" 
            value={newChallenge.title} 
            onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })} 
            placeholder="e.g. Zero-Emission Commute"
            className="form-input mb-4"
          />

          <label className="text-xs text-muted block mb-2 font-semibold">Description</label>
          <textarea 
            required 
            value={newChallenge.description} 
            onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })} 
            placeholder="Describe the challenge parameters..."
            className="form-input mb-4"
            rows="3"
            style={{ resize: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', color: 'white', padding: '10px', borderRadius: '4px' }}
          />

          <label className="text-xs text-muted block mb-2 font-semibold">Type</label>
          <select 
            value={newChallenge.type} 
            onChange={e => setNewChallenge({ ...newChallenge, type: e.target.value })}
            className="form-input mb-4"
          >
            <option value="Environmental">Environmental 🌱</option>
            <option value="Social">Social 👥</option>
            <option value="Governance">Governance 🏛️</option>
          </select>

          <label className="text-xs text-muted block mb-2 font-semibold">Points (XP)</label>
          <input 
            required 
            type="number" 
            value={newChallenge.points} 
            onChange={e => setNewChallenge({ ...newChallenge, points: parseInt(e.target.value) || 0 })} 
            className="form-input mb-4"
          />

          <label className="text-xs text-muted block mb-2 font-semibold">Requirements to achieve</label>
          <input 
            type="text" 
            value={newChallenge.requirements} 
            onChange={e => setNewChallenge({ ...newChallenge, requirements: e.target.value })} 
            placeholder="e.g. log 5 bicycle commutes"
            className="form-input mb-6"
          />

          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setChallengeModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary-social" style={{ background: 'var(--accent-gamify)' }} disabled={creatingChallenge}>
              {creatingChallenge ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Badge Achievement info modal */}
      <Modal isOpen={!!selectedBadge} onClose={() => setSelectedBadge(null)} title={selectedBadge ? `Badge Details: ${selectedBadge.name}` : ''}>
        {selectedBadge && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              {selectedBadge.icon}
            </div>
            <h3 className="text-xl font-bold text-main mb-2">{selectedBadge.name}</h3>
            <p className="text-sm text-muted mb-6">{selectedBadge.description}</p>
            
            <div className="glass-panel p-4 mb-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h4 className="text-xs uppercase font-bold text-muted mb-2">How to Achieve</h4>
              <p className="text-sm text-main mb-4">Accumulate at least <strong className="theme-gamify-text">{selectedBadge.required_points} XP</strong> in platform challenges.</p>
              
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Your Progress</span>
                <span>{currentPoints} / {selectedBadge.required_points} XP</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(100, (currentPoints / selectedBadge.required_points) * 100)}%`, 
                  height: '100%', 
                  background: 'var(--accent-gamify)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>

            <button className="btn w-full font-semibold" style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }} onClick={() => setSelectedBadge(null)}>Close</button>
          </div>
        )}
      </Modal>

    </div>
  );
}
