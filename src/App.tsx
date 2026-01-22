import React, { useState, useMemo, useEffect } from 'react';
import { 
  Map, Search, Filter, ChevronDown, CheckCircle, Shield, Activity, Zap, 
  TrendingUp, Clock, FileText, Printer, Lock, AlertTriangle, Globe, 
  Network, BarChart3, Upload, Save, ArrowRight, Download, X, AlertCircle 
} from 'lucide-react';

const AIGovernancePlatform = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [selectedRiskTier, setSelectedRiskTier] = useState('all');
  const [selectedLifecycle, setSelectedLifecycle] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [controlState, setControlState] = useState({});
  const [userControls, setUserControls] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

    // 1. Load data from browser memory (Now loads BOTH Text and Uploads)
  useEffect(() => {
    // Load your typed text
    const savedData = localStorage.getItem('ai-gov-save');
    if (savedData) {
      setControlState(JSON.parse(savedData));
    }
    
    // NEW: Load your uploaded JSON file
    const savedManifest = localStorage.getItem('ai-gov-manifest');
    if (savedManifest) {
      setUserControls(JSON.parse(savedManifest));
      setUploadedFile("Restored Session"); // Shows this label so you know it loaded
    }
  }, []);

  // 2. Auto-save data (Now saves BOTH Text and Uploads)
  useEffect(() => {
    // Save text
    if (Object.keys(controlState).length > 0) {
      localStorage.setItem('ai-gov-save', JSON.stringify(controlState));
    }
    // NEW: Save uploaded JSON
    if (userControls.length > 0) {
      localStorage.setItem('ai-gov-manifest', JSON.stringify(userControls));
    }
  }, [controlState, userControls]);
  // 3. AUTO-GRADER: When a file is uploaded, automatically update the scores!
  useEffect(() => {
    if (userControls.length > 0) {
      const newControlState = { ...controlState };
      let hasUpdates = false;

      userControls.forEach(uploadItem => {
        // Find the matching control in our master list by name
        const match = complianceData.find(c => c.concept === uploadItem.concept);
        
        if (match) {
          // Determine score based on Engineering Status keywords
          let score = 0;
          const status = uploadItem.status?.toLowerCase() || '';
          
          if (status.includes('monitoring')) score = 4;      // Level 4: Measured
          else if (status.includes('implemented') || status.includes('active') || status.includes('completed')) score = 3; // Level 3: Defined
          else if (status.includes('assessed')) score = 2;   // Level 2: Managed
          
          // Apply the score if it's new
          if ((newControlState[match.id]?.maturity || 0) < score) {
            newControlState[match.id] = { 
              ...newControlState[match.id], 
              maturity: score,
              remediation: `Auto-verified via Engineering Manifest (${uploadItem.last_audit || 'Imported'})` 
            };
            hasUpdates = true;
          }
        }
      });

      if (hasUpdates) {
        setControlState(newControlState);
      }
    }
  }, [userControls]);


  // --- MASTER FRAMEWORK LIST ---
  const frameworks = [
    'NIST AI RMF 1.0', 'ISO/IEC 42001 (AIMS)', 'EU AI Act (Final)', 'OECD AI Principles', 'Singapore GenAI FW', 
    'OWASP Top 10 LLM', 'MITRE ATLAS', 'NIST CSF 2.0', 'Google SAIF', 'CSA AI Safety',
    'GDPR', 'CCPA / CPRA', 'ISO/IEC 27001', 'NIST Privacy FW', 'IEEE 7000',
    'Canada AIDA', 'US EO 14110', 'China GenAI Measures', 'UK AI Strategy', 'Japan AI Guidelines', 'Brazil Bill 2338', 'Australia Ethics',
    'US Banking (SR 11-7)', 'FDA AI/ML (Health)', 'NYC Law 144 (HR)', 'UNECE (Automotive)',
    'NHID-Clinical', 'Montreal Declaration', 'Microsoft RAI v2', 'UNESCO Ethics'
  ];
  
  const lifecycleStages = ['All Stages', 'Design', 'Development', 'Deployment', 'Monitoring', 'Decommissioning'];

  const maturityLevels = [
    { level: 0, label: 'Non-Existent', color: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-500' },
    { level: 1, label: 'Initial', color: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400' },
    { level: 2, label: 'Managed', color: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400' },
    { level: 3, label: 'Defined', color: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400' },
    { level: 4, label: 'Measured', color: 'bg-cyan-500/10', border: 'border-cyan-500/50', text: 'text-cyan-400' },
    { level: 5, label: 'Optimized', color: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400' }
  ];

  const complianceData = [
    { id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical", lifecycle: "All Stages", description: "Systematic approach to identify, assess, and mitigate AI-related risks.", mappings: { "NIST AI RMF 1.0": ["MAP 1.1"], "ISO/IEC 42001 (AIMS)": ["Clause 8.2"], "EU AI Act (Final)": ["Article 9"], "OECD Principles": ["Principle 1.4"], "Singapore GenAI FW": ["Internal Governance"] }, implementation: "Maintain a living AI Risk Register with quarterly reviews and executive oversight." },
    { id: 2, concept: "Human Oversight (HITL)", riskTier: "High-Risk", priority: "Critical", lifecycle: "Deployment", description: "Mechanisms ensuring human intervention and control over AI decisions.", mappings: { "NIST AI RMF 1.0": ["GOVERN 2.2"], "EU AI Act (Final)": ["Article 14"], "Canada AIDA": ["Section 12"], "Singapore GenAI FW": ["Human-in-the-loop"] }, implementation: "Establish oversight committee with defined intervention triggers and escalation procedures." },
    { id: 3, concept: "Model Inventory & Registration", riskTier: "All Systems", priority: "High", lifecycle: "Design", description: "Centralized inventory of all AI models in production and development.", mappings: { "US Banking (SR 11-7)": ["Inventory Mandate"], "ISO/IEC 42001 (AIMS)": ["Clause 6.1.3"], "EU AI Act (Final)": ["Article 49 (Database)"] }, implementation: "Maintain centralized GRC registry of all active models, owners, and risk ratings." },
    { id: 4, concept: "Data Governance & Quality", riskTier: "All Systems", priority: "High", lifecycle: "Design", description: "Controls for data acquisition, quality, bias detection, and lineage.", mappings: { "ISO/IEC 42001 (AIMS)": ["Annex A.7"], "EU AI Act (Final)": ["Article 10"], "OECD Principles": ["Principle 1.2"] }, implementation: "Data classified as restricted and encrypted at rest and in transit." },
    { id: 5, concept: "Effective Challenge (Validation)", riskTier: "High-Risk", priority: "Critical", lifecycle: "Development", description: "Independent validation of models by a team separate from development.", mappings: { "US Banking (SR 11-7)": ["Independent Validation"], "NIST AI RMF 1.0": ["MEASURE 2.6"] }, implementation: "Second-line-of-defense (2LOD) must validate models pre-deployment." },
    { id: 6, concept: "Privacy Impact Assessment", riskTier: "All Systems", priority: "Critical", lifecycle: "Design", description: "Safeguards for personal data and GDPR/State Law compliance.", mappings: { "GDPR": ["Article 35"], "ISO/IEC 42001 (AIMS)": ["Annex A.7"], "Canada AIDA": ["Anonymization"] }, implementation: "Conduct DPIA before processing personal data with AI systems." },
    { id: 7, concept: "Explainability & Transparency", riskTier: "High-Risk", priority: "High", lifecycle: "Deployment", description: "Mechanisms to explain AI decisions to stakeholders and affected parties.", mappings: { "EU AI Act (Final)": ["Article 13"], "NIST AI RMF 1.0": ["GOVERN 3.1"], "OECD Principles": ["Principle 1.3"], "Singapore GenAI FW": ["Operations Management"] }, implementation: "Provide clear decision explanations (SHAP/LIME) to affected users." },
    { id: 8, concept: "Data Drift Detection", riskTier: "High-Risk", priority: "Critical", lifecycle: "Monitoring", description: "Monitoring for shifts in input data distribution affecting model accuracy.", mappings: { "NIST AI RMF 1.0": ["MEASURE 2.7"], "ISO/IEC 42001 (AIMS)": ["Annex A.9.2"], "US Banking (SR 11-7)": ["Ongoing Monitoring"] }, implementation: "Automated alerts when input data distribution diverges >5% from baseline." },
    { id: 9, concept: "Model Versioning & Rollback", riskTier: "High-Risk", priority: "High", lifecycle: "Deployment", description: "Ability to revert to previous model versions in case of failure.", mappings: { "ISO/IEC 42001 (AIMS)": ["Annex A.9.3"], "NIST AI RMF 1.0": ["MANAGE 3.3"] }, implementation: "Immutable version history of all models with one-click rollback capability." },
    { id: 10, concept: "Adversarial Testing (Red Teaming)", riskTier: "High-Risk", priority: "Critical", lifecycle: "Development", description: "Testing against prompt injection, jailbreaking, and evasion attacks.", mappings: { "OWASP Top 10 LLM": ["LLM01", "LLM07"], "NIST AI RMF 1.0": ["MEASURE 2.5"], "Canada AIDA": ["Harm Mitigation"] }, implementation: "Conduct red-teaming exercises specifically targeting LLM jailbreaks." },
    { id: 11, concept: "Bias Testing & Fairness", riskTier: "High-Risk", priority: "Critical", lifecycle: "Development", description: "Assessment of algorithmic bias across protected classes.", mappings: { "NIST AI RMF 1.0": ["MEASURE 2.3"], "EU AI Act (Final)": ["Article 10(2)"], "Canada AIDA": ["Biased Output"], "OECD Principles": ["Principle 1.2"] }, implementation: "Quarterly bias testing across demographic groups with independent validation." },
    { id: 12, concept: "Secure Weights Storage", riskTier: "Critical", priority: "Critical", lifecycle: "Deployment", description: "Preventing theft or unauthorized copying of proprietary model weights.", mappings: { "OWASP Top 10 LLM": ["LLM10"], "ISO/IEC 42001 (AIMS)": ["Annex A.13"] }, implementation: "Store model weights in Hardware Security Modules (HSM) or encrypted buckets." },
    { id: 13, concept: "Copyright Compliance (GenAI)", riskTier: "GenAI", priority: "High", lifecycle: "Design", description: "Ensuring training data respects IP laws and transparency.", mappings: { "EU AI Act (Final)": ["Article 53"], "ISO/IEC 42001 (AIMS)": ["Annex A.5"] }, implementation: "Maintain IP ledger of training data and publish summaries per EU AI Act." },
    { id: 14, concept: "Contestability & Redress", riskTier: "High-Risk", priority: "Medium", lifecycle: "Monitoring", description: "Process for subjects to challenge automated decisions.", mappings: { "GDPR": ["Article 22"], "Canada AIDA": ["Plain Language"], "Singapore GenAI FW": ["Customer Relationship"] }, implementation: "Clear 'Appeal Decision' workflow for end-users affected by AI." },
    { id: 15, concept: "Environmental Impact", riskTier: "All Systems", priority: "Medium", lifecycle: "Monitoring", description: "Monitoring energy consumption and carbon footprint.", mappings: { "EU AI Act (Final)": ["Article 40"], "OECD Principles": ["Principle 1.1"] }, implementation: "Log compute hours and estimate carbon emissions for training/inference." },
    { id: 16, concept: "Vendor/Third-Party Risk", riskTier: "All Systems", priority: "High", lifecycle: "Design", description: "Oversight of third-party AI providers and components.", mappings: { "NIST AI RMF 1.0": ["MAP 1.5"], "US Banking (SR 11-7)": ["Vendor Models"], "ISO/IEC 42001 (AIMS)": ["Clause 8.4"] }, implementation: "Mandatory risk assessment for all 3rd party AI tools before procurement." },
    { id: 17, concept: "Pre-Interaction Disclosure", riskTier: "High-Risk", priority: "Critical", lifecycle: "Deployment", description: "AI must disclose non-human status BEFORE user data is collected.", mappings: { "NHID-Clinical": ["Rule 1.1"], "EU AI Act (Final)": ["Article 50"] }, implementation: "Audio/Text banner: 'I am an AI assistant' must play before prompt." },
    { id: 18, concept: "Zero-Loop Escalation", riskTier: "High-Risk", priority: "Critical", lifecycle: "Monitoring", description: "Mandatory human hand-off if user intent is unresolved after 1 turn.", mappings: { "NHID-Clinical": ["Rule 2.4"], "US Banking (SR 11-7)": ["Complaint Mgmt"] }, implementation: "If confidence < 90% or user repeats query, route to human immediately." },
    { id: 19, concept: "The Turing Boundary", riskTier: "GenAI", priority: "High", lifecycle: "Design", description: "Prohibition of deceptive human-like mimicry (fake breathing, typing sounds).", mappings: { "NHID-Clinical": ["Rule 3.0"], "OECD Principles": ["Transparency"] }, implementation: "Remove synthetic 'human' artifacts from voice/text generation." }
  ];

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
    complianceData.forEach(item => {
      const level = getMaturity(item.id);
      counts[level]++;
    });
    return counts;
  }, [controlState]);

  const handleResetFilters = () => {
    setSelectedFramework('all');
    setSelectedRiskTier('all');
    setSelectedLifecycle('all');
    setSelectedPriority('all');
    setSearchTerm('');
  };

  const exportToCSV = () => {
    const headers = ['Concept', 'Risk Tier', 'Priority', 'Maturity', 'Remediation'];
    const rows = complianceData.map(item => [
      item.concept, item.riskTier, item.priority, getMaturity(item.id), getRemediation(item.id)
    ]);
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
      const matchesFramework = selectedFramework === 'all' || (item.mappings && item.mappings[selectedFramework]);
      const matchesRisk = selectedRiskTier === 'all' || item.riskTier === selectedRiskTier;
      const matchesLifecycle = selectedLifecycle === 'all' || item.lifecycle === selectedLifecycle || item.lifecycle === 'All Stages';
      const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
      return matchesSearch && matchesFramework && matchesRisk && matchesLifecycle && matchesPriority;
    });
  }, [searchTerm, selectedFramework, selectedRiskTier, selectedLifecycle, selectedPriority]);

  const getPriorityColor = (p) => {
    if (p === 'Critical') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (p === 'High') return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  };

  const handleMatrixClick = (fw1, fw2) => {
    setActiveTab('network');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 border-b border-white/5 pb-8">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
                <Globe className="w-3 h-3" /> Global Governance 2.0
             </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              AI Governance <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Map</span>
            </h1>
            <p className="text-slate-400 max-w-2xl">
               Unified control map covering <span className="text-cyan-400">NIST, ISO 42001, EU AI Act</span>, plus <span className="text-indigo-400">NHID-Clinical Standards</span> & <span className="text-emerald-400">US Banking</span>.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full xl:w-auto">
            <div className="flex-1 min-w-[140px] bg-slate-900/50 border border-white/10 p-4 rounded-xl">
               <div className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">Score</div>
               <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-white">{overallScore}%</span>
                  <Activity className="w-5 h-5 text-cyan-400 mb-2" />
               </div>
               <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full transition-all duration-1000" style={{ width: `${overallScore}%` }} />
               </div>
            </div>
            {/* KPI: Distribution */}
            <div className="flex-[2] min-w-[200px] bg-slate-900/50 border border-white/10 p-4 rounded-xl hidden md:block">
              <div className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-3">Maturity Spread</div>
              <div className="flex items-end justify-between h-10 gap-1">
                {distribution.map((count, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-end w-full h-full group">
                    <div className={`w-full mx-0.5 rounded-t-sm transition-all duration-500 ${maturityLevels[idx].color.replace('/10', '/50')}`} style={{ height: `${Math.max(15, (count / complianceData.length) * 100)}%` }} />
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-5 text-[10px] bg-black px-2 py-1 rounded border border-white/10">Lvl {idx}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/80 rounded-xl border border-white/10">
          {[
            { id: 'map', icon: Map, label: 'Control Map' },
            { id: 'network', icon: Network, label: 'Cross-Walk Matrix' },
            { id: 'gap', icon: BarChart3, label: 'Gap Analysis' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB: MAP */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="flex gap-2">
                <div className="relative flex-1 bg-slate-900 border border-white/10 rounded-lg p-1">
                    <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                    <input type="text" placeholder="Filter controls..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent border-none text-slate-200 focus:ring-0 pl-12 pr-4 py-3 outline-none" />
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className={`px-4 rounded-lg border flex items-center gap-2 ${showFilters ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-slate-900 border-white/10 text-slate-400'}`}><Filter className="w-4 h-4"/> Filters</button>
                <button onClick={exportToCSV} className="px-4 rounded-lg border bg-slate-900 border-white/10 text-slate-400 hover:text-white"><Download className="w-4 h-4"/></button>
            </div>

            {showFilters && (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-900/50 border border-white/10 rounded-xl relative z-20">
                  <div className="md:col-span-1">
                     <label className="text-xs text-slate-500 uppercase font-bold">Frameworks</label>
                     <select value={selectedFramework} onChange={(e) => setSelectedFramework(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded p-2 text-sm text-slate-300 mt-1 cursor-pointer hover:border-cyan-500/30 focus:border-cyan-500">
                        <option value="all">All Frameworks</option>
                        {frameworks.map(fw => <option key={fw} value={fw}>{fw}</option>)}
                     </select>
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
              {filteredData.map((item) => {
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

        {/* TAB: NETWORK */}
        {activeTab === 'network' && (
           <div className="bg-slate-900/60 p-6 rounded-xl border border-white/10 overflow-x-auto">
              <h3 className="text-lg font-bold text-white mb-6">Framework Matrix</h3>
              <div className="grid gap-2 min-w-[600px]">
                <div className="flex gap-2 mb-2">
                   <div className="w-32"></div>
                   {frameworks.slice(0, 5).map(fw => (
                      <div key={fw} className="w-24 text-[10px] font-bold text-slate-500 uppercase text-center">{fw.split(' ')[0]}</div>
                   ))}
                </div>
                {frameworks.slice(0, 5).map((fw1, i) => (
                  <div key={fw1} className="flex items-center gap-2">
                    <div className="w-32 text-[10px] font-bold text-slate-400 uppercase text-right pr-4">{fw1}</div>
                    {frameworks.slice(0, 5).map((fw2, j) => {
                      const overlap = complianceData.filter(item => item.mappings?.[fw1] && item.mappings?.[fw2]).length;
                      const isSelf = i === j;
                      return (
                        <div key={`${fw1}-${fw2}`} className={`w-24 h-10 rounded border flex items-center justify-center text-xs font-mono ${isSelf ? 'bg-slate-900 text-slate-700 border-white/5' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20 cursor-pointer'}`}>
                          {isSelf ? '-' : overlap}
                        </div>
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

              {/* THIS WAS MISSING BEFORE - NOW IT IS HERE */}
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
