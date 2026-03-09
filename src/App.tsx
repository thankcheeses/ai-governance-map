import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle, Shield, Activity, TrendingUp, FileText, Globe, Network, BarChart3, Upload, Save, RotateCcw, ArrowRight, Download, ExternalLink, Filter } from 'lucide-react';

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #F5F3EE;
  --surface: #FFFFFF;
  --surface-2: #F0EDE6;
  --border: #DDD9D0;
  --border-light: #EAE7E0;
  --ink: #18140C;
  --ink-2: #5C5751;
  --ink-3: #9C9891;
  --accent: #1B3D2E;
  --accent-light: #E8F2EC;
  --accent-mid: #3A7D5C;
  --gold: #A0732A;
  --red: #9B2C2C;
  --glass: rgba(255, 255, 255, 0.8);
  --font-display: 'DM Serif Display', serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --font-body: 'DM Sans', sans-serif;
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.02);
  --shadow-md: 0 12px 24px -4px rgba(24, 20, 12, 0.08);
}

body { background: var(--bg); color: var(--ink); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }

.header { 
  background: var(--glass); 
  backdrop-filter: blur(12px); 
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light); 
  padding: 0 2rem; 
  position: sticky; 
  top: 0; 
  z-index: 100; 
}
.header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 68px; gap: 1.5rem; }
.header-brand { display: flex; align-items: baseline; gap: 0.75rem; }
.header-title { font-family: var(--font-display); font-size: 1.5rem; color: var(--ink); letter-spacing: -0.01em; }
.header-version { font-family: var(--font-mono); font-size: 0.65rem; color: var(--ink-3); background: var(--surface-2); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; }

.nav-group { display: flex; background: var(--surface-2); padding: 3px; border-radius: 10px; border: 1px solid var(--border-light); }
.nav-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; font-size: 0.8125rem; font-weight: 600; color: var(--ink-2); border: none; background: transparent; cursor: pointer; border-radius: 7px; transition: all 0.2s; }
.nav-btn.active { background: var(--surface); color: var(--accent); box-shadow: var(--shadow-sm); }
.nav-btn svg { width: 14px; height: 14px; }

.score-pill { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; background: var(--accent-light); border-radius: 8px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent); font-weight: 600; }
.score-bar-wrap { width: 40px; height: 6px; background: rgba(27,61,46,0.1); border-radius: 10px; overflow: hidden; }
.score-bar-fill { height: 100%; background: var(--accent); transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }

.main { max-width: 1200px; margin: 0 auto; padding: 2.5rem 2rem; }

.control-card { 
  background: var(--surface); 
  border: 1px solid var(--border-light); 
  border-radius: 12px; 
  margin-bottom: 0.75rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}
.control-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--border); }
.control-card.expanded { border-left: 4px solid var(--accent); }

.mat-btn { 
  flex: 1; display: flex; flex-direction: column; align-items: center; padding: 0.6rem; 
  border-radius: 8px; border: 1px solid var(--border-light); background: var(--surface);
  cursor: pointer; transition: all 0.15s;
}
.mat-btn.active-mat { background: var(--accent); border-color: var(--accent); color: white; transform: scale(1.05); }
.mat-btn.active-mat .mat-num, .mat-btn.active-mat .mat-name { color: white; }

.radar-container { background: var(--surface); border: 1px solid var(--border-light); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; }

/* Framework Matrix Stylings */
.matrix-table { width: 100%; border-spacing: 2px; }
.matrix-cell-btn { width: 100%; height: 32px; border: none; border-radius: 4px; font-size: 0.7rem; cursor: pointer; transition: 0.2s; }
.matrix-cell-value { background: var(--accent-light); color: var(--accent); }
.matrix-cell-value:hover { background: var(--accent); color: white; }

/* Layout Utilities */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.gap-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: 12px; padding: 1.5rem; }

