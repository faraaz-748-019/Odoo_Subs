import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, Shield, Award, ArrowRight, BarChart2, CheckCircle2 } from 'lucide-react';
import '../landing.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navbar Header */}
      <header className="landing-header">
        <div className="brand flex items-center gap-2">
          <span style={{ fontSize: '1.8rem' }}>🌍</span>
          <span className="brand-text font-bold text-xl tracking-tight">EcoSphere</span>
        </div>
        <nav className="header-nav">
          <a href="#features" className="nav-link-sec">Features</a>
          <a href="#architecture" className="nav-link-sec">Architecture</a>
          <Link to="/login" className="nav-link-sec">Sign In</Link>
          <Link to="/app" className="btn-launch-cta">
            Launch Dashboard <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            Enterprise Digital Twin Platform
          </div>
          <h1 className="hero-title">
            Unified ESG Intelligence <br />
            <span className="text-gradient">For The Modern Enterprise</span>
          </h1>
          <p className="hero-subtitle">
            EcoSphere connects carbon telemetry, social governance parameters, and gamified corporate CSR milestones into a single, high-fidelity intelligence board.
          </p>
          <div className="hero-ctas">
            <Link to="/app" className="btn-primary">
              Launch Dashboard <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn-secondary-outline">
              Explore Features
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glass-frame">
            <img src="/landing_hero.png" alt="EcoSphere Global Telemetry Digital Twin" className="visual-image" />
            <div className="visual-glow-overlay"></div>
          </div>
        </div>
      </section>

      {/* Key Stats Bar */}
      <section className="stats-bar">
        <div className="stat-item">
          <h3>Scope 1/2/3</h3>
          <p>Real-Time Carbon Tracked</p>
        </div>
        <div className="stat-item">
          <h3>100%</h3>
          <p>Audit Trail Verification</p>
        </div>
        <div className="stat-item">
          <h3>24+</h3>
          <p>Active Corporate Challenges</p>
        </div>
        <div className="stat-item">
          <h3>Audit-Ready</h3>
          <p>Compliance Guarantee</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Designed for Complete Corporate Alignment</h2>
          <p className="section-subtitle">
            Four specialized modules working in harmony to track, report, and improve your ESG metrics.
          </p>
        </div>

        {/* Feature 1: Environmental */}
        <div className="feature-row">
          <div className="feature-info-card">
            <span className="badge-tag env">🌱 Environmental Module</span>
            <h3>Planetary Telemetry & Emissions Mapping</h3>
            <p>
              Auto-calculate Scope 1 (Direct), Scope 2 (Indirect), and Scope 3 (Supply Chain) emissions. Establish carbon offset targets, monitor facility energy efficiency, and audit waste streams dynamically.
            </p>
            <ul className="feature-bullet-list">
              <li><CheckCircle2 size={16} className="text-env" /> Live carbon footprint tracking</li>
              <li><CheckCircle2 size={16} className="text-env" /> Scope-based threshold alarms</li>
              <li><CheckCircle2 size={16} className="text-env" /> Integrated resource utility audits</li>
            </ul>
          </div>
          <div className="feature-image-card">
            <img src="/esg_environmental.png" alt="Environmental Telemetry Features" />
          </div>
        </div>

        {/* Feature 2: Social */}
        <div className="feature-row reverse">
          <div className="feature-info-card">
            <span className="badge-tag social">👥 Social CSR Module</span>
            <h3>Human Capital & Community Volunteering</h3>
            <p>
              Track workforce diversity stats across divisions and manage employee volunteering initiatives. Features a dedicated CSR volunteer verification flow where staff upload proof links and managers approve hours.
            </p>
            <ul className="feature-bullet-list">
              <li><CheckCircle2 size={16} className="text-social" /> Real-time diversity demographics</li>
              <li><CheckCircle2 size={16} className="text-social" /> Volunteer approval queues with evidence check</li>
              <li><CheckCircle2 size={16} className="text-social" /> CSR community event coordinators</li>
            </ul>
          </div>
          <div className="feature-image-card">
            <img src="/esg_social.png" alt="Social CSR Features" />
          </div>
        </div>

        {/* Feature 3: Governance */}
        <div className="feature-row">
          <div className="feature-info-card">
            <span className="badge-tag gov">🏛️ Governance Module</span>
            <h3>Risk Mitigation & Audit Compliance</h3>
            <p>
              Publish corporate policy catalogs and track worker acknowledgment rates in real-time. Conduct internal audits and flag non-compliance issues with severe priority tags to guarantee legal compliance.
            </p>
            <ul className="feature-bullet-list">
              <li><CheckCircle2 size={16} className="text-gov" /> Centralized corporate policy logs</li>
              <li><CheckCircle2 size={16} className="text-gov" /> Audit trail documentation</li>
              <li><CheckCircle2 size={16} className="text-gov" /> Severity-based compliance ticket manager</li>
            </ul>
          </div>
          <div className="feature-image-card">
            <img src="/esg_governance.png" alt="Governance Compliance Features" />
          </div>
        </div>

        {/* Feature 4: Gamification */}
        <div className="feature-row reverse">
          <div className="feature-info-card">
            <span className="badge-tag gamify">🏆 Gamification Module</span>
            <h3>Employee Engagement & Milestones</h3>
            <p>
              Transform sustainability targets into a social game. Empower employee participation via active challenges, milestones, point distributions, and unlockable achievement galleries (Eco Warrior, Social Champion).
            </p>
            <ul className="feature-bullet-list">
              <li><CheckCircle2 size={16} className="text-gamify" /> Interactive corporate challenges</li>
              <li><CheckCircle2 size={16} className="text-gamify" /> Unlockable badge achievement lists</li>
              <li><CheckCircle2 size={16} className="text-gamify" /> Dynamic XP rewards leaderboard</li>
            </ul>
          </div>
          <div className="feature-image-card">
            <img src="/esg_gamification.png" alt="Gamification Milestones Features" />
          </div>
        </div>
      </section>

      {/* Flowchart Section */}
      <section className="flowchart-section">
        <div className="section-header">
          <h2 className="section-title">Operational Workflow</h2>
          <p className="section-subtitle">A seamless 5-step loop from database connection to verified audit exports.</p>
        </div>
        
        <div className="flowchart-timeline">
          <div className="flowchart-step">
            <div className="step-number-bubble env">1</div>
            <div className="step-content glass-panel">
              <div className="step-image-wrapper">
                <img src="/step1_db.png" alt="Database Setup" />
              </div>
              <h4>Setup Database</h4>
              <p>Select your environment. Sign up for a blank production sandbox or join the pre-seeded Demo space.</p>
            </div>
          </div>
          
          <div className="flowchart-connector">➔</div>
          
          <div className="flowchart-step">
            <div className="step-number-bubble social">2</div>
            <div className="step-content glass-panel">
              <div className="step-image-wrapper">
                <img src="/step2_telemetry.png" alt="Map Telemetry" />
              </div>
              <h4>Map Telemetry</h4>
              <p>Populate environmental carbon metrics, fuel expenditures, and facility utilities directly.</p>
            </div>
          </div>
          
          <div className="flowchart-connector">➔</div>
          
          <div className="flowchart-step">
            <div className="step-number-bubble gov">3</div>
            <div className="step-content glass-panel">
              <div className="step-image-wrapper">
                <img src="/step3_policy.png" alt="Deploy Policies" />
              </div>
              <h4>Deploy Policies</h4>
              <p>Publish cataloged corporate policies, audit assessments, and issue safety/governance reviews.</p>
            </div>
          </div>
          
          <div className="flowchart-connector">➔</div>
          
          <div className="flowchart-step">
            <div className="step-number-bubble gamify">4</div>
            <div className="step-content glass-panel">
              <div className="step-image-wrapper">
                <img src="/step4_gamify.png" alt="Gamify Impact" />
              </div>
              <h4>Gamify Impact</h4>
              <p>Launch CSR volunteering challenges, let employees submit proof, and award badges/XP points.</p>
            </div>
          </div>
          
          <div className="flowchart-connector">➔</div>
          
          <div className="flowchart-step">
            <div className="step-number-bubble reports">5</div>
            <div className="step-content glass-panel">
              <div className="step-image-wrapper">
                <img src="/step5_export.png" alt="Export Audits" />
              </div>
              <h4>Export Audits</h4>
              <p>Filter logs across categories and departments, view results, and download secure reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section id="architecture" className="cta-footer-section">
        <div className="cta-box glass-panel">
          <h2>Ready to optimize your corporate footprint?</h2>
          <p>
            Deploy the EcoSphere ESG Digital Twin. Get live audit-ready datasets, compliance monitors, and CSR gamification metrics from a single dashboard.
          </p>
          <div className="flex gap-4 justify-center" style={{ marginTop: '2rem' }}>
            <Link to="/app" className="btn-primary">
              Launch Dashboard <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary">
              Login to Demo Space
            </Link>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="landing-footer">
        <p>© 2026 EcoSphere Digital Twin Corp. All rights reserved. Secured under ISO 14001 compliance standards.</p>
      </footer>
    </div>
  );
}
