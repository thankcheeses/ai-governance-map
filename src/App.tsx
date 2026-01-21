import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, CheckCircle, Shield, Activity, Zap, TrendingUp, Clock, FileText, Printer, Lock, AlertTriangle, Cpu, Globe } from 'lucide-react';

const AIGovernancePlatform = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState(['all']);
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  // STATE FOR MATURITY & REMEDIATION
  const [controlState, setControlState] = useState({}); 

  const frameworks = ['NIST AI RMF', 'ISO/IEC 42001', 'EU AI Act', 'OWASP Top 10', 'US State Laws', 'HIPAA/Healthcare', 'GDPR'];
  
  // CUSTOM UI: Maturity Levels with "Glow" colors
  const maturityLevels = [
    { level: 0, label: 'Non-Existent', color: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-500' },
    { level: 1, label: 'Initial', color: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-[0_0_10px_rgba(239,68,68,0.2)]' },
    { level: 2, label: 'Managed', color: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-[0_0_10px_rgba(249,115,22,0.2)]' },
    { level: 3, label: 'Defined', color: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400', glow: 'shadow-[0_0_10px_rgba(234,179,8,0.2)]' },
    { level: 4, label: 'Measured', color: 'bg-cyan-500/10', border: 'border-cyan-500/50', text: 'text-cyan-400', glow: 'shadow-[0_0_10px_rgba(6,182,212,0.2)]' },
    { level: 5, label: 'Optimized', color: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]' }
  ];

  // DATA (Your 30+ Controls Logic - Preserved)
  const complianceData = [
    { id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical", description: "Systematic approach to identify, assess, and mitigate AI-related risks.", mappings: { "NIST AI RMF": ["MAP 1.1"], "ISO/IEC 42001": ["Clause 8.2"], "EU AI Act": ["Article 9"] }, implementation: "Maintain a living AI Risk Register with quarterly reviews." },
    { id: 2, concept: "Human Oversight (HITL)", riskTier: "High-Risk", priority: "Critical", description: "Mechanisms ensuring human intervention and control over AI decisions.", mappings: { "NIST AI RMF": ["GOVERN 2.2"], "EU AI Act": ["Article 14"] }, implementation: "Establish oversight committee with defined intervention triggers." },
    { id: 3, concept: "Vendor/Supply Chain Mgmt", riskTier: "All Systems", priority: "High", description: "Oversight of third-party AI providers and components.", mappings: { "NIST AI RMF": ["MAP 1.5"], "ISO/IEC 42001": ["Clause 8.4"] }, implementation: "Vendor risk assessment process with annual re-certification." },
    { id: 4, concept: "Data Governance & Quality", riskTier: "All Systems", priority: "High", description: "Controls for data acquisition, quality, bias detection, and lineage.", mappings: { "ISO/IEC 42001": ["Annex A.7"], "EU AI Act": ["Article 10"] }, implementation: "Data classified as restricted and encrypted at rest/transit." },
    { id: 5, concept: "Privacy Impact Assessment", riskTier: "All Systems", priority: "Critical", description: "Safeguards for personal data and GDPR/State Law compliance.", mappings: { "GDPR": ["Article 35"], "ISO/IEC 42001": ["Annex A.7"] }, implementation: "Conduct DPIA before processing personal data." },
    { id: 6, concept: "Data Sovereignty", riskTier: "High-Risk", priority: "High", description: "Ensuring data processing remains within approved legal jurisdictions.", mappings: { "GDPR": ["Chapter V"], "EU AI Act": ["Article 10"] }, implementation: "Restrict training data flows to approved geo-locations." },
    { id: 7, concept: "Model Documentation", riskTier: "All Systems", priority: "High", description: "Comprehensive documentation of model architecture and training.", mappings: { "NIST AI RMF": ["MAP 3.4"], "EU AI Act": ["Article 11"] }, implementation: "Create model cards documenting training data and limitations." },
    { id: 8, concept: "Data Drift Detection", riskTier: "High-Risk", priority: "Critical", description: "Monitoring for shifts in input data distribution.", mappings: { "NIST AI RMF": ["MEASURE 2.7"] }, implementation: "Automated alerts when input data diverges >5% from baseline." },
    { id: 9, concept: "Model Versioning", riskTier: "High-Risk", priority: "High", description: "Ability to revert to previous model versions in case of failure.", mappings: { "ISO/IEC 42001": ["Annex A.9.3"] }, implementation: "Immutable version history with one-click rollback." },
    { id: 10, concept: "Adversarial Testing", riskTier: "High-Risk", priority: "Critical", description: "Testing against prompt injection and evasion attacks.", mappings: { "OWASP Top 10": ["LLM01"], "NIST AI RMF": ["MEASURE 2.5"] }, implementation: "Red-teaming exercises targeting prompt injection." },
    { id: 11, concept: "Data Poisoning Defense", riskTier: "High-Risk", priority: "High", description: "Protecting training data integrity from manipulation.", mappings: { "OWASP Top 10": ["LLM03"] }, implementation: "Cryptographically sign training datasets." },
    { id: 12, concept: "Secure Weights Storage", riskTier: "Critical", priority: "Critical", description: "Preventing theft of proprietary model weights.", mappings: { "OWASP Top 10": ["LLM10"] }, implementation: "Store model weights in HSM or encrypted buckets." },
    { id: 13, concept: "Bias Testing", riskTier: "High-Risk", priority: "Critical", description: "Assessment of algorithmic bias across protected classes.", mappings: { "NIST AI RMF": ["MEASURE 2.3"], "EU AI Act": ["Article 10(2)"] }, implementation: "Quarterly bias testing with independent validation." },
    { id: 14, concept: "Environmental Impact", riskTier: "All Systems", priority: "Medium", description: "Monitoring energy consumption and carbon footprint.", mappings: { "EU AI Act": ["Article 40"] }, implementation: "Log compute hours and estimate carbon emissions." },
    { id: 15, concept: "Copyright Compliance", riskTier: "GenAI", priority: "High", description: "Ensuring training data respects IP laws.", mappings: { "EU AI Act": ["Article 53"] }, implementation: "Maintain IP ledger of training data." },
    { id: 16, concept: "Explainability", riskTier: "High-Risk", priority: "High", description: "Mechanisms to explain AI decisions to stakeholders.", mappings: { "EU AI Act": ["Article 13"], "NIST AI RMF": ["GOVERN 3.1"] }, implementation: "Provide clear decision explanations to users." },
    { id: 17, concept: "Incident Response", riskTier: "High-Risk", priority: "Critical", description: "Processes for responding to AI failures.", mappings: { "ISO/IEC 42001": ["Clause 10.1"] }, implementation: "24/7 incident response with escalation procedures." },
    { id: 18, concept: "EU Database Reg.", riskTier: "High-Risk", priority: "High", description: "Registration of high-risk systems in EU Database.", mappings: { "EU AI Act": ["Article 49"] }, implementation: "Register model in EU central database." }
  ];

  // MATURITY LOGIC
  const updateMaturity = (id, level) => {
    setControlState(prev => ({
      ...prev,
      [id]: { ...prev[id], maturity: level }
    }));
  };

  const updateRemediation = (id, text) => {
    setControlState(prev => ({
      ...prev,
      [id]: { ...prev[id], remediation: text }
    }));
  };

  const getMaturity = (id) => controlState[id]?.maturity || 0;
  const getRemediation = (id) => controlState[id]?.remediation || '';

  // SCORE CALCULATION
  const overallScore = useMemo(() => {
    const totalPossible = complianceData.length * 5;
    const currentTotal = Object.values(controlState).reduce((acc, curr) => acc + (curr.maturity || 0), 0);
    return Math.round((currentTotal / totalPossible) * 100);
  }, [controlState]);

  // DISTRIBUTION CHART DATA
  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0];
    complianceData.forEach(item => {
      const level = getMaturity(item.id);
      counts[level]++;
    });
    return counts;
  }, [controlState]);

  const filteredData = useMemo(() => {
    return complianceData.filter(item => {
      const matchesSearch = searchTerm === '' || item.concept.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFramework = selectedFrameworks.includes('all') || selectedFrameworks.every(fw => item.mappings[fw]);
      return matchesSearch && matchesFramework;
    });
  }, [searchTerm, selectedFrameworks]);

  return (
    // UI HACK: The "Cyber Pattern" background
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Grid Mesh */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        
        {/* TOP BAR: Header & KPI Cards */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 border-b border-white/5 pb-8">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
                <Globe className="w-3 h-3" /> Enterprise Governance
             </div>
            <h1 className="text-5xl font-bold text-white tracking-tight">
              AI Governance <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Map</span>
            </h1>
            <p className="text-slate-400 font-light text-lg max-w-2xl">
              Unified control framework mapping NIST AI RMF, ISO 42001, and EU AI Act into actionable maturity gates.
            </p>
          </div>
          
          {/* THE HUD (Heads Up Display) */}
          <div className="flex flex-wrap gap-4 w-full xl:w-auto">
            {/* KPI 1: Score */}
            <div className="flex-1 min-w-[140px] bg-slate-900/50 backdrop-blur-md border border-white/10 p-4 rounded-xl relative group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">Compliance Score</div>
               <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-white">{overallScore}%</span>
                  <Activity className="w-5 h-5 text-cyan-400 mb-2 animate-pulse" />
               </div>
               <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full transition-all duration-1000 ease-out" style={{ width: `${overallScore}%` }} />
               </div>
            </div>

            {/* KPI 2: Maturity Distribution (Mini Chart) */}
            <div className="flex-[2] min-w-[200px] bg-slate-900/50 backdrop-blur-md border border-white/10 p-4 rounded-xl relative">
              <div className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-3">Maturity Spread</div>
              <div className="flex items-end justify-between h-10 gap-1">
                {distribution.map((count, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-end w-full h-full group cursor-help">
                    <div 
                      className={`w-full mx-0.5 rounded-t-sm transition-all duration-500 ${maturityLevels[idx].color.replace('/10', '/80')}`} 
                      style={{ height: `${Math.max(15, (count / complianceData.length) * 100)}%` }} 
                    />
                    <div className="absolute -top-8 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                       Lvl {idx}: {count} Controls
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-slate-600 font-mono px-0.5">
                 <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>
            
             {/* Action Button */}
            <button onClick={() => window.print()} className="flex items-center justify-center w-14 bg-slate-800 hover:bg-cyan-900/30 border border-white/10 hover:border-cyan-500/50 rounded-xl transition-all text-slate-400 hover:text-cyan-400">
              <Printer className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* SEARCH BAR (Cyber-Input Style) */}
        <div className="relative group z-20">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-lg blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-lg p-1">
                <Search className="ml-3 text-slate-500 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Filter controls by keyword, ID, or framework..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full bg-transparent border-none text-slate-200 placeholder-slate-600 focus:ring-0 px-4 py-3 outline-none" 
                />
                <div className="hidden sm:flex items-center gap-2 pr-2">
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800">CMD+K</span>
                </div>
            </div>
        </div>

        {/* CONTROLS GRID */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Controls</h2>
              <span className="text-xs font-mono text-cyan-500 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900">
                {filteredData.length} DETECTED
              </span>
           </div>

          <div className="grid gap-3">
            {filteredData.map((item) => {
              const currentMat = getMaturity(item.id);
              const matStyle = maturityLevels[currentMat];
              
              return (
              <div key={item.id} className={`group relative bg-slate-900/40 backdrop-blur-sm border ${expandedRows.has(item.id) ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-white/5 hover:border-white/10'} rounded-xl transition-all duration-300 overflow-hidden`}>
                
                {/* Visual Indicator Strip (Left) */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${matStyle.color.replace('/10', '')} transition-colors duration-500`}></div>

                <div onClick={() => {
                      const newSet = new Set(expandedRows);
                      newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
                      setExpandedRows(newSet);
                    }} className="p-5 cursor-pointer flex gap-5 items-center">
                  
                  {/* ID Badge */}
                  <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 font-mono text-sm">
                     <span className="text-[10px] uppercase text-slate-600">ID</span>
                     {item.id.toString().padStart(2, '0')}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-100 truncate group-hover:text-cyan-400 transition-colors">{item.concept}</h3>
                      {item.priority === 'Critical' && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                           <AlertTriangle className="w-3 h-3" /> CRITICAL
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                         {item.riskTier}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 truncate pr-4 font-light">{item.description}</p>
                  </div>
                  
                  {/* Mini Maturity Badge (Collapsed View) */}
                  <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border ${matStyle.border} ${matStyle.color}`}>
                     <div className={`w-2 h-2 rounded-full ${matStyle.color.replace('/10', '')} animate-pulse`}></div>
                     <span className={`text-xs font-bold ${matStyle.text}`}>{matStyle.label}</span>
                  </div>

                  <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${expandedRows.has(item.id) ? 'rotate-180 text-cyan-400' : ''}`} />
                </div>

                {/* EXPANDED PANEL */}
                {expandedRows.has(item.id) && (
                  <div className="border-t border-white/5 bg-slate-950/50 p-6 animate-in slide-in-from-top-2">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Maturity Slider */}
                      <div className="lg:col-span-2 space-y-6">
                         <div>
                            <div className="flex justify-between items-center mb-4">
                               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4" /> Assessment
                               </label>
                               <span className={`text-xs font-mono px-2 py-1 rounded bg-slate-900 border border-slate-700 ${matStyle.text}`}>
                                  CURRENT: {matStyle.label.toUpperCase()}
                               </span>
                            </div>
                            
                            {/* Custom Stepper UI */}
                            <div className="grid grid-cols-6 gap-2">
                              {maturityLevels.map((lvl, idx) => (
                                <button
                                  key={lvl.level}
                                  onClick={() => updateMaturity(item.id, lvl.level)}
                                  className={`relative h-14 rounded-lg border flex flex-col items-center justify-center transition-all duration-200 group/btn ${
                                    currentMat === lvl.level 
                                      ? `${lvl.color} ${lvl.border} ${lvl.text} ${lvl.glow} ring-1 ring-inset ring-white/10` 
                                      : 'bg-slate-900/50 border-white/5 text-slate-600 hover:bg-slate-800 hover:border-white/10'
                                  }`}
                                >
                                  <span className="text-lg font-bold">{lvl.level}</span>
                                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 group-hover/btn:opacity-100">{lvl.label}</span>
                                </button>
                              ))}
                            </div>
                         </div>

                         {/* Remediation Box */}
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                               <FileText className="w-4 h-4" /> Remediation Plan
                            </label>
                            <div className="relative">
                               <textarea 
                                  value={getRemediation(item.id)}
                                  onChange={(e) => updateRemediation(item.id, e.target.value)}
                                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-4 text-sm text-slate-200 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none h-32 resize-none font-mono placeholder:text-slate-700"
                                  placeholder="// Enter gap analysis notes, link evidence, or assign Jira tickets here..."
                               />
                               <div className="absolute bottom-3 right-3">
                                  <Save className="w-4 h-4 text-slate-600 hover:text-cyan-400 cursor-pointer transition-colors" />
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Right: Metadata */}
                      <div className="space-y-6 border-l border-white/5 pl-8">
                         <div>
                            <div className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                               <Network className="w-4 h-4" /> Mapped Frameworks
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(item.mappings).map(([fw, codes]) => (
                                <div key={fw} className="group/tag relative">
                                   <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors cursor-help">
                                      {fw}
                                   </div>
                                   {/* Tooltip */}
                                   <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] bg-black border border-white/10 p-2 rounded text-[10px] text-slate-300 opacity-0 group-hover/tag:opacity-100 pointer-events-none z-10">
                                      {codes.join(', ')}
                                   </div>
                                </div>
                              ))}
                            </div>
                         </div>

                         <div>
                            <div className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                               <Zap className="w-4 h-4" /> Implementation Guide
                            </div>
                            <div className="text-sm text-slate-400 font-light leading-relaxed border-l-2 border-cyan-500/20 pl-4 py-1">
                               {item.implementation}
                            </div>
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
      </div>
    </div>
  );
};

export default AIGovernancePlatform;
