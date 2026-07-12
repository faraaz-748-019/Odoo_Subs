const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function createSchema(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            name TEXT,
            role TEXT DEFAULT 'User',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
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
        -- New tables for Gamification Expansion
        CREATE TABLE IF NOT EXISTS challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, description TEXT, type TEXT, status TEXT, points INTEGER, requirements TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, description TEXT, icon TEXT, required_points INTEGER
        );
        CREATE TABLE IF NOT EXISTS user_badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER, badge_id INTEGER, earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(badge_id) REFERENCES badges(id)
        );
    `);
}

async function seedDemoData(db) {
    const scoreCount = await db.get('SELECT COUNT(*) as count FROM esg_scores_history');
    if (scoreCount.count === 0) {
        // Mock ESG history
        await db.run("INSERT INTO esg_scores_history (record_date, environmental, social, governance) VALUES (date('now', '-2 month'), 75, 68, 80)");
        await db.run("INSERT INTO esg_scores_history (record_date, environmental, social, governance) VALUES (date('now', '-1 month'), 80, 72, 85)");
        await db.run("INSERT INTO esg_scores_history (record_date, environmental, social, governance) VALUES (date('now'), 82, 74, 88)");
        
        // Mock Users
        await db.run("INSERT INTO users (email, password, name, role) VALUES ('demo@example.com', 'hashedpassword', 'Demo User', 'Admin')");

        // Mock Gamification data
        await db.run("INSERT INTO challenges (title, description, type, status, points, requirements) VALUES ('Zero Waste Week', 'Reduce office waste by 50%', 'Environmental', 'Active', 500, 'Submit 5 daily logs')");
        await db.run("INSERT INTO challenges (title, description, type, status, points, requirements) VALUES ('Diversity Training', 'Complete Q3 Diversity course', 'Social', 'Under Review', 200, 'Course Certificate')");

        await db.run("INSERT INTO badges (name, description, icon, required_points) VALUES ('Eco Warrior', 'Completed 5 Env Challenges', '🌱', 1000)");
        await db.run("INSERT INTO badges (name, description, icon, required_points) VALUES ('Social Champion', 'Top 10% in Social initiatives', '👥', 1500)");

        // Mock Participations
        await db.run("INSERT INTO activities (title, joined_count, is_evidence_required, status) VALUES ('Beach Cleanup', 24, 1, 'Active')");
        await db.run("INSERT INTO participations (employee_name, activity_id, proof_url, points_awarded, status) VALUES ('Aditi Rao', 1, 'photo.jpg', 50, 'Pending')");
        await db.run("INSERT INTO participations (employee_name, activity_id, proof_url, points_awarded, status) VALUES ('Karan Shah', 1, 'cert.pdf', 30, 'Approved')");

        // Mock Audits
        await db.run("INSERT INTO audits (title, department, auditor, audit_date, findings, status) VALUES ('Q3 Safety Audit', 'Manufacturing', 'External Corp', '2026-07-01', 'Minor issues found', 'Completed')");
        await db.run("INSERT INTO compliance_issues (audit_id, issue_text, severity, department, status) VALUES (1, 'Missing MSDS sheets', 'High', 'Manufacturing', 'Open')");
    }
}

async function setupDatabases() {
    // 1. Setup Production Database
    const dbProd = await open({
        filename: './database_prod.sqlite',
        driver: sqlite3.Database
    });
    await createSchema(dbProd);

    // 2. Setup Demo Database
    const dbDemo = await open({
        filename: './database_demo.sqlite',
        driver: sqlite3.Database
    });
    await createSchema(dbDemo);
    await seedDemoData(dbDemo); // Only seed the demo database

    return { dbProd, dbDemo };
}

module.exports = { setupDatabases };
