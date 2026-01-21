import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, ChevronDown, Network, BarChart3, Upload, Map, CheckCircle, Shield, Activity, Zap, ArrowRight, X, FileText, AlertCircle, TrendingUp, Clock, Lock, Globe, Database, Save, Printer } from 'lucide-react';

const AIGovernancePlatform = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState(['all']);
  const [selectedRiskTier, setSelectedRiskTier] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  // STATE FOR MATURITY & REMEDIATION (The "Phase 1" Upgrade)
  const [controlState, setControlState] = useState({}); // Stores maturity (0-5) and notes per control ID

  const frameworks = ['NIST AI RMF', 'ISO/IEC 42001', 'EU AI Act', 'OWASP Top 10', 'US State Laws', 'HIPAA/Healthcare', 'GDPR'];
  const maturityLevels = [
    { level: 0, label: 'Non-Existent', color: 'bg-slate-800' },
    { level: 1, label: 'Initial', color: 'bg-red-900/50' },
    { level: 2, label: 'Managed', color: 'bg-orange-900/50' },
    { level: 3, label: 'Defined', color: 'bg-yellow-900/50' },
    { level: 4, label: 'Measured', color: 'bg-blue-900/50' },
    { level: 5, label: 'Optimized', color: 'bg-green-900/50' }
  ];

  // LEGISLATIVE GRADE DATA (30+ Controls)
  const complianceData = [
    // --- GOVERNANCE ---
    { id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical", description: "Systematic approach to identify, assess, and mitigate AI-related risks.", mappings: { "NIST AI RMF": ["MAP 1.1"], "ISO/IEC 42001": ["Clause 8.2"], "EU AI Act": ["Article 9"] }, implementation: "Maintain a living AI Risk Register with quarterly reviews." },
    { id: 2, concept: "Human Oversight (HITL)", riskTier: "High-Risk", priority: "Critical", description: "Mechanisms ensuring human intervention and control over AI decisions.", mappings: { "NIST AI RMF": ["GOVERN 2.2"], "EU AI Act": ["Article 14"] }, implementation: "Establish oversight committee with defined intervention triggers." },
    { id: 3, concept: "Vendor/Supply Chain Mgmt", riskTier: "All Systems", priority: "High", description: "Oversight of third-party AI providers and components.", mappings: { "NIST AI RMF": ["MAP 1.5"], "ISO/IEC 42001": ["Clause 8.4"] }, implementation: "Vendor risk assessment process with annual re-certification." },
    
    // --- DATA ---
    { id: 4, concept: "Data Governance & Quality", riskTier: "All Systems", priority: "High", description: "Controls for data acquisition, quality, bias detection, and lineage.", mappings: { "ISO/IEC 42001": ["Annex A.7"], "EU AI Act": ["Article 10"] }, implementation: "Data classified as restricted and encrypted at rest/transit." },
    { id: 5, concept: "Privacy Impact Assessment", riskTier: "All Systems", priority: "Critical", description: "Safeguards for personal data and GDPR/State Law compliance.", mappings: { "GDPR": ["Article 35"], "ISO/IEC 42001": ["Annex A.7"] }, implementation: "Conduct DPIA before processing personal data." },
    { id: 6, concept: "Data Sovereignty", riskTier: "High-Risk", priority: "High", description: "Ensuring data processing remains within approved legal jurisdictions.", mappings: { "GDPR": ["Chapter V"], "EU AI Act": ["Article 10"] }, implementation: "Restrict training data flows to approved geo-locations." },
    
    // --- MLOps ---
    { id: 7, concept: "Model Documentation", riskTier: "All Systems", priority: "High", description: "Comprehensive documentation of model architecture and training.", mappings: { "NIST AI RMF": ["MAP 3.4"], "EU AI Act": ["Article 11"] }, implementation: "Create model cards documenting training data and limitations." },
    { id: 8, concept: "Data Drift Detection", riskTier: "High-Risk", priority: "Critical", description: "Monitoring for shifts in input data distribution.", mappings: { "NIST AI RMF": ["MEASURE 2.7"] }, implementation: "Automated alerts when input data diverges >5% from baseline." },
    { id: 9, concept: "Model Versioning", riskTier: "High-Risk", priority: "High", description: "Ability to revert to previous model versions in case of failure.", mappings: { "ISO/IEC 42001": ["Annex A.9.3"] }, implementation: "Immutable version history with one-click rollback." },
    
    // --- SECURITY ---
    { id: 10, concept: "Adversarial Testing", riskTier: "High-Risk", priority: "Critical", description: "Testing against prompt injection and evasion attacks.", mappings: { "OWASP Top 10": ["LLM01"], "NIST AI RMF": ["MEASURE 2.5"] }, implementation: "Red-teaming exercises targeting prompt injection." },
    { id: 11, concept: "Data Poisoning Defense", riskTier: "High-Risk", priority: "High", description: "Protecting training data integrity from manipulation.", mappings: { "OWASP Top 10": ["LLM03"] }, implementation: "Cryptographically sign training datasets." },
    { id: 12, concept: "Secure Weights Storage", riskTier: "Critical", priority: "Critical", description: "Preventing theft of proprietary model weights.", mappings: { "OWASP Top 10": ["LLM10"] }, implementation: "Store model weights in HSM or encrypted buckets." },
    
    // --- ETHICS ---
    { id: 13, concept: "Bias Testing", riskTier: "High-Risk", priority: "Critical", description: "Assessment of algorithmic bias across protected classes.", mappings: { "NIST AI RMF": ["MEASURE 2.3"], "EU AI Act": ["Article 10(2)"] }, implementation: "Quarterly bias testing with independent validation." },
    { id: 14, concept: "Environmental Impact", riskTier: "All Systems", priority: "Medium", description: "Monitoring energy consumption and carbon footprint.", mappings: { "EU AI Act": ["Article 40"] }, implementation: "Log compute hours and estimate carbon emissions." },
    { id: 15, concept: "Copyright Compliance", riskTier: "GenAI", priority: "High", description: "Ensuring training data respects IP laws.", mappings: { "EU AI Act": ["Article 53"] }, implementation: "Maintain IP ledger of training data." },

    // --- TRANSPARENCY ---
    { id: 16, concept: "Explainability", riskTier: "High-Risk", priority: "High", description: "Mechanisms to explain AI decisions to stakeholders.", mappings: { "EU AI Act": ["Article 13"], "NIST AI RMF": ["GOVERN 3.1"] }, implementation: "Provide clear decision explanations to users." },
    { id: 17, concept: "Incident Response", riskTier: "High-Risk", priority: "Critical", description: "Processes for responding to AI failures.", mappings: { "ISO/IEC 42001": ["Clause 10.1"] }, implementation: "24/7 incident response with escalation procedures." },
    { id: 18, concept: "EU Database Registration", riskTier: "High-Risk", priority: "High", description: "Registration of high-risk systems in EU Database.", mappings: { "EU AI Act": ["Article 49"] }, implementation: "Register model in EU central database." },
    
    // --- ADDITIONAL CONTROLS ---
    { id: 19, concept: "Training & Competency", riskTier: "All Systems", priority: "Medium", description: "Ensuring staff have appropriate AI governance competencies.", mappings: { "NIST AI RMF": ["GOVERN 1.4"], "ISO/IEC 42001": ["Clause 7.2"] }, implementation: "Annual AI ethics training for stakeholders." },
    { id: 20, concept: "System Monitoring & Logging", riskTier: "High-Risk", priority: "Critical", description: "Continuous monitoring of performance and anomaly detection.", mappings: { "NIST AI RMF": ["MEASURE 2.7"], "ISO/IEC 42001": ["Clause 9.1"] }, implementation: "Real-time monitoring with automated alerting." },
    { id: 21, concept: "Model Validation & Testing", riskTier: "High-Risk", priority: "Critical", description: "Rigorous testing protocols for accuracy and safety.", mappings: { "NIST AI RMF": ["MEASURE 2.1"], "EU AI Act": ["Article 15"] }, implementation: "Comprehensive testing including edge cases." },
    { id: 22, concept: "Cybersecurity & Access Control", riskTier: "High-Risk", priority: "Critical", description: "Protection against unauthorized access.", mappings: { "NIST AI RMF": ["MAP 3.1"], "ISO/IEC 42001": ["Annex A.13"] }, implementation: "Multi-factor authentication and encryption." },
    { id: 23, concept: "Sensitive Information Disclosure", riskTier: "High-Risk", priority: "Critical", description: "Preventing leakage of PII or confidential data.", mappings: { "OWASP Top 10": ["LLM06"], "GDPR": ["Article 32"] }, implementation: "Output filtering and PII detection." },
    { id: 24, concept: "Insecure Output Handling", riskTier: "High-Risk", priority: "High", description: "Sanitizing model outputs before downstream use.", mappings: { "OWASP Top 10": ["LLM02"] }, implementation: "Validate outputs before execution." },
    { id: 25, concept: "Supply Chain Vulnerabilities", riskTier: "All Systems", priority: "High", description: "Security of ML dependencies and libraries.", mappings: { "OWASP Top 10": ["LLM05"] }, implementation: "SBOM tracking and dependency scanning." },
    { id: 26, concept: "Excessive Agency", riskTier: "High-Risk", priority: "High", description: "Limiting autonomous AI actions.", mappings: { "OWASP Top 10": ["LLM08"] }, implementation: "Require human approval for critical actions." },
    { id: 27, concept: "Overreliance Prevention", riskTier: "All Systems", priority: "Medium", description: "User awareness of AI limitations.", mappings: { "OWASP Top 10": ["LLM09"] }, implementation: "Display confidence scores and disclaimers." },
    { id: 28, concept: "Regulatory Change Management", riskTier: "All Systems", priority: "High", description: "Tracking evolving AI regulations.", mappings: { "ISO/IEC 42001": ["Clause 4.1"] }, implementation: "Monthly regulatory intelligence reviews." },
    { id: 29, concept: "Third-Party Audit Readiness", riskTier: "High-Risk", priority: "High", description: "Preparation for external audits.", mappings: { "ISO/IEC 42001": ["Clause 9.2"] }, implementation: "Maintain audit-ready documentation." },
    { id: 30, concept: "Decommissioning Procedures", riskTier: "All Systems", priority: "Medium", description: "Safe retirement of AI systems.", mappings: { "ISO/IEC 42001": ["Clause 8.6"] }, implementation: "Data deletion and system archival protocols." },
  ];

  // HANDLING MATURITY UPDATES
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

  // CALCULATE OVERALL SCORE
  const overallScore = useMemo(() => {
    const totalPossible = complianceData.length * 5;
    const currentTotal = Object.values(controlState).reduce((acc, curr) => acc + (curr.maturity || 0), 0);
    return Math.round((currentTotal / totalPossible) * 100);
  }, [controlState]);

  const filteredData = useMemo(() => {
    return complianceData.filter(item => {
      const matchesSearch = searchTerm === '' || item.concept.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFramework = selectedFrameworks.includes('all') || selectedFrameworks.some(fw => item.mappings[fw]);
      return matchesSearch && matchesFramework;
    });
  }, [searchTerm, selectedFrameworks]);

  // MATURITY DISTRIBUTION
  const maturityDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0, 0];
    complianceData.forEach(item => {
      const level = getMaturity(item.id);
      dist[level]++;
    });
    return dist;
  }, [controlState]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* HEADER & SCORECARD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              AI Governance Map <span className="text-sm font-mono text-slate-500">v2.1</span>
            </h1>
            <p className="text-slate-400 mt-1">NIST • ISO 42001 • EU AI Act • CMMI Maturity Model</p>
          </div>
          
          <div className="flex gap-4">
            {/* SIMULATED PDF EXPORT BUTTON */}
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-colors text-slate-300">
              <Printer className="w-4 h-4" /> Export PDF
            </button>
            
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold">Compliance Score</div>
                <div className="text-2xl font-bold text-cyan-400">{overallScore}%</div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-cyan-500" strokeDasharray={`${overallScore * 1.75} 200`} />
                </svg>
                <Activity className="w-6 h-6 text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        {/* MATURITY DISTRIBUTION CHART */}
        <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Maturity Distribution
          </h3>
          <div className="grid grid-cols-6 gap-4">
            {maturityLevels.map((level, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xs text-slate-500 mb-2 font-bold">{level.label}</div>
                <div className="h-32 bg-slate-800 rounded-lg overflow-hidden relative flex flex-col justify-end">
                  <div 
                    className={`${level.color} transition-all duration-500`}
                    style={{ height: `${(maturityDistribution[idx] / complianceData.length) * 100}%` }}
                  />
                </div>
                <div className="text-lg font-bold text-cyan-400 mt-2">{maturityDistribution[idx]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTROLS LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input type="text" placeholder="Search controls..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-cyan-500 outline-none" />
            </div>
            <div className="text-sm text-slate-500">Showing {filteredData.length} of {complianceData.length} Controls</div>
          </div>

          <div className="grid gap-4">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all">
                
                {/* CONTROL HEADER */}
                <div onClick={() => {
                  const newSet = new Set(expandedRows);
                  newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
                  setExpandedRows(newSet);
                }} className="p-5 cursor-pointer flex gap-4 items-start">
                  
                  <div className={`w-1 h-12 rounded-full ${maturityLevels[getMaturity(item.id)].color}`} />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-lg font-semibold text-slate-200">{item.concept}</h3>
                      <span className="text-xs font-mono text-slate-500">{item.riskTier}</span>
                    </div>
                    <p className="text-sm text-slate-400">{item.description}</p>
                    
                    {/* MATURITY SLIDER (The "Phase 1" Feature) */}
                    <div className="mt-4 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                      <div className="text-xs font-bold text-slate-500 uppercase">Maturity:</div>
                      <div className="flex gap-1">
                        {[0,1,2,3,4,5].map((level) => (
                          <button
                            key={level}
                            onClick={() => updateMaturity(item.id, level)}
                            className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                              getMaturity(item.id) >= level 
                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' 
                                : 'bg-slate-800 text-slate-600 hover:bg-slate-700'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                      <div className="text-xs text-cyan-400 font-medium">
                        {maturityLevels[getMaturity(item.id)].label}
                      </div>
                    </div>
                  </div>
                  
                  <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform ${expandedRows.has(item.id) ? 'rotate-180' : ''}`} />
                </div>

                {/* EXPANDED DETAILS */}
                {expandedRows.has(item.id) && (
                  <div className="px-5 pb-5 pt-0 border-t border-slate-800/50 bg-slate-950/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      
                      {/* REMEDIATION PLAN (The "Phase 1" Feature) */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                          <FileText className="w-3 h-3" /> Remediation Plan / Notes
                        </label>
                        <textarea 
                          value={getRemediation(item.id)}
                          onChange={(e) => updateRemediation(item.id, e.target.value)}
                          placeholder="Identify gaps and list next steps here..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500 outline-none h-24 resize-none"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Framework Mappings</div>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(item.mappings).map(([fw, codes]) => (
                              <div key={fw} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">
                                <span className="text-slate-500 mr-1">{fw}:</span> {codes.join(', ')}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-slate-400">
                          <span className="text-cyan-500 font-bold">Implementation:</span> {item.implementation}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGovernancePlatform;