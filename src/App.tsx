import React, { useState, useMemo, useEffect } from 'react';
import { 
  Map, Search, Filter, ChevronDown, CheckCircle, Shield, Activity, Zap, 
  TrendingUp, Clock, FileText, Printer, Lock, AlertTriangle, Globe, 
  Network, BarChart3, Upload, Save, ArrowRight, Download, X, AlertCircle, RotateCcw
} from 'lucide-react';

// --- STATIC DATA ---
const maturityLevels = [
  { level: 0, label: 'Non-Existent', color: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-500' },
  { level: 1, label: 'Initial', color: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400' },
  { level: 2, label: 'Managed', color: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400' },
  { level: 3, label: 'Defined', color: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400' },
  { level: 4, label: 'Measured', color: 'bg-cyan-500/10', border: 'border-cyan-500/50', text: 'text-cyan-400' },
  { level: 5, label: 'Optimized', color: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400' }
];

const frameworks = ['NHID-Clinical', 'NIST AI RMF 1.0', 'EU AI Act (Final)', 'ISO/IEC 42001 (AIMS)', 'US Banking (SR 11-7)', 'OECD AI Principles', 'Singapore GenAI FW', 'OWASP Top 10 LLM', 'MITRE ATLAS', 'NIST CSF 2.0', 'Google SAIF', 'CSA AI Safety', 'GDPR', 'CCPA / CPRA', 'ISO/IEC 27001', 'NIST Privacy FW', 'IEEE 7000', 'Canada AIDA', 'US EO 14110', 'China GenAI Measures', 'UK AI Strategy', 'Japan AI Guidelines', 'Brazil Bill 2338', 'Australia Ethics', 'FDA AI/ML (Health)', 'NYC Law 144 (HR)', 'UNECE (Automotive)', 'Montreal Declaration', 'Microsoft RAI v2', 'UNESCO Ethics'];

// UPDATED: Standardized "OECD AI Principles" key to match framework list
const complianceData = [
  { id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical", lifecycle: "All Stages", description: "Systematic approach to identify, assess, and mitigate AI-related risks.", mappings: { "NIST AI RMF 1.0": ["MAP 1.1"], "ISO/IEC 42001 (AIMS)": ["Clause 8.2"], "EU AI Act (Final)": ["Article 9"], "OECD AI Principles": ["Principle 1.4"], "Singapore GenAI FW": ["Internal Governance"] }, implementation: "Maintain a living AI Risk Register with quarterly reviews." },
  { id: 2, concept: "Human Oversight (HITL)", riskTier: "High-Risk", priority: "Critical", lifecycle: "Deployment", description: "Mechanisms ensuring human intervention and control over AI decisions.", mappings: { "NIST AI RMF 1.0": ["GOVERN 2.2"], "EU AI Act (Final)": ["Article 14"], "Singapore GenAI FW": ["Human-in-the-loop"] }, implementation: "Establish oversight committee with defined intervention triggers." },
  { id: 3, concept: "Model Inventory & Registration", riskTier: "All Systems", priority: "High", lifecycle: "Design", description: "Centralized inventory of all AI models in production and development.", mappings: { "US Banking (SR 11-7)": ["Inventory Mandate"], "ISO/IEC 42001 (AIMS)": ["Clause 6.1.3"] }, implementation: "Maintain centralized GRC registry of all active models." },
  { id: 4, concept: "Data Governance & Quality", riskTier: "All Systems", priority: "High", lifecycle: "Design", description: "Controls for data acquisition, quality, bias detection, and lineage.", mappings: { "ISO/IEC 42001 (AIMS)": ["Annex A.7"], "EU AI Act (Final)": ["Article 10"], "OECD AI Principles": ["Principle 1.2"] }, implementation: "Data classified as restricted and encrypted at rest." },
  { id: 5, concept: "Effective Challenge (Validation)", riskTier: "High-Risk", priority: "Critical", lifecycle: "Development", description: "Independent validation of models by a team separate from development.", mappings: { "US Banking (SR 11-7)": ["Independent Validation"], "NIST AI RMF 1.0": ["MEASURE 2.6"] }, implementation: "Second-line-of-defense (2LOD) validation pre-deployment." },
  { id: 6, concept: "Privacy Impact Assessment", riskTier: "All Systems", priority: "Critical", lifecycle: "Design", description: "Safeguards for personal data and GDPR/State Law compliance.", mappings: { "GDPR": ["Article 35"], "ISO/IEC 42001 (AIMS)": ["Annex A.7"] }, implementation: "Conduct DPIA before processing personal data." },
  { id: 7, concept: "Explainability & Transparency", riskTier: "High-Risk", priority: "High", lifecycle: "Deployment", description: "Mechanisms to explain AI decisions to stakeholders.", mappings: { "EU AI Act (Final)": ["Article 13"], "NIST AI RMF 1.0": ["GOVERN 3.1"], "OECD AI Principles": ["Principle 1.3"] }, implementation: "Provide clear decision explanations (SHAP/LIME)." },
  { id: 8, concept: "Data Drift Detection", riskTier: "High-Risk", priority: "Critical", lifecycle: "Monitoring", description: "Monitoring for shifts in input data distribution.", mappings: { "NIST AI RMF 1.0": ["MEASURE 2.7"], "US Banking (SR 11-7)": ["Ongoing Monitoring"] }, implementation: "Automated alerts when input data diverges >5%." },
  { id: 9, concept: "Model Versioning & Rollback", riskTier: "High-Risk", priority: "High", lifecycle: "Deployment", description: "Ability to revert to previous model versions in case of failure.", mappings: { "ISO/IEC 42001 (AIMS)": ["Annex A.9.3"], "NIST AI RMF 1.0": ["MANAGE 3.3"] }, implementation: "Immutable version history with one-click rollback." },
  { id: 10, concept: "Adversarial Testing (Red Teaming)", riskTier: "High-Risk", priority: "Critical", lifecycle: "Development", description: "Testing against prompt injection and evasion attacks.", mappings: { "OWASP Top 10 LLM": ["LLM01"], "NIST AI RMF 1.0": ["MEASURE 2.5"] }, implementation: "Conduct red-teaming targeting jailbreaks." },
  { id: 11, concept: "Bias Testing & Fairness", riskTier: "High-Risk", priority: "Critical", lifecycle: "Development", description: "Assessment of algorithmic bias across protected classes.", mappings: { "NIST AI RMF 1.0": ["MEASURE 2.3"], "EU AI Act (Final)": ["Article 10(2)"], "OECD AI Principles": ["Principle 1.2"] }, implementation: "Quarterly bias testing across demographic groups." },
  { id: 12, concept: "Secure Weights Storage", riskTier: "Critical", priority: "Critical", lifecycle: "Deployment", description: "Preventing theft of proprietary model weights.", mappings: { "OWASP Top 10 LLM": ["LLM10"], "ISO/IEC 42001 (AIMS)": ["Annex A.13"] }, implementation: "Store weights in HSM or encrypted buckets." },
  { id: 13, concept: "Copyright Compliance (GenAI)", riskTier: "GenAI", priority: "High", lifecycle: "Design", description: "Ensuring training data respects IP laws.", mappings: { "EU AI Act (Final)": ["Article 53"], "ISO/IEC 42001 (AIMS)": ["Annex A.5"] }, implementation: "Maintain IP ledger of training data." },
  { id: 14, concept: "Contestability & Redress", riskTier: "High-Risk", priority: "Medium", lifecycle: "Monitoring", description: "Process for subjects to challenge automated decisions.", mappings: { "GDPR": ["Article 22"], "Singapore GenAI FW": ["Customer Relationship"] }, implementation: "Clear 'Appeal Decision' workflow." },
  { id: 15, concept: "Environmental Impact", riskTier: "All Systems", priority: "Medium", lifecycle: "Monitoring", description: "Monitoring energy consumption.", mappings: { "EU AI Act (Final)": ["Article 40"], "OECD AI Principles": ["Principle 1.1"] }, implementation: "Log compute hours and carbon emissions." },
  { id: 16, concept: "Vendor/Third-Party Risk", riskTier: "All Systems", priority: "High", lifecycle: "Design", description: "Oversight of third-party AI providers.", mappings: { "NIST AI RMF 1.0": ["MAP 1.5"], "US Banking (SR 11-7)": ["Vendor Models"] }, implementation: "Mandatory risk assessment for all 3rd party AI." },
  { id: 17, concept: "Pre-Interaction Disclosure", riskTier: "High-Risk", priority: "Critical", lifecycle: "Deployment", description: "AI must disclose non-human status.", mappings: { "NHID-Clinical": ["Rule 1.1"], "EU AI Act (Final)": ["Article 50"] }, implementation: "Audio/Text banner: 'I am an AI assistant'." },
  { id: 18, concept: "Zero-Loop Escalation", riskTier: "High-Risk", priority: "Critical", lifecycle: "Monitoring", description: "Mandatory human hand-off if unresolved.", mappings: { "NHID-Clinical": ["Rule 2.4"], "US Banking (SR 11-7)": ["Complaint Mgmt"] }, implementation: "If confidence < 90%, route to human." },
  { id: 19, concept: "The Turing Boundary", riskTier: "GenAI", priority: "High", lifecycle: "Design", description: "Prohibition of deceptive human-like mimicry.", mappings: { "NHID-Clinical": ["Rule 3.0"], "OECD AI Principles": ["Transparency"] }, implementation: "Remove synthetic 'human' artifacts." },
  // --- NEW CONTROLS TO REACH 30+ ---
  { id: 20, concept: "Data Retention Policy", riskTier: "All Systems", priority: "High", lifecycle: "Decommissioning", description: "Rules for retaining and deleting training data.", mappings: { "GDPR": ["Article 5"], "ISO/IEC 42001 (AIMS)": ["Annex A.7"] }, implementation: "Auto-delete user data after 30 days unless consented." },
  { id: 21, concept: "User Feedback Loops", riskTier: "All Systems", priority: "Medium", lifecycle: "Monitoring", description: "Mechanism for users to flag errors.", mappings: { "NIST AI RMF 1.0": ["MEASURE 2.2"], "Microsoft RAI v2": ["Reliability"] }, implementation: "Thumbs up/down feedback integrated into UI." },
  { id: 22, concept: "Emergency Stop (Kill Switch)", riskTier: "High-Risk", priority: "Critical", lifecycle: "Deployment", description: "Mechanism to instantly shut down AI.", mappings: { "EU AI Act (Final)": ["Article 14"], "ISO/IEC 42001 (AIMS)": ["Annex A.9"] }, implementation: "Hardware/Software kill switch accessible to Ops." },
  { id: 23, concept: "Technical Documentation", riskTier: "All Systems", priority: "High", lifecycle: "Development", description: "Comprehensive technical files.", mappings: { "EU AI Act (Final)": ["Article 11"], "Canada AIDA": ["Record Keeping"] }, implementation: "Maintain updated System Cards and Model Cards." },
  { id: 24, concept: "Accuracy & Robustness Testing", riskTier: "High-Risk", priority: "High", lifecycle: "Development", description: "Testing under normal and edge conditions.", mappings: { "ISO/IEC 42001 (AIMS)": ["Annex A.9"], "EU AI Act (Final)": ["Article 15"] }, implementation: "Pass rate >95% on held-out test sets." },
  { id: 25, concept: "Cybersecurity Resilience", riskTier: "Critical", priority: "Critical", lifecycle: "Deployment", description: "Defense against data poisoning and attacks.", mappings: { "NIST CSF 2.0": ["Protect"], "EU AI Act (Final)": ["Article 15"] }, implementation: "Regular penetration testing of AI infrastructure." },
  { id: 26, concept: "Children's Data Protection", riskTier: "High-Risk", priority: "Critical", lifecycle: "Design", description: "Strict safeguards for minors.", mappings: { "GDPR": ["Article 8"], "California AADC": ["Standard"] }, implementation: "Age-gating and strict data minimization for minors." },
  { id: 27, concept: "Automated Logging", riskTier: "High-Risk", priority: "High", lifecycle: "Monitoring", description: "Traceability of system functioning.", mappings: { "EU AI Act (Final)": ["Article 12"], "ISO/IEC 42001 (AIMS)": ["Clause 9.1"] }, implementation: "Immutable logs of all system inputs/outputs." },
  { id: 28, concept: "Incident Reporting System", riskTier: "All Systems", priority: "Critical", lifecycle: "Monitoring", description: "Reporting serious incidents to authorities.", mappings: { "EU AI Act (Final)": ["Article 62"], "NIST AI RMF 1.0": ["MANAGE 4.2"] }, implementation: "72-hour notification window for serious incidents." },
  { id: 29, concept: "Accessible User Interface", riskTier: "All Systems", priority: "Medium", lifecycle: "Deployment", description: "Usability for people with disabilities.", mappings: { "EU AI Act (Final)": ["Article 15"], "IEEE 7000": ["Values"] }, implementation: "WCAG 2.1 AA compliance for all AI interfaces." },
  { id: 30, concept: "Sustainable Compute", riskTier: "GenAI", priority: "Low", lifecycle: "Design", description: "Minimizing carbon footprint.", mappings: { "OECD AI Principles": ["Principle 1.1"], "ISO/IEC 42001 (AIMS)": ["Objectives"] }, implementation: "Select green energy regions for training clusters." },
  { id: 31, concept: "Workforce Training", riskTier: "All Systems", priority: "Medium", lifecycle: "Deployment", description: "Training staff on safe AI use.", mappings: { "ISO/IEC 42001 (AIMS)": ["Clause 7.2"], "NIST AI RMF 1.0": ["GOVERN 1.2"] }, implementation: "Mandatory annual AI safety training for staff." }
];

const AIGovernancePlatform = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState(['all']);
  const [selectedRiskTier, setSelectedRiskTier] = useState('all');
  const [selectedLifecycle, setSelectedLifecycle] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [controlState, setControlState] = useState({});
  const [userControls, setUserControls] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  // 1. LOAD
  useEffect(() => {
    const savedData = localStorage.getItem('ai-gov-save');
    if (savedData) setControlState(JSON.parse(savedData));
    const savedManifest = localStorage.getItem('ai-gov-manifest');
    if (savedManifest) {
      setUserControls(JSON.parse(savedManifest));
      setUploadedFile("Restored Session");
    }
  }, []);

  // 2. SAVE
  useEffect(() => {
    if (Object.keys(controlState).length > 0) localStorage.setItem('ai-gov-save', JSON.stringify(controlState));
    if (userControls.length > 0) localStorage.setItem('ai-gov-manifest', JSON.stringify(userControls));
  }, [controlState, userControls]);

  // 3. AUTO-GRADE
  useEffect(() => {
    if (userControls.length > 0) {
      const newControlState = { ...controlState };
      let hasUpdates = false;
      userControls.forEach(uploadItem => {
        const match = complianceData.find(c => c.concept === uploadItem.concept);
        if (match) {
          let score = 0;
          const status = uploadItem.status?.toLowerCase() || '';
          if (status.includes('monitoring')) score = 4;
          else if (status.includes('implemented') || status.includes('active') || status.includes('completed')) score = 3;
          else if (status.includes('assessed')) score = 2;
          if ((newControlState[match.id]?.maturity || 0) < score) {
            newControlState[match.id] = { ...newControlState[match.id], maturity: score, remediation: `Auto-verified via Engineering Manifest (${uploadItem.last_audit || 'Imported'})` };
            hasUpdates = true;
          }
        }
      });
      if (hasUpdates) setControlState(newControlState);
    }
  }, [userControls]);

  // 4. RESET
  const handleFullReset = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.removeItem('ai-gov-save');
      localStorage.removeItem('ai-gov-manifest');
      setControlState({});
      setUserControls([]);
      setUploadedFile(null);
      handleResetFilters();
    }
  };

  const updateMaturity = (id, level) => {
    setControlState(prev => ({ ...prev, [id]: { ...prev[id], maturity: level } }));
  };

  const updateRemediation = (id, text) => {
    setControlState(prev => ({ ...prev, [id]: { ...prev[id], remediation: text } }));
  };

  const getMaturity = (id) => controlState[id]?.maturity || 0;
  const getRemediation = (id) => controlState[id]?.remediation || '';

  const overallScore = useMemo(() => {
    const totalPossible = complianceData.length * 5;
    const currentTotal = Object.values(controlState).reduce((acc, curr) => acc + (curr.maturity || 0), 0);
    return Math.round((currentTotal / totalPossible) * 100);
  }, [controlState]);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0];
    complianceData.forEach(item => { counts[getMaturity(item.id)]++; });
    return counts;
  }, [controlState]);

  const handleResetFilters = () => {
    setSelectedFrameworks(['all']);
    setSelectedRiskTier('all');
    setSelectedLifecycle('all');
    setSelectedPriority('all');
    setSearchTerm('');
  };

  // MATRIX: Interactive Click Handler (Auto-Clears conflicts)
  const handleMatrixClick = (fw1, fw2) => {
    // Batch all state updates together
    setSearchTerm('');
    setSelectedRiskTier('all');
    setSelectedLifecycle('all');
    setSelectedPriority('all');
    setShowFilters(true);
    setSelectedFrameworks([fw1, fw2]);
    // Switch tab last to ensure filters are set first
    setTimeout(() => setActiveTab('map'), 0);
  };

  const exportToCSV = () => {
    const headers = ['Concept', 'Risk Tier', 'Priority', 'Maturity', 'Remediation'];
    const rows = complianceData.map(item => [item.concept, item.riskTier, item.priority, getMaturity(item.id), getRemediation(item.id)]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-governance-assessment.csv';
    a.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          setUserControls(JSON.parse(event.target.result));
          setUploadedFile(file.name);
        } catch (error) { alert('Invalid JSON file.'); }
      };
      reader.readAsText(file);
    }
  };

  const gapAnalysis = useMemo(() => {
    if (userControls.length === 0) return null;
    const implemented = userControls.map(c => c.concept ? c.concept.toLowerCase() : '');
    const gaps = complianceData.filter(item => !implemented.includes(item.concept.toLowerCase()));
    return {
      coverage: ((complianceData.length - gaps.length) / complianceData.length * 100).toFixed(0),
      implemented: complianceData.length - gaps.length,
      gaps: gaps,
      criticalGaps: gaps.filter(g => g.priority === 'Critical')
    };
  }, [userControls]);

  const filteredData = useMemo(() => {
    return complianceData.filter(item => {
      const matchesSearch = searchTerm === '' || item.concept.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
      // Intersection Logic
      const matchesFramework = selectedFrameworks.includes('all') || selectedFrameworks.every(fw => item.mappings && item.mappings[fw]);
      const matchesRisk = selectedRiskTier === 'all' || item.riskTier === selectedRiskTier;
      const matchesLifecycle = selectedLifecycle === 'all' || item.lifecycle === selectedLifecycle || item.lifecycle === 'All Stages';
      const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
      return matchesSearch && matchesFramework && matchesRisk && matchesLifecycle && matchesPriority;
    });
  }, [searchTerm, selectedFrameworks, selectedRiskTier, selectedLifecycle, selectedPriority]);

  const getPriorityColor = (p) => {
    if (p === 'Critical') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (p === 'High') return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">AI Governance Map</h1>
            <p className="text-slate-400 max-w-2xl">Unified control map including NHID-Clinical Standards.</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full xl:w-auto">
            <div className="flex-1 min-w-[140px] bg-slate-900/50 border border-white/10 p-4 rounded-xl">
               <div className="text-slate-500 text-xs font-mono mb-1 uppercase">Score</div>
               <div className="text-4xl font-bold text-white">{overallScore}%</div>
               <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full transition-all duration-1000" style={{ width: `${overallScore}%` }} />
               </div>
            </div>
            
            <div className="flex-[2] min-w-[200px] bg-slate-900/50 border border-white/10 p-4 rounded-xl hidden md:block">
              <div className="text-slate-500 text-xs font-mono uppercase mb-3">Maturity Spread</div>
              <div className="flex items-end justify-between h-10 gap-1">
                {distribution.map((count, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-end w-full h-full group">
                    <div className={`w-full mx-0.5 rounded-t-sm transition-all duration-500 ${maturityLevels[idx].color.replace('/10', '/50')}`} style={{ height: `${(count / complianceData.length) * 100}%` }} />
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-5 text-[10px] bg-black px-2 py-1 rounded border border-white/10">Lvl {idx}: {count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/80 rounded-xl border border-white/10">
          {['map', 'network', 'gap'].map((id) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`py-3 rounded-lg text-sm font-bold capitalize ${activeTab === id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
              {id === 'network' ? 'Cross-Walk' : id === 'gap' ? 'Gap Analysis' : 'Control Map'}
            </button>
          ))}
        </div>

        {/* TAB: MAP */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="flex gap-2">
                <div className="relative flex-1 bg-slate-900 border border-white/10 rounded-lg p-1">
                    <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                    <input type="text" placeholder="Filter controls..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent pl-12 pr-4 py-3 outline-none" />
                </div>
                {/* RESET BUTTON */}
                <button onClick={handleFullReset} className="px-4 rounded-lg border bg-slate-900 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 flex items-center gap-2">
                   <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button onClick={() => setShowFilters(!showFilters)} className="px-4 rounded-lg border bg-slate-900 border-white/10 text-slate-400">Filters</button>
                <button onClick={exportToCSV} className="px-4 rounded-lg border bg-slate-900 border-white/10 text-slate-400 hover:text-white"><Download className="w-4 h-4"/></button>
            </div>

            {showFilters && (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-900/50 border border-white/10 rounded-xl relative z-20">
                  <div className="md:col-span-1">
                     <label className="text-xs text-slate-500 uppercase font-bold">Frameworks</label>
                     {selectedFrameworks.length > 1 ? (
                        <div className="flex items-center gap-2 bg-slate-950 border border-indigo-500/50 rounded p-2 text-sm text-indigo-300 cursor-default">
                           <Network className="w-4 h-4" />
                           <span>Intersection Mode</span>
                           <button onClick={() => setSelectedFrameworks(['all'])} className="ml-auto hover:text-white"><X className="w-3 h-3"/></button>
                        </div>
                     ) : (
                        <select value={selectedFrameworks[0]} onChange={(e) => setSelectedFrameworks([e.target.value])} className="w-full bg-slate-950 border border-white/10 rounded p-2 text-sm text-slate-300 mt-1 cursor-pointer hover:border-cyan-500/30 focus:border-cyan-500">
                            <option value="all">All Frameworks</option>
                            {frameworks.map(fw => <option key={fw} value={fw}>{fw}</option>)}
                        </select>
                     )}
                  </div>
                  <div>
                      <label className="text-xs text-slate-500 uppercase font-bold">Risk Tier</label>
                      <select value={selectedRiskTier} onChange={(e) => setSelectedRiskTier(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded p-2 text-sm mt-1 text-slate-300 cursor-pointer hover:border-cyan-500/30">
                          <option value="all">All Tiers</option>
                          <option value="High-Risk">High-Risk Only</option>
                          <option value="GenAI">GenAI Only</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs text-slate-500 uppercase font-bold">Lifecycle</label>
                      <select value={selectedLifecycle} onChange={(e) => setSelectedLifecycle(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded p-2 text-sm mt-1 text-slate-300 cursor-pointer hover:border-cyan-500/30">
                          <option value="all">All Stages</option>
                          {lifecycleStages.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <button onClick={handleResetFilters} className="text-xs text-cyan-400 hover:underline flex items-center gap-1"><X className="w-3 h-3"/> Reset Filters</button>
                  </div>
               </div>
            )}

            <div className="grid gap-3">
              {filteredData.length === 0 ? <div className="text-center p-8 text-slate-500">No controls match this filter combination.</div> : filteredData.map((item) => {
                const currentMat = getMaturity(item.id);
                const matStyle = maturityLevels[currentMat];
                const isNHID = item.mappings && item.mappings["NHID-Clinical"];
                return (
                <div key={item.id} className={`group bg-slate-900/40 border ${expandedRows.has(item.id) ? 'border-cyan-500/30' : isNHID ? 'border-indigo-500/30' : 'border-white/5'} rounded-xl overflow-hidden`}>
                  <div onClick={() => {
                        const newSet = new Set(expandedRows);
                        newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
                        setExpandedRows(newSet);
                      }} className="p-5 cursor-pointer flex gap-5 items-center">
                    <div className={`w-1 h-12 rounded-full ${matStyle.color.replace('/10', '')}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-100 truncate group-hover:text-cyan-400 transition-colors">
                           {item.concept}
                           {isNHID && <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">NHID</span>}
                        </h3>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getPriorityColor(item.priority)}`}>{item.priority}</span>
                      </div>
                      <p className="text-sm text-slate-400 truncate">{item.description}</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform ${expandedRows.has(item.id) ? 'rotate-180' : ''}`} />
                  </div>

                  {expandedRows.has(item.id) && (
                    <div className="border-t border-white/5 bg-slate-950/50 p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                           <div className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Assessment: {matStyle.label}</div>
                           <div className="grid grid-cols-6 gap-2 mb-6">
                              {maturityLevels.map((lvl) => (
                                <button key={lvl.level} onClick={() => updateMaturity(item.id, lvl.level)} className={`h-10 rounded border text-sm font-bold transition-all ${currentMat === lvl.level ? `${lvl.color} ${lvl.border} ${lvl.text}` : 'bg-slate-900 border-white/5 text-slate-600 hover:bg-slate-800'}`}>{lvl.level}</button>
                              ))}
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><FileText className="w-4 h-4" /> Remediation</label>
                              <textarea value={getRemediation(item.id)} onChange={(e) => updateRemediation(item.id, e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-sm text-slate-200 outline-none h-24 placeholder:text-slate-600" placeholder="Describe gaps or paste Jira links..." />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div>
                              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Framework Mappings</div>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(item.mappings).map(([fw, codes]) => (
                                  <div key={fw} className={`px-2 py-1 border rounded text-xs transition-colors cursor-help group/tip relative ${fw.includes('NHID') ? 'bg-indigo-900/30 border-indigo-500/30 text-indigo-300' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30'}`}>
                                     {fw}
                                     <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tip:block bg-black border border-white/10 p-2 rounded text-[10px] w-max z-50">{codes.join(', ')}</div>
                                  </div>
                                ))}
                              </div>
                           </div>
                           <div>
                              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Implementation</div>
                              <p className="text-sm text-slate-400 border-l-2 border-cyan-500/20 pl-3 leading-relaxed">{item.implementation}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          </div>
        )}

        {/* TAB: NETWORK (The Matrix) */}
        {activeTab === 'network' && (
           <div className="bg-slate-900/60 p-6 rounded-xl border border-white/10 overflow-x-auto">
              <h3 className="text-lg font-bold text-white mb-6">Cross-Walk Matrix (Interactive)</h3>
              <p className="text-sm text-slate-400 mb-4">Click any number to filter for controls shared by both frameworks.</p>
              <div className="grid gap-2 min-w-[600px]">
                <div className="flex gap-2 mb-2">
                   <div className="w-32"></div>
                   {frameworks.slice(0, 6).map(fw => (
                      <div key={fw} className="w-24 text-[10px] font-bold text-slate-500 uppercase text-center">{fw.split(' ')[0]}</div>
                   ))}
                </div>
                {frameworks.slice(0, 6).map((fw1, i) => (
                  <div key={fw1} className="flex items-center gap-2">
                    <div className="w-32 text-[10px] font-bold text-slate-400 uppercase text-right pr-4 truncate">{fw1}</div>
                    {frameworks.slice(0, 6).map((fw2, j) => {
                      const overlap = complianceData.filter(item => item.mappings?.[fw1] && item.mappings?.[fw2]).length;
                      const isSelf = i === j;
                      return (
                        <button 
                          key={`${fw1}-${fw2}`} 
                          disabled={isSelf || overlap === 0}
                          onClick={() => handleMatrixClick(fw1, fw2)}
                          className={`w-24 h-10 rounded border flex items-center justify-center text-xs font-mono transition-all duration-200
                            ${isSelf ? 'bg-slate-900 text-slate-700 border-white/5' : 
                              overlap === 0 ? 'bg-slate-900/50 text-slate-600 border-white/5 cursor-not-allowed' :
                              'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/30 hover:border-cyan-400 cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                            }`}
                        >
                          {isSelf ? '-' : overlap}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* TAB: GAP */}
        {activeTab === 'gap' && (
           <div className="space-y-6">
              <div className="bg-slate-900/40 border border-dashed border-white/20 rounded-xl p-12 text-center group hover:border-cyan-500/30 transition-colors">
                <Upload className="w-10 h-10 text-slate-500 mx-auto mb-4 group-hover:text-cyan-400 transition-colors" />
                <h3 className="text-xl font-bold text-white mb-2">Gap Analysis</h3>
                <label className="inline-block cursor-pointer">
                  <span className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold inline-flex items-center gap-2">Select JSON Manifest</span>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                </label>
                {uploadedFile && <div className="mt-4 text-emerald-400 text-sm flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4"/> {uploadedFile}</div>}
              </div>

              {gapAnalysis && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-slate-900/60 p-6 rounded-xl border border-white/10">
                        <div className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-2">Coverage</div>
                        <div className="text-4xl font-bold text-white">{gapAnalysis.coverage}%</div>
                     </div>
                     <div className="bg-slate-900/60 p-6 rounded-xl border border-purple-500/30">
                        <div className="text-purple-400 text-xs font-mono uppercase tracking-wider mb-2">Critical Gaps</div>
                        <div className="text-4xl font-bold text-white">{gapAnalysis.criticalGaps.length}</div>
                     </div>
                  </div>

                  {gapAnalysis.gaps.length > 0 && (
                    <div className="bg-slate-900/60 p-6 rounded-xl border border-white/10">
                      <h4 className="text-lg font-bold text-white mb-4">Missing Controls (Gap Report)</h4>
                      <div className="space-y-3">
                        {gapAnalysis.gaps.map(gap => (
                          <div key={gap.id} className="bg-slate-950/50 p-4 rounded-lg border border-white/5 flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-slate-200">{gap.concept}</h5>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getPriorityColor(gap.priority)}`}>{gap.priority}</span>
                              </div>
                              <p className="text-sm text-slate-400">{gap.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

export default AIGovernancePlatform;
