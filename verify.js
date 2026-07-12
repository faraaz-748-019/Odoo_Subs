const http = require('http');

function request(method, path, headers = {}, body = null) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5005,
            path: encodeURI(path),
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    console.log("Starting API Verification...");

    // 1. Login as Demo User
    const loginRes = await request('POST', '/api/auth/demo');
    if (loginRes.status !== 200) {
        console.error("Demo login failed:", loginRes.body);
        process.exit(1);
    }
    const token = loginRes.body.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log("Logged in successfully. Token received.");

    // 2. Test Governance: Create Audit
    const createAuditRes = await request('POST', '/api/governance/audits', headers, {
        title: 'Test Audit',
        department: 'Corporate',
        auditor: 'Test Auditor',
        audit_date: '2026-07-12'
    });
    console.log("POST /api/governance/audits:", createAuditRes);
    const auditId = createAuditRes.body.id;

    // 3. Test Governance: Delete Audit
    const deleteAuditRes = await request('DELETE', `/api/governance/audits/${auditId}`, headers);
    console.log("DELETE /api/governance/audits/:id:", deleteAuditRes);

    // 4. Test Governance: Resolve Issue
    const resolveIssueRes = await request('PUT', '/api/governance/issues/1/resolve', headers);
    console.log("PUT /api/governance/issues/:id/resolve:", resolveIssueRes);

    // 5. Test Social: Delete Activity
    const deleteActivityRes = await request('DELETE', '/api/social/activities/1', headers);
    console.log("DELETE /api/social/activities/:id:", deleteActivityRes);

    // 6. Test Social: Approve/Reject Participations
    const approveRes = await request('POST', '/api/social/participations/1/approve', headers);
    console.log("POST /api/social/participations/:id/approve:", approveRes);

    const rejectRes = await request('POST', '/api/social/participations/1/reject', headers);
    console.log("POST /api/social/participations/:id/reject:", rejectRes);

    // 7. Test Gamification: Remove User Participations
    const removeUserRes = await request('DELETE', '/api/social/participations/user/Aditi Rao', headers);
    console.log("DELETE /api/social/participations/user/:name:", removeUserRes);

    console.log("Verification complete.");
}

run().catch(console.error);
