import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, CheckCircle, Shield, Activity, TrendingUp, FileText, Globe, Network, BarChart3, Upload, Map } from 'lucide-react';

const AIGovernancePlatform = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [controlState, setControlState] = useState({});
  const [userControls, setUserControls] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const frameworks = ['NIST AI RMF', 'ISO/IEC 42001', 'EU AI Act', 'OECD', 'Canada AIDA', 'Singapore', 'US Banking', 'OWASP', 'GDPR'];
  
  const maturityLevels = [
    { level: 0, label: 'Non-Existent', color: 'bg-slate-800', text: 'text-slate-500' },
    { level: 1, label: 'Initial', color: 'bg-red-500/20', text: 'text-red-400' },
    { level: 2, label: 'Managed', color: 'bg-orange-500/20', text: 'text-orange-400' },
    { level: 3, label: 'Defined', color: 'bg-yellow-500/20', text: 'text-yellow-400' },
    { level: 4, label: 'Measured', color: 'bg-cyan-500/20', text: 'text-cyan-400' },
    { level: 5, label: 'Optimized', color: 'bg-emerald-500/20', text: 'text-emerald-400' }
  ];

  const complianceData = [
    { id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical", description: "Systematic approach to identify, assess, and mitigate AI-related risks.", mappings: { "NIST AI RMF": ["MAP 1.1"], "ISO/IEC 42001": ["Clause 8.2"], "EU AI Act": ["Article 9"] }, implementation: "Maintain a living AI Risk Register with quarterly reviews." },
    { id: 2, concept: "Human Oversight", riskTier: "High-Risk", priority: "Critical", description: "Mechanisms ensuring human intervention and control over AI decisions.", mappings: { "NIST AI RMF": ["GOVERN 2.2"], "EU AI Act": ["Article 14"], "Canada AIDA": ["Section 12"] }, implementation: "Establish oversight committee with defined intervention triggers." },
    { id: 3, concept: "Model Inventory", riskTier: "All Systems", priority: "High", description: "Centralized inventory of all AI models.", mappings: { "US Banking": ["SR 11-7"], "ISO/IEC 42001": ["Clause 6.1.3"] }, implementation: "Maintain centralized registry of all models." },
    { id: 4, concept: "Data Governance", riskTier: "All Systems", priority: "High", description: "Controls for data quality and lineage.", mappings: { "ISO/IEC 42001": ["Annex A.7"], "EU AI Act": ["Article 10"] }, implementation: "Encrypt data at rest and in transit." },
    { id: 5, concept: "Model Validation", riskTier: "High-Risk", priority: "Critical", description: "Independent validation by separate team.", mappings: { "US Banking": ["Independent Validation"], "NIST AI RMF": ["MEASURE 2.6"] }, implementation: "Second line of defense validates models." },
    { id: 6, concept: "Privacy Assessment", riskTier: "All Systems", priority: "Critical", description: "GDPR compliance safeguards.", mappings: { "GDPR": ["Article 35"], "Canada AIDA": ["Anonymization"] }, implementation: "Conduct DPIA before processing personal data." },
    { id: 7, concept: "Explainability", riskTier: "High-Risk", priority: "High", description: "Explain AI decisions to stakeholders.", mappings: { "EU AI Act": ["Article 13"], "Singapore": ["Operations"] }, implementation: "Provide SHAP/LIME explanations." },
    { id: 8, concept: "Data Drift Detection", riskTier: "High-Risk", priority: "Critical", description: "Monitor input distribution shifts.", mappings: { "NIST AI RMF": ["MEASURE 2.7"], "US Banking": ["Monitoring"] }, implementation: "Alert when distribution diverges >5%." },
    { id: 9, concept: "Model Versioning", riskTier: "High-Risk", priority: "High", description: "Revert to previous versions.", mappings: { "ISO/IEC 42001": ["Annex A.9.3"] }, implementation: "Immutable version history." },
    { id: 10, concept: "Adversarial Testing", riskTier: "High-Risk", priority: "Critical", description: "Test against prompt injection.", mappings: { "OWASP": ["LLM01"], "Canada AIDA": ["Harm Mitigation"] }, implementation: "Red-team LLM jailbreaks." },
    { id: 11, concept: "Bias Testing", riskTier: "High-Risk", priority: "Critical", description: "Test for algorithmic bias.", mappings: { "NIST AI RMF": ["MEASURE 2.3"], "EU AI Act": ["Article 10(2)"] }, implementation: "Quarterly bias testing." },
    { id: 12, concept: "Secure Weights Storage", riskTier: "Critical", priority: "Critical", description: "Prevent model theft.", mappings: { "OWASP": ["LLM10"] }, implementation: "Store in HSM." },
    { id: 13, concept: "Copyright Compliance", riskTier: "GenAI", priority: "High", description: "Respect IP laws.", mappings: { "EU AI Act": ["Article 53"] }, implementation: "Maintain IP ledger." },
    { id: 14, concept: "Contestability", riskTier: "High-Risk", priority: "Medium", description: "Challenge automated decisions.", mappings: { "GDPR": ["Article 22"], "Singapore": ["Customer"] }, implementation: "Appeal workflow." },
    { id: 15, concept: "Environmental Impact", riskTier: "All Systems", priority: "Medium", description: "Monitor carbon footprint.", mappings: { "EU AI Act": ["Article 40"] }, implementation: "Log compute hours." },
    { id: 16, concept: "Vendor Risk", riskTier: "All Systems", priority: "High", description: "Third-party oversight.", mappings: { "US Banking": ["Vendor Models"] }, implementation: "Risk assess 3rd parties." }
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
    const total = Object.values(controlState).reduce((acc, curr) => acc + (curr.maturity || 0), 0);
    return Math.round((total / (complianceData.length * 5)) * 100);
  }, [controlState]);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0];
    complianceData.forEach(item => counts[getMaturity(item.id)]++);
    return counts;
  }, [controlState]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          setUserControls(JSON.parse(event.target.result));
          setUploadedFile(file.name);
        } catch (err) {
          alert('Invalid JSON');
        }
      };
      reader.readAsText(file);
    }
  };

  const gapAnalysis = useMemo(() => {
    if (userControls.length === 0) return null;
    const implemented = userControls.map(c => (c.concept || '').toLowerCase());
    const gaps = complianceData.filter(item => !implemented.includes(item.concept.toLowerCase()));
    return {
      coverage: ((complianceData.length - gaps.length) / complianceData.length * 100).toFixed(0),
      implemented: complianceData.length - gaps.length,
      gaps: gaps,
      criticalGaps: gaps.filter(g => g.priority === 'Critical')
    };
  }, [userControls]);

  const filteredData = useMemo(() => {
    return complianceData.filter(item => searchTerm === '' || item.concept.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-2">
              <Globe className="w-3 h-3" /> Global Governance
            </div>
            <h1 className="text-5xl font-bold text-white">AI Governance <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Map</span></h1>
            <p className="text-slate-400">16 controls across 9 frameworks: NIST, ISO, EU AI Act, Canada AIDA, Singapore, US Banking</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-slate-900/50 border border-white/10 p-4 rounded-xl">
              <div className="text-slate-500 text-xs uppercase mb-1">Score</div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-white">{overallScore}%</span>
                <Activity className="w-5 h-5 text-cyan-400 mb-2" />
              </div>
              <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full transition-all" style={{ width: `${overallScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/50 border border-white/10 p-4 rounded-xl hidden md:block">
              <div className="text-slate-500 text-xs uppercase mb-3">Maturity</div>
              <div className="flex items-end justify-between h-10 gap-1">
                {distribution.map((count, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-end w-full h-full group relative">
                    <div className={`w-full rounded-t ${maturityLevels[idx].color}`} style={{ height: `${Math.max(15, (count / complianceData.length) * 100)}%` }} />
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 text-xs bg-black px-2 py-1 rounded">L{idx}: {count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/80 rounded-xl border border-white/10">
          {[
            { id: 'map', icon: Map, label: 'Control Map' },
            { id: 'network', icon: Network, label: 'Cross-Walk' },
            { id: 'gap', icon: BarChart3, label: 'Gap Analysis' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="flex items-center bg-slate-900 border border-white/10 rounded-lg p-1">
              <Search className="ml-3 text-slate-500 w-5 h-5" />
              <input type="text" placeholder="Search controls..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent border-none text-slate-200 px-4 py-3 outline-none" />
            </div>

            <div className="grid gap-3">
              {filteredData.map((item) => {
                const mat = getMaturity(item.id);
                const style = maturityLevels[mat];
                return (
                  <div key={item.id} className={`bg-slate-900/40 border ${expandedRows.has(item.id) ? 'border-cyan-500/30' : 'border-white/5'} rounded-xl overflow-hidden`}>
                    <div onClick={() => {
                      const newSet = new Set(expandedRows);
                      newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
                      setExpandedRows(newSet);
                    }} className="p-5 cursor-pointer flex gap-5 items-center">
                      <div className={`w-1 h-12 rounded-full ${style.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-slate-100">{item.concept}</h3>
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400">{item.riskTier}</span>
                        </div>
                        <p className="text-sm text-slate-400">{item.description}</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform ${expandedRows.has(item.id) ? 'rotate-180' : ''}`} />
                    </div>

                    {expandedRows.has(item.id) && (
                      <div className="border-t border-white/5 bg-slate-950/50 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <div className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" /> {style.label}
                            </div>
                            <div className="grid grid-cols-6 gap-2 mb-6">
                              {maturityLevels.map((lvl) => (
                                <button key={lvl.level} onClick={() => updateMaturity(item.id, lvl.level)} className={`h-10 rounded border text-sm font-bold ${mat === lvl.level ? `${lvl.color} ${lvl.text} border-white/20` : 'bg-slate-900 border-white/5 text-slate-600'}`}>
                                  {lvl.level}
                                </button>
                              ))}
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Remediation
                              </label>
                              <textarea value={getRemediation(item.id)} onChange={(e) => updateRemediation(item.id, e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-sm text-slate-200 outline-none h-24" placeholder="Notes..." />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Mappings</div>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(item.mappings).map(([fw, codes]) => (
                                  <div key={fw} className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-400">
                                    {fw}: {codes.join(', ')}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Implementation</div>
                              <p className="text-sm text-slate-400 border-l-2 border-cyan-500/20 pl-3">{item.implementation}</p>
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

        {activeTab === 'network' && (
          <div className="bg-slate-900/60 p-6 rounded-xl border border-white/10 overflow-x-auto">
            <h3 className="text-lg font-bold text-white mb-6">Framework Overlap Matrix</h3>
            <div className="grid gap-2 min-w-[600px]">
              <div className="flex gap-2 mb-2">
                <div className="w-32"></div>
                {frameworks.slice(0, 5).map(fw => (
                  <div key={fw} className="w-24 text-xs text-slate-500 text-center">{fw.split(' ')[0]}</div>
                ))}
              </div>
              {frameworks.slice(0, 5).map((fw1, i) => (
                <div key={fw1} className="flex items-center gap-2">
                  <div className="w-32 text-xs text-slate-400 text-right pr-4">{fw1}</div>
                  {frameworks.slice(0, 5).map((fw2, j) => {
                    const overlap = complianceData.filter(item => item.mappings[fw1] && item.mappings[fw2]).length;
                    return (
                      <div key={j} className={`w-24 h-10 rounded border flex items-center justify-center text-xs ${i === j ? 'bg-slate-900 text-slate-700' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
                        {i === j ? '-' : overlap}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gap' && (
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-dashed border-white/20 rounded-xl p-12 text-center">
              <Upload className="w-10 h-10 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Gap Analysis</h3>
              <label className="inline-block cursor-pointer">
                <span className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold">Select JSON</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
              {uploadedFile && <div className="mt-4 text-emerald-400 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4"/> {uploadedFile}</div>}
            </div>

            {gapAnalysis && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/60 p-6 rounded-xl border border-white/10">
                    <div className="text-slate-500 text-xs uppercase mb-2">Coverage</div>
                    <div className="text-4xl font-bold text-white">{gapAnalysis.coverage}%</div>
                  </div>
                  <div className="bg-slate-900/60 p-6 rounded-xl border border-purple-500/30">
                    <div className="text-purple-400 text-xs uppercase mb-2">Critical Gaps</div>
                    <div className="text-4xl font-bold text-white">{gapAnalysis.criticalGaps.length}</div>
                  </div>
                  <div className="bg-slate-900/60 p-6 rounded-xl border border-orange-500/30">
                    <div className="text-orange-400 text-xs uppercase mb-2">Total Gaps</div>
                    <div className="text-4xl font-bold text-white">{gapAnalysis.gaps.length}</div>
                  </div>
                </div>

                {gapAnalysis.gaps.length > 0 && (
                  <div className="bg-slate-900/60 p-6 rounded-xl border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-4">Missing Controls</h4>
                    <div className="space-y-3">
                      {gapAnalysis.gaps.map(gap => (
                        <div key={gap.id} className="bg-slate-950/50 p-4 rounded-lg border border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-slate-200">{gap.concept}</h5>
                            <span className="px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400">{gap.priority}</span>
                          </div>
                          <p className="text-sm text-slate-400">{gap.description}</p>
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