@media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } .header-inner { flex-direction: column; height: auto; padding: 1rem; } }
`;

// Radar Chart Component
const MaturityRadar = ({ data, controlState }) => {
  const categories = ['Risk', 'Data', 'Model', 'Security', 'Ops'];
  const size = 240;
  const center = size / 2;
  const radius = 80;
  
  const getScore = (cat) => {
    const relevant = data.filter(d => 
      d.concept.toLowerCase().includes(cat.toLowerCase()) || 
      (cat === 'Ops' && d.concept.includes('Human')) ||
      (cat === 'Security' && d.concept.includes('Adversarial'))
    );
    if (relevant.length === 0) return 5;
    const avg = relevant.reduce((acc, curr) => acc + (controlState[curr.id]?.maturity || 0), 0) / relevant.length;
    return Math.max((avg / 5) * radius, 8);
  };

  const points = categories.map((cat, i) => {
    const score = getScore(cat);
    const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
    return `${center + score * Math.cos(angle)},${center + score * Math.sin(angle)}`;
  }).join(' ');

  return (
    <div className="radar-container">
      <div className="stat-label" style={{marginBottom:'1rem'}}>Posture Profile</div>
      <svg width={size} height={size}>
        {[0.2, 0.4, 0.6, 0.8, 1].map((m) => (
          <polygon key={m} points={categories.map((_, i) => {
            const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
            return `${center + radius * m * Math.cos(angle)},${center + radius * m * Math.sin(angle)}`;
          }).join(' ')} fill="none" stroke="var(--border-light)" strokeWidth="1" />
        ))}
        <polygon points={points} fill="rgba(58, 125, 92, 0.2)" stroke="var(--accent-mid)" strokeWidth="2.5" strokeLinejoin="round" style={{transition: 'all 0.5s ease-in-out'}} />
        {categories.map((cat, i) => {
          const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
          const x = center + (radius + 25) * Math.cos(angle);
          const y = center + (radius + 20) * Math.sin(angle);
          return <text key={cat} x={x} y={y} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--ink-2)" fontFamily="var(--font-mono)">{cat.toUpperCase()}</text>;
        })}
      </svg>
    </div>
  );
};

// ... Include CITATIONS, NHID_MANIFEST, frameworks, complianceData from previous version ...
const CITATIONS = { 'NIST AI RMF': 'https://airc.nist.gov/RMF/1', 'EU AI Act': 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689', /* ... */ };
const maturityLevels = [ { level: 0, label: 'None' }, { level: 1, label: 'Initial' }, { level: 2, label: 'Managed' }, { level: 3, label: 'Defined' }, { level: 4, label: 'Measured' }, { level: 5, label: 'Optimized' } ];
const complianceData = [ 
  { id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical", description: "Systematic approach to identify, assess, and mitigate AI-related risks.", mappings: { "NIST AI RMF": ["MAP 1.1"], "EU AI Act": ["Art 9"] }, implementation: "Maintain living AI Risk Register with quarterly reviews." },
  { id: 2, concept: "Human Oversight", riskTier: "High-Risk", priority: "Critical", description: "Ensuring human intervention over consequential AI decisions.", mappings: { "EU AI Act": ["Art 14"] }, implementation: "Establish oversight committee with intervention triggers." },
  // ... other items from your complianceData array ...
];

const AIGovernancePlatform = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [controlState, setControlState] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ai-gov-v2.3') : null;
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => { localStorage.setItem('ai-gov-v2.3', JSON.stringify(controlState)); }, [controlState]);

  const overallScore = useMemo(() => {
    const vals = Object.values(controlState);
    if (vals.length === 0) return 0;
    const total = vals.reduce((a, c) => a + (c.maturity || 0), 0);
    return Math.round((total / (complianceData.length * 5)) * 100);
  }, [controlState]);

  const filteredData = complianceData.filter(item => {
    const matchSearch = item.concept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTier = selectedTier === 'All' || item.riskTier === selectedTier;
    return matchSearch && matchTier;
  });

  const toggleRow = (id) => {
    const s = new Set(expandedRows);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedRows(s);
  };

  return (
    <>
      <style>{FONTS}</style>
      <div className="app-wrapper">
        <header className="header">
          <div className="header-inner">
            <div className="header-brand">
              <span className="header-title">AI Governance Map</span>
              <span className="header-version">v2.3</span>
            </div>
            
            <nav className="nav-group">
              <button className={`nav-btn ${activeTab==='map'?'active':''}`} onClick={()=>setActiveTab('map')}><Shield/>Controls</button>
              <button className={`nav-btn ${activeTab==='network'?'active':''}`} onClick={()=>setActiveTab('network')}><Network/>Matrix</button>
              <button className={`nav-btn ${activeTab==='gap'?'active':''}`} onClick={()=>setActiveTab('gap')}><BarChart3/>Postures</button>
            </nav>

            <div className="header-actions">
              <div className="score-pill">
                <Activity size={14}/>
                <span>{overallScore}% Posture</span>
                <div className="score-bar-wrap"><div className="score-bar-fill" style={{width:`${overallScore}%`}}/></div>
              </div>
            </div>
          </div>
        </header>

        <main className="main">
          {activeTab === 'map' && (
            <div style={{animation: 'fadeIn 0.4s ease'}}>
              <div style={{display:'flex', gap:'1rem', marginBottom:'2rem'}}>
                <div style={{position:'relative', flex:1}}>
                  <Search style={{position:'absolute', left:12, top:12, color:'var(--ink-3)'}} size={18}/>
                  <input className="search-input" style={{width:'100%', padding:'10px 10px 10px 40px', borderRadius:'10px', border:'1px solid var(--border)'}} 
                    placeholder="Search frameworks..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
                </div>
                <select className="btn-ghost" style={{padding:'0 1rem'}} onChange={e=>setSelectedTier(e.target.value)}>
                  <option value="All">All Tiers</option>
                  <option value="High-Risk">High-Risk</option>
                  <option value="Autonomous Agents">Autonomous Agents</option>
                </select>
              </div>

              <div className="controls-list">
                {filteredData.map(item => (
                  <div key={item.id} className={`control-card ${expandedRows.has(item.id)?'expanded':''}`}>
                    <div className="control-header" style={{padding:'1.25rem', display:'flex', alignItems:'center', gap:'1rem', cursor:'pointer'}} onClick={()=>toggleRow(item.id)}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700, fontSize:'1rem', display:'flex', gap:'0.5rem', alignItems:'center'}}>
                          {item.concept}
                          {controlState[item.id]?.maturity > 0 && <span className="badge badge-maturity">L{controlState[item.id].maturity}</span>}
                        </div>
                        <div style={{fontSize:'0.85rem', color:'var(--ink-2)'}}>{item.description}</div>
                      </div>
                      <ChevronDown size={20} style={{transform: expandedRows.has(item.id)?'rotate(180deg)':'none', transition:'0.2s'}}/>
                    </div>
                    {expandedRows.has(item.id) && (
                      <div className="control-body" style={{padding:'1.5rem', borderTop:'1px solid var(--border-light)', background:'var(--bg)'}}>
                        <div className="grid-2">
                          <div>
                            <div className="section-label"><TrendingUp/> Maturity Assessment</div>
                            <div style={{display:'flex', gap:'4px', marginTop:'0.5rem'}}>
                              {maturityLevels.map(lvl => (
                                <button key={lvl.level} className={`mat-btn ${controlState[item.id]?.maturity===lvl.level?'active-mat':''}`} 
                                  onClick={()=>setControlState(p=>({...p, [item.id]:{...p[item.id], maturity:lvl.level}}))}>
                                  <span className="mat-num">{lvl.level}</span>
                                  <span className="mat-name">{lvl.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="section-label"><Shield/> Implementation</div>
                            <div className="implementation-block">{item.implementation}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gap' && (
            <div style={{animation: 'fadeIn 0.4s ease'}}>
              <div style={{display:'grid', gridTemplateColumns:'320px 1fr', gap:'2rem'}}>
                <MaturityRadar data={complianceData} controlState={controlState} />
                <div>
                  <div className="gap-stats" style={{gridTemplateColumns:'1fr 1fr'}}>
                    <div className="stat-card">
                      <div className="stat-label">System Posture</div>
                      <div className="stat-value">{overallScore}%</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Assessed Controls</div>
                      <div className="stat-value">{Object.keys(controlState).length} / {complianceData.length}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Key Recommendations</div>
                    <div style={{marginTop:'1rem', color:'var(--ink-2)', fontSize:'0.9rem'}}>
                      {overallScore < 30 ? "Focus on establishing 'Level 2' managed processes for Risk Management and Data Privacy." : "Focus on 'Level 4' quantitative measurements for Adversarial Testing and Hallucination Management."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Add Matrix logic here similar to your original code */}
        </main>
      </div>
    </>
  );
};

export default AIGovernancePlatform;
