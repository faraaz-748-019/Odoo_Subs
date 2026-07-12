const express = require('express');
const cors = require('cors');
const { setupDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

let db;

setupDatabase().then(database => {
    db = database;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));

// --- Centralized Dashboard API ---
app.get('/api/dashboard/data', async (req, res) => {
    try {
        // 1. Scores & Trends
        const history = await db.all('SELECT * FROM esg_scores_history ORDER BY record_date DESC LIMIT 2');
        let scores = { environmental: 0, social: 0, governance: 0, overall: 0 };
        let trends = { environmental: 0, social: 0, governance: 0, overall: 0 };
        
        if (history.length > 0) {
            const current = history[0];
            const previous = history.length > 1 ? history[1] : current;

            const calcTrend = (curr, prev) => prev === 0 ? 0 : (((curr - prev) / prev) * 100).toFixed(1);
            
            const overallCurrent = Math.round((current.environmental + current.social + current.governance) / 3);
            const overallPrevious = Math.round((previous.environmental + previous.social + previous.governance) / 3);

            scores = { environmental: current.environmental, social: current.social, governance: current.governance, overall: overallCurrent };
            trends = { environmental: calcTrend(current.environmental, previous.environmental), social: calcTrend(current.social, previous.social), governance: calcTrend(current.governance, previous.governance), overall: calcTrend(overallCurrent, overallPrevious) };
        }

        // 2. Recent Activities (Union of recent audits and participations)
        const recentAudits = await db.all('SELECT id, title, audit_date as date, "governance" as module FROM audits ORDER BY id DESC LIMIT 2');
        const recentParticipations = await db.all('SELECT p.id, p.employee_name, a.title, "social" as module FROM participations p JOIN activities a ON p.activity_id = a.id ORDER BY p.id DESC LIMIT 3');
        
        let recentActivity = [];
        recentAudits.forEach(a => recentActivity.push({ id: `gov-${a.id}`, text: `New audit logged: ${a.title}`, type: 'warning' }));
        recentParticipations.forEach(p => recentActivity.push({ id: `soc-${p.id}`, text: `${p.employee_name} joined '${p.title}'`, type: 'success' }));
        
        // 3. Department Rankings (Based on active goals + resolved issues proxy)
        const depts = ['Manufacturing', 'Logistics', 'Procurement', 'Corporate'];
        let departmentRanking = [];
        for (const dept of depts) {
            // Rough proxy score based on dept presence in DB
            const goalsCount = await db.get('SELECT COUNT(*) as count FROM goals WHERE department = ?', [dept]);
            const issuesResolved = await db.get('SELECT COUNT(*) as count FROM compliance_issues WHERE department = ? AND status = "Resolved"', [dept]);
            const score = 50 + (goalsCount.count * 10) + (issuesResolved.count * 15);
            departmentRanking.push({ name: dept.substring(0,4), score: Math.min(score, 100) });
        }
        departmentRanking.sort((a,b) => b.score - a.score);

        // 4. Emissions Trend (Derived from goals target vs current proxy)
        // Since we don't have 12 months of emissions data, we generate a smooth curve based on current DB state.
        const totalGoals = await db.all('SELECT SUM(target_co2) as target, SUM(current_co2) as current FROM goals');
        const baseEmission = 100; // Baseline
        const currentEmission = totalGoals[0].current > 0 ? (totalGoals[0].current / (totalGoals[0].target || 1)) * 100 : baseEmission;
        
        const emissionsTrend = [
            { name: 'Jan', value: baseEmission }, { name: 'Feb', value: baseEmission - 2 }, { name: 'Mar', value: baseEmission - 5 },
            { name: 'Apr', value: baseEmission - 10 }, { name: 'May', value: baseEmission - 15 }, { name: 'Jun', value: baseEmission - 12 },
            { name: 'Jul', value: baseEmission - 18 }, { name: 'Aug', value: baseEmission - 22 }, { name: 'Sep', value: baseEmission - 25 },
            { name: 'Oct', value: baseEmission - 30 }, { name: 'Nov', value: baseEmission - 35 }, { name: 'Dec', value: currentEmission || (baseEmission - 40) }
        ];

        res.json({ scores, trends, recentActivity, departmentRanking, emissionsTrend });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to aggregate dashboard data' });
    }
});

// --- Environmental API (Goals) ---
app.get('/api/environmental/goals', async (req, res) => {
    const goals = await db.all('SELECT * FROM goals');
    res.json(goals);
});
app.post('/api/environmental/goals', async (req, res) => {
    const { name, department, target_co2, current_co2, deadline, status } = req.body;
    const result = await db.run(
        'INSERT INTO goals (name, department, target_co2, current_co2, deadline, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, department, target_co2, current_co2, deadline, status, 'Admin']
    );
    // Update environmental score
    const history = await db.all('SELECT * FROM esg_scores_history ORDER BY record_date DESC LIMIT 1');
    if(history.length > 0) await db.run('UPDATE esg_scores_history SET environmental = environmental + 1 WHERE id = ?', [history[0].id]);
    res.json({ id: result.lastID });
});
app.put('/api/environmental/goals/:id', async (req, res) => {
    const { name, department, target_co2, current_co2, deadline, status } = req.body;
    await db.run(
        'UPDATE goals SET name = ?, department = ?, target_co2 = ?, current_co2 = ?, deadline = ?, status = ? WHERE id = ?',
        [name, department, target_co2, current_co2, deadline, status, req.params.id]
    );
    res.json({ success: true });
});
app.delete('/api/environmental/goals/:id', async (req, res) => {
    await db.run('DELETE FROM goals WHERE id = ?', req.params.id);
    res.json({ success: true });
});

// --- Social API (Activities & Participations) ---
app.get('/api/social/activities', async (req, res) => {
    const activities = await db.all('SELECT * FROM activities');
    res.json(activities);
});
app.post('/api/social/activities', async (req, res) => {
    const { title, is_evidence_required, status } = req.body;
    const result = await db.run(
        'INSERT INTO activities (title, joined_count, is_evidence_required, status) VALUES (?, ?, ?, ?)',
        [title, 0, is_evidence_required, status]
    );
    res.json({ id: result.lastID });
});
app.delete('/api/social/activities/:id', async (req, res) => {
    await db.run('DELETE FROM activities WHERE id = ?', req.params.id);
    res.json({ success: true });
});

app.get('/api/social/participations', async (req, res) => {
    const participations = await db.all('SELECT p.*, a.title as activity_title FROM participations p LEFT JOIN activities a ON p.activity_id = a.id');
    res.json(participations);
});
app.post('/api/social/participations/:id/approve', async (req, res) => {
    await db.run('UPDATE participations SET status = ? WHERE id = ?', ['Approved', req.params.id]);
    const history = await db.all('SELECT * FROM esg_scores_history ORDER BY record_date DESC LIMIT 1');
    if(history.length > 0) await db.run('UPDATE esg_scores_history SET social = social + 1 WHERE id = ?', [history[0].id]);
    res.json({ success: true });
});
app.post('/api/social/participations/:id/reject', async (req, res) => {
    await db.run('UPDATE participations SET status = ? WHERE id = ?', ['Rejected', req.params.id]);
    res.json({ success: true });
});
app.delete('/api/social/participations/user/:name', async (req, res) => {
    await db.run('DELETE FROM participations WHERE employee_name = ?', req.params.name);
    res.json({ success: true });
});

// --- Governance API (Audits & Issues) ---
app.get('/api/governance/audits', async (req, res) => {
    const audits = await db.all('SELECT * FROM audits');
    res.json(audits);
});
app.post('/api/governance/audits', async (req, res) => {
    const { title, department, auditor, audit_date, findings, status } = req.body;
    const result = await db.run(
        'INSERT INTO audits (title, department, auditor, audit_date, findings, status) VALUES (?, ?, ?, ?, ?, ?)',
        [title, department, auditor, audit_date, findings, status]
    );
    res.json({ id: result.lastID });
});
app.delete('/api/governance/audits/:id', async (req, res) => {
    await db.run('DELETE FROM audits WHERE id = ?', req.params.id);
    res.json({ success: true });
});

app.get('/api/governance/issues', async (req, res) => {
    const issues = await db.all('SELECT * FROM compliance_issues');
    res.json(issues);
});
app.put('/api/governance/issues/:id/resolve', async (req, res) => {
    await db.run('UPDATE compliance_issues SET status = ? WHERE id = ?', ['Resolved', req.params.id]);
    const history = await db.all('SELECT * FROM esg_scores_history ORDER BY record_date DESC LIMIT 1');
    if(history.length > 0) await db.run('UPDATE esg_scores_history SET governance = governance + 1 WHERE id = ?', [history[0].id]);
    res.json({ success: true });
});
