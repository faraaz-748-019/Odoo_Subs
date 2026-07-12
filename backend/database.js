const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setupDatabase() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, department TEXT, target_co2 REAL, current_co2 REAL, deadline TEXT, status TEXT, created_by TEXT
        );
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, joined_count INTEGER, is_evidence_required BOOLEAN, status TEXT
        );
        CREATE TABLE IF NOT EXISTS audits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, department TEXT, auditor TEXT, audit_date TEXT, findings TEXT, status TEXT
        );
        CREATE TABLE IF NOT EXISTS participations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_name TEXT, activity_id INTEGER, proof_url TEXT, points_awarded INTEGER, status TEXT,
            FOREIGN KEY(activity_id) REFERENCES activities(id)
        );
        CREATE TABLE IF NOT EXISTS compliance_issues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            audit_id INTEGER, issue_text TEXT, severity TEXT, department TEXT, status TEXT,
            FOREIGN KEY(audit_id) REFERENCES audits(id)
        );
        CREATE TABLE IF NOT EXISTS esg_scores_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            record_date TEXT, environmental INTEGER, social INTEGER, governance INTEGER
        );
    `);

    // Insert seeds if empty
    const scoreCount = await db.get('SELECT COUNT(*) as count FROM esg_scores_history');
    if (scoreCount.count === 0) {
        // Mock 1 activity and 1 audit if tables are totally empty, but usually they might not be due to earlier creation.
        // Let's just insert some history.
        await db.run("INSERT INTO esg_scores_history (record_date, environmental, social, governance) VALUES (date('now', '-1 month'), 80, 72, 85)");
        await db.run("INSERT INTO esg_scores_history (record_date, environmental, social, governance) VALUES (date('now'), 82, 74, 88)");
        
        await db.run("INSERT INTO participations (employee_name, activity_id, proof_url, points_awarded, status) VALUES ('Aditi Rao', 1, 'photo.jpg', 50, 'Pending')");
        await db.run("INSERT INTO participations (employee_name, activity_id, proof_url, points_awarded, status) VALUES ('Karan Shah', 1, 'cert.pdf', 30, 'Approved')");

        await db.run("INSERT INTO compliance_issues (audit_id, issue_text, severity, department, status) VALUES (1, 'Missing MSDS sheets', 'High', 'Manufacturing', 'Open')");
        await db.run("INSERT INTO compliance_issues (audit_id, issue_text, severity, department, status) VALUES (1, 'Late vendor disclosure', 'Medium', 'Procurement', 'Resolved')");
    }

    return db;
}
module.exports = { setupDatabase };
