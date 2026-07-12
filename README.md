# EcoSphere: Corporate ESG & Sustainability Digital Twin

EcoSphere is a premium corporate ESG (Environmental, Social, and Governance) management suite and digital twin. It enables enterprises to bridge the gap between regulatory audit readiness, carbon footprint target verification, social diversity, and employee CSR gamification milestones.

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, Recharts (Dynamic Analytics), Lucide Icons, Vanilla CSS (Premium Glassmorphism Design System)
- **Backend**: Node.js, Express, SQLite3 (with transactional multi-database dynamic router)
- **Authentication**: JWT bearer token authentication, dynamic payload inspection.

---

## 🌟 Core Modules

### 1. 🍃 Environmental Telemetry
- Scope 1, 2, and 3 carbon emissions telemetry tracking.
- Interactive KPI metric cards displaying overall targets vs. current levels.
- Real-time Year-to-Date reduction trend line charts.

### 2. 👥 Social Engagement & CSR
- Track corporate diversity stats across departments and genders.
- CSR Volunteering Approval Queue: Employees submit activity proof URLs, and admins review/approve hours and points.

### 3. 🛡️ Governance & Auditing
- System Policy Catalog with live acknowledgment tracking.
- Audit Trail Manager: Log external/internal audit reviews.
- Compliance Risk Monitor: Spot and resolve outstanding structural issues.

### 4. 🏆 Gamification & Milestones
- Interactive Milestone Challenges (e.g. Zero Waste Week).
- Lockable Badge Gallery: Earn points through CSR activities and unlock badges (Eco Warrior, Social Champion).

---

## 🔒 Security & Data Integrity Controls

- **Dual-Database Router**: 
  - `database_demo.sqlite`: Fully pre-seeded with mockup data (challenges, badges, history) for demonstrations.
  - `database_prod.sqlite`: Clean, secure database for real user logins and data entry.
- **Password Policies**: Enforces password requirements (length >= 8 characters) during user registration.
- **Fail-safe Production Secret**: The Express server terminates immediately in production if `process.env.JWT_SECRET` is missing.
- **Telemetry Boundary Checks**: Clamps all calculated scores strictly to the `[0, 100]` range.

---

## ⚙️ Setup & Local Run Guide

### Prerequisites
- Node.js (v18+)

### 1. Backend Server Setup
```bash
cd backend
npm install
node server.js
```
*Runs locally on `http://localhost:5005`.*

### 2. Frontend Application Setup
```bash
cd frontend
npm install
npm run dev
```
*Launches Vite hot-reload server at `http://localhost:5173`.*

---

## 🌿 Git Workflow & Collaboration Rules

To ensure standard version control practices and team integration:
1. **Never commit directly to `main`**.
2. Create dedicated task branches:
   - Features: `feature/name-of-feature`
   - Bugfixes: `bugfix/issue-description`
3. Push branches to remote and submit a Pull Request (PR) for team peer review prior to merging.
