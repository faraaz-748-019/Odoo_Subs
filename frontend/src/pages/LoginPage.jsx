import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
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
            const res = await fetch(`http://localhost:5005${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Request failed');
            login(data.token, data.user);
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
            const res = await fetch('http://localhost:5005/api/auth/demo', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Demo login failed');
            login(data.token, data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100vw', height: '100vh',
            background: 'radial-gradient(circle at top left, #121820 0%, #0a0c10 100%)',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <div style={{
                width: '100%', maxWidth: '440px', padding: '3rem',
                background: 'rgba(22, 27, 34, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(240, 246, 252, 0.1)',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f0f6fc', marginBottom: '0.25rem' }}>
                        🌍 EcoSphere
                    </div>
                    <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>
                        ESG Management Platform
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem',
                        marginBottom: '1rem', textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem' }}>Full Name</label>
                            <input
                                required type="text" placeholder="John Doe"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                style={{
                                    width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem',
                                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(240,246,252,0.1)',
                                    borderRadius: '8px', color: '#f0f6fc', fontSize: '1rem', fontFamily: 'inherit',
                                    outline: 'none', boxSizing: 'border-box'
                                }}
                            />
                        </>
                    )}
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem' }}>Email</label>
                    <input
                        required type="email" placeholder="you@company.com"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        style={{
                            width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem',
                            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(240,246,252,0.1)',
                            borderRadius: '8px', color: '#f0f6fc', fontSize: '1rem', fontFamily: 'inherit',
                            outline: 'none', boxSizing: 'border-box'
                        }}
                    />
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem' }}>Password</label>
                    <input
                        required type="password" placeholder="••••••••"
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                        style={{
                            width: '100%', padding: '0.75rem 1rem', marginBottom: '1.5rem',
                            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(240,246,252,0.1)',
                            borderRadius: '8px', color: '#f0f6fc', fontSize: '1rem', fontFamily: 'inherit',
                            outline: 'none', boxSizing: 'border-box'
                        }}
                    />
                    <button
                        type="submit" disabled={loading}
                        style={{
                            width: '100%', padding: '0.85rem', border: 'none', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #2ea043, #10b981)',
                            color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'inherit', transition: 'all 0.2s',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(240,246,252,0.1)' }} />
                    <span style={{ color: '#8b949e', fontSize: '0.8rem' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(240,246,252,0.1)' }} />
                </div>

                {/* Demo Login */}
                <button
                    onClick={handleDemoLogin} disabled={loading}
                    style={{
                        width: '100%', padding: '0.85rem', border: '1px solid rgba(240,246,252,0.15)',
                        borderRadius: '10px', background: 'rgba(255,255,255,0.04)',
                        color: '#f0f6fc', fontSize: '1rem', fontWeight: 500, cursor: 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.2s',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    🚀 Try Demo Account (No signup needed)
                </button>

                {/* Toggle */}
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>
                        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    </span>
                    <button
                        onClick={() => { setIsSignup(!isSignup); setError(''); }}
                        style={{
                            background: 'none', border: 'none', color: '#2ea043',
                            cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit'
                        }}
                    >
                        {isSignup ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
}
