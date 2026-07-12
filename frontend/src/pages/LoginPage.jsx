import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Users, Shield, Award, CheckCircle2, ArrowRight, Info, Check } from 'lucide-react';
import { API_BASE } from '../config';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Request failed');
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/demo`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Demo login failed');
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            background: 'radial-gradient(circle at top left, #121820 0%, #0a0c10 100%)',
            fontFamily: "'Outfit', sans-serif",
            overflow: 'hidden'
        }}>
            
            {/* Left Side: Project Overview & Features */}
            <div style={{
                flex: 1.2,
                padding: '4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRight: '1px solid rgba(240, 246, 252, 0.08)',
                background: 'rgba(255, 255, 255, 0.01)',
                boxSizing: 'border-box'
            }} className="no-scrollbar">
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>🌍</span>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f0f6fc', letterSpacing: '-0.5px' }}>EcoSphere</span>
                    </div>

                    <h1 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 800, 
                        color: '#f0f6fc', 
                        lineHeight: 1.2,
                        marginBottom: '1.5rem',
                        letterSpacing: '-1px'
                    }}>
                        The Unified Digital Twin for Corporate ESG & Sustainability.
                    </h1>
                    
                    <p style={{ color: '#8b949e', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                        EcoSphere bridges the gap between environmental responsibility, compliance audit standards, and active employee engagement. Track live telemetry, manage policies, and gamify CSR impact from a single command center.
                    </p>

                    {/* Features List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '10px', borderRadius: '10px' }}>
                                <Leaf size={20} />
                            </div>
                            <div>
                                <h4 style={{ color: '#f0f6fc', margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600 }}>Environmental Telemetry</h4>
                                <p style={{ color: '#8b949e', margin: 0, fontSize: '0.9rem' }}>Real-time emissions tracking, Scope 1/2/3 carbon goals, and energy conservation audits.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '10px', borderRadius: '10px' }}>
                                <Users size={20} />
                            </div>
                            <div>
                                <h4 style={{ color: '#f0f6fc', margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600 }}>Social Engagement & CSR</h4>
                                <p style={{ color: '#8b949e', margin: 0, fontSize: '0.9rem' }}>Workforce diversity indicators, CSR volunteering approval flow, and active participation queues.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '10px', borderRadius: '10px' }}>
                                <Shield size={20} />
                            </div>
                            <div>
                                <h4 style={{ color: '#f0f6fc', margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600 }}>Governance & Policy Audits</h4>
                                <p style={{ color: '#8b949e', margin: 0, fontSize: '0.9rem' }}>Corporate policy cataloging, employee acknowledgment rates, and compliance risk monitoring.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(168, 85, 246, 0.1)', color: '#a855f7', padding: '10px', borderRadius: '10px' }}>
                                <Award size={20} />
                            </div>
                            <div>
                                <h4 style={{ color: '#f0f6fc', margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600 }}>Gamification & Milestones</h4>
                                <p style={{ color: '#8b949e', margin: 0, fontSize: '0.9rem' }}>Earn XP via challenges, unlock achievements in the Badge Gallery, and climb the company leaderboard.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div style={{
                flex: 0.9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '2.5rem',
                    background: 'rgba(22, 27, 34, 0.4)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(240, 246, 252, 0.08)',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f0f6fc', margin: '0 0 8px 0' }}>
                            {isSignup ? 'Create Account' : 'Welcome back'}
                        </h2>
                        <p style={{ color: '#8b949e', fontSize: '0.9rem', margin: 0 }}>
                            {isSignup ? 'Register your private organization space' : 'Enter credentials to manage your ESG board'}
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#ef4444',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            marginBottom: '1.25rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem', fontWeight: 600 }}>Full Name</label>
                                <input
                                    required 
                                    type="text" 
                                    placeholder="Jane Doe"
                                    value={form.name} 
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.75rem 1rem',
                                        background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(240,246,252,0.1)',
                                        borderRadius: '10px', color: '#f0f6fc', fontSize: '0.95rem', fontFamily: 'inherit',
                                        outline: 'none', boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        )}
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem', fontWeight: 600 }}>Work Email</label>
                            <input
                                required 
                                type="email" 
                                placeholder="you@company.com"
                                value={form.email} 
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                style={{
                                    width: '100%', padding: '0.75rem 1rem',
                                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(240,246,252,0.1)',
                                    borderRadius: '10px', color: '#f0f6fc', fontSize: '0.95rem', fontFamily: 'inherit',
                                    outline: 'none', boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem', fontWeight: 600 }}>Password</label>
                            <input
                                required 
                                type="password" 
                                placeholder="••••••••"
                                value={form.password} 
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                style={{
                                    width: '100%', padding: '0.75rem 1rem',
                                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(240,246,252,0.1)',
                                    borderRadius: '10px', color: '#f0f6fc', fontSize: '0.95rem', fontFamily: 'inherit',
                                    outline: 'none', boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <button
                            type="submit" 
                            disabled={loading}
                            style={{
                                width: '100%', padding: '0.85rem', border: 'none', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                                fontFamily: 'inherit', transition: 'all 0.2s',
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(240, 246, 252, 0.08)' }} />
                        <span style={{ color: '#8b949e', fontSize: '0.8rem' }}>or</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(240, 246, 252, 0.08)' }} />
                    </div>

                    <button
                        onClick={handleDemoLogin} 
                        disabled={loading}
                        style={{
                            width: '100%', padding: '0.85rem', border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)',
                            color: '#10b981', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'inherit', transition: 'all 0.2s',
                            opacity: loading ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        🚀 Explore Demo Environment
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>
                            {isSignup ? 'Already have an account? ' : "New to EcoSphere? "}
                        </span>
                        <button
                            onClick={() => { setIsSignup(!isSignup); setError(''); }}
                            style={{
                                background: 'none', border: 'none', color: '#10b981',
                                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit'
                            }}
                        >
                            {isSignup ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
