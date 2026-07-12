require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { setupDatabases } = require('./database');

const app = express();
const PORT = process.env.PORT || 5005;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-fallback-key-for-dev';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error("FATAL: JWT_SECRET environment variable is missing in production!");
    process.exit(1);
}

app.use(cors());
app.use(express.json());

let dbProd;
let dbDemo;

setupDatabases().then(databases => {
    dbProd = databases.dbProd;
    dbDemo = databases.dbDemo;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));

// --- Auth Routes (Public) ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) return res.status(400).json({ error: 'All fields required' });
        if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        
        const existingUser = await dbProd.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await dbProd.run(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [email, hashedPassword, name]
        );

        const token = jwt.sign({ id: result.lastID, role: 'User', accountType: 'real' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: result.lastID, email, name, role: 'User', accountType: 'real' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await dbProd.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role, accountType: 'real' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, accountType: 'real' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/auth/demo', async (req, res) => {
    try {
        // Issue a specific token that flags this as a demo session
        const demoUser = await dbDemo.get("SELECT * FROM users WHERE email = 'demo@example.com'");
        const token = jwt.sign({ id: demoUser.id, role: demoUser.role, accountType: 'demo' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: demoUser.id, email: demoUser.email, name: demoUser.name, role: demoUser.role, accountType: 'demo' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Demo login failed' });
    }
});

// --- Authentication & DB Router Middleware ---
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        // Route database connection based on accountType
        req.db = decoded.accountType === 'demo' ? dbDemo : dbProd;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Apply middleware to all /api routes below
app.use('/api', authMiddleware);

// --- Centralized Dashboard API ---
app.get('/api/dashboard/data', async (req, res) => {
    try {
        const db = req.db;
        const history = await db.all('SELECT * FROM esg_scores_history ORDER BY record_date DESC LIMIT 2');
        let scores = { environmental: 0, social: 0, governance: 0, overall: 0 };
        let trends = { environmental: 0, social: 0, governance: 0, overall: 0 };
        
        const clamp = (val) => Math.max(0, Math.min(100, Math.round(val)));

        if (history.length > 0) {
            const current = history[0];
            const previous = history.length > 1 ? history[1] : current;
            const calcTrend = (curr, prev) => prev === 0 ? 0 : (((curr - prev) / prev) * 100).toFixed(1);
            const overallCurrent = Math.round((current.environmental + current.social + current.governance) / 3);
            const overallPrevious = Math.round((previous.environmental + previous.social + previous.governance) / 3);

            scores = { 
                environmental: clamp(current.environmental), 
                social: clamp(current.social), 
                governance: clamp(current.governance), 
                overall: clamp(overallCurrent) 
            };
            trends = { environmental: calcTrend(current.environmental, previous.environmental), social: calcTrend(current.social, previous.social), governance: calcTrend(current.governance, previous.governance), overall: calcTrend(overallCurrent, overallPrevious) };
        }

        const recentAudits = await db.all('SELECT id, title, audit_date as date, "governance" as module FROM audits ORDER BY id DESC LIMIT 2');
        const recentParticipations = await db.all('SELECT p.id, p.employee_name, a.title, "social" as module FROM participations p JOIN activities a ON p.activity_id = a.id ORDER BY p.id DESC LIMIT 3');
        
        let recentActivity = [];
        recentAudits.forEach(a => recentActivity.push({ id: `gov-${a.id}`, text: `New audit: ${a.title}`, type: 'warning' }));
        recentParticipations.forEach(p => recentActivity.push({ id: `soc-${p.id}`, text: `${p.employee_name} joined '${p.title}'`, type: 'success' }));
        
        const depts = ['Manufacturing', 'Logistics', 'Procurement', 'Corporate'];
        let departmentRanking = [];
        for (const dept of depts) {
            const goalsCount = await db.get('SELECT COUNT(*) as count FROM goals WHERE department = ?', [dept]);
            const issuesResolved = await db.get('SELECT COUNT(*) as count FROM compliance_issues WHERE department = ? AND status = "Resolved"', [dept]);
            const score = 50 + (goalsCount.count * 10) + (issuesResolved.count * 15);
            departmentRanking.push({ name: dept.substring(0,4), score: Math.min(score, 100) });
        }
        departmentRanking.sort((a,b) => b.score - a.score);

        const totalGoals = await db.all('SELECT SUM(target_co2) as target, SUM(current_co2) as current FROM goals');
        const baseEmission = 100;
        const currentEmission = totalGoals[0].current > 0 ? (totalGoals[0].current / (totalGoals[0].target || 1)) * 100 : baseEmission;
        const emissionsTrend = [
            { name: 'Jan', value: baseEmission }, { name: 'Feb', value: baseEmission - 2 }, { name: 'Mar', value: baseEmission - 5 },
            { name: 'Apr', value: baseEmission - 10 }, { name: 'May', value: baseEmission - 15 }, { name: 'Jun', value: baseEmission - 12 },
            { name: 'Jul', value: baseEmission - 18 }, { name: 'Aug', value: baseEmission - 22 }, { name: 'Sep', value: baseEmission - 25 },
            { name: 'Oct', value: baseEmission - 30 }, { name: 'Nov', value: baseEmission - 35 }, { name: 'Dec', value: currentEmission || (baseEmission - 40) }
        ];

        res.json({ scores, trends, recentActivity, departmentRanking, emissionsTrend });
    } catch (err) {
        res.status(500).json({ error: 'Failed to aggregate dashboard data' });
    }
});

// --- Environmental API ---
app.get('/api/environmental/goals', async (req, res) => {
    const goals = await req.db.all('SELECT * FROM goals');
    res.json(goals);
});
app.post('/api/environmental/goals', async (req, res) => {
    const { name, department, target_co2, current_co2, deadline, status } = req.body;
    const result = await req.db.run(
        'INSERT INTO goals (name, department, target_co2, current_co2, deadline, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, department, target_co2, current_co2, deadline, status, req.user.name]
    );
    res.json({ id: result.lastID });
});
app.put('/api/environmental/goals/:id', async (req, res) => {
    const { name, department, target_co2, current_co2, deadline, status } = req.body;
    await req.db.run(
        'UPDATE goals SET name = ?, department = ?, target_co2 = ?, current_co2 = ?, deadline = ?, status = ? WHERE id = ?',
        [name, department, target_co2, current_co2, deadline, status, req.params.id]
    );
    res.json({ success: true });
});
app.delete('/api/environmental/goals/:id', async (req, res) => {
    await req.db.run('DELETE FROM goals WHERE id = ?', req.params.id);
    res.json({ success: true });
});

// --- Social API ---
app.get('/api/social/activities', async (req, res) => res.json(await req.db.all('SELECT * FROM activities')));
app.post('/api/social/activities', async (req, res) => {
    const { title, is_evidence_required, status } = req.body;
    const result = await req.db.run('INSERT INTO activities (title, joined_count, is_evidence_required, status) VALUES (?, ?, ?, ?)', [title, 0, is_evidence_required, status]);
    res.json({ id: result.lastID });
});
app.get('/api/social/participations', async (req, res) => res.json(await req.db.all('SELECT p.*, a.title as activity_title FROM participations p LEFT JOIN activities a ON p.activity_id = a.id')));
app.delete('/api/social/activities/:id', async (req, res) => {
    try {
        await req.db.run('DELETE FROM activities WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete activity' });
    }
});
app.post('/api/social/participations/:id/approve', async (req, res) => {
    try {
        await req.db.run('UPDATE participations SET status = ? WHERE id = ?', ['Approved', req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to approve participation' });
    }
});
app.post('/api/social/participations/:id/reject', async (req, res) => {
    try {
        await req.db.run('UPDATE participations SET status = ? WHERE id = ?', ['Rejected', req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to reject participation' });
    }
});
app.delete('/api/social/participations/user/:name', async (req, res) => {
    try {
        await req.db.run('DELETE FROM participations WHERE employee_name = ?', [req.params.name]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete user participations' });
    }
});

// --- Governance API ---
app.get('/api/governance/audits', async (req, res) => res.json(await req.db.all('SELECT * FROM audits')));
app.post('/api/governance/audits', async (req, res) => {
    try {
        const { title, department, auditor, audit_date } = req.body;
        const result = await req.db.run(
            'INSERT INTO audits (title, department, auditor, audit_date, findings, status) VALUES (?, ?, ?, ?, ?, ?)',
            [title, department, auditor, audit_date, 'Pending review', 'Under Review']
        );
        res.json({ id: result.lastID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create audit' });
    }
});
app.delete('/api/governance/audits/:id', async (req, res) => {
    try {
        await req.db.run('DELETE FROM audits WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete audit' });
    }
});
app.get('/api/governance/issues', async (req, res) => res.json(await req.db.all('SELECT * FROM compliance_issues')));
app.put('/api/governance/issues/:id/resolve', async (req, res) => {
    try {
        await req.db.run('UPDATE compliance_issues SET status = ? WHERE id = ?', ['Resolved', req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to resolve compliance issue' });
    }
});

// --- Gamification API (New Phase 2 Expansion) ---
app.get('/api/gamification/challenges', async (req, res) => res.json(await req.db.all('SELECT * FROM challenges ORDER BY created_at DESC')));
app.post('/api/gamification/challenges', async (req, res) => {
    const { title, description, type, points, requirements } = req.body;
    const result = await req.db.run(
        'INSERT INTO challenges (title, description, type, status, points, requirements) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, type, 'Active', points, requirements]
    );
    res.json({ id: result.lastID });
});

app.get('/api/gamification/badges', async (req, res) => {
    // Get all badges, and outer join with user_badges to see if the current user earned them
    const badges = await req.db.all(`
        SELECT b.*, ub.earned_at 
        FROM badges b 
        LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = ?
    `, [req.user.id]);
    res.json(badges);
});

app.post('/api/gamification/challenges/:id/join', async (req, res) => {
    try {
        const challenge = await req.db.get('SELECT * FROM challenges WHERE id = ?', [req.params.id]);
        if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
        
        // Check if already joined
        const existing = await req.db.get('SELECT * FROM participations WHERE employee_name = ? AND activity_id = ?', [req.user.name, challenge.id]);
        if (existing) return res.status(400).json({ error: 'Already joined this challenge' });

        await req.db.run(
            'INSERT INTO participations (employee_name, activity_id, proof_url, points_awarded, status) VALUES (?, ?, ?, ?, ?)',
            [req.user.name, challenge.id, 'joined_challenge', challenge.points, 'Pending']
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to join challenge' });
    }
});

// --- Settings API (Persistence Fix) ---
app.get('/api/settings', async (req, res) => {
    try {
        const rows = await req.db.all('SELECT * FROM settings');
        const settingsObj = {};
        rows.forEach(r => {
            const keyMap = {
                'auto_emission': 'autoEmission',
                'require_evidence': 'requireEvidence',
                'auto_award_badge': 'autoAwardBadge',
                'email_alerts': 'emailAlerts'
            };
            const mappedKey = keyMap[r.key] || r.key;
            settingsObj[mappedKey] = r.value === 1;
        });
        res.json(settingsObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

app.put('/api/settings', async (req, res) => {
    try {
        const { key, value } = req.body;
        const keyMap = {
            'autoEmission': 'auto_emission',
            'requireEvidence': 'require_evidence',
            'autoAwardBadge': 'auto_award_badge',
            'email_alerts': 'email_alerts'
        };
        const dbKey = keyMap[key] || key;
        const intVal = value ? 1 : 0;
        await req.db.run('UPDATE settings SET value = ? WHERE key = ?', [intVal, dbKey]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

