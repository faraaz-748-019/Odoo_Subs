const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite'); // Correct path relative to root

db.serialize(() => {
    // Insert 3 dummy users with varying points
    db.run(`INSERT INTO participations (employee_name, activity_id, proof_url, points_awarded, status) VALUES ('Alice Chen', 1, 'proof.jpg', 120, 'Approved')`);
    db.run(`INSERT INTO participations (employee_name, activity_id, proof_url, points_awarded, status) VALUES ('Bob Smith', 1, 'proof.jpg', 60, 'Approved')`);
    db.run(`INSERT INTO participations (employee_name, activity_id, proof_url, points_awarded, status) VALUES ('Charlie Davis', 1, 'proof.jpg', 40, 'Approved')`);
    
    console.log("Dummy data inserted successfully into root database.");
});

db.close();
