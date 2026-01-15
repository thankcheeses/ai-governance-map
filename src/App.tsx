import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, ChevronDown, ChevronUp, Network, BarChart3, Upload, Map, CheckCircle, Shield, Activity, Zap } from 'lucide-react';

const AIGovernancePlatform = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState(['all']);
  const [selectedRiskTier, setSelectedRiskTier] = useState('all');
  const [selectedLifecycle, setSelectedLifecycle] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [userControls, setUserControls] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const frameworks = ['NIST AI RMF', 'ISO/IEC 42001', 'EU AI Act', 'SOC 2 / ISO 27001'];
  
  // DATA SECTION
  const complianceData = [
    { id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical", lifecycle: "All Stages", description: "Systematic approach to identify, assess, and mitigate AI-related risks.", mappings: { "NIST AI RMF": ["MAP 1.1", "MEASURE 2.6"], "ISO/IEC 42001": ["Clause 8.2", "Annex A.8"], "EU AI Act": ["Article 9"], "SOC 2 / ISO 27001": ["CC 3.1"] }, evidence: ["Risk Register", "Assessment Reports"], implementation: "Maintain a living AI Risk Register with impact tracking." },
    { id: 2, concept: "Human Oversight", riskTier: "High-Risk", priority: "Critical", lifecycle: "Deployment", description: "Mechanisms ensuring human intervention and control over AI decisions.", mappings: { "NIST AI RMF": ["GOVERN 2.2", "MANAGE 2.4"], "ISO/IEC 42001": ["Clause 5.3", "Annex B.9"], "EU AI Act": ["Article 14"], "SOC 2 / ISO 27001": ["CC 1.3"] }, evidence: ["Oversight Charter", "Intervention Logs"], implementation: "Establish oversight committee with defined intervention triggers." },
    { id: 3, concept: "Data Governance & Quality", riskTier: "All Systems", priority: "High", lifecycle: "Design", description: "Controls for data acquisition, quality, bias detection, and lineage.", mappings: { "NIST AI RMF": ["MAP 2.2", "MEASURE 2.2"], "ISO/IEC 42001": ["Annex A.7", "Clause 8.4"], "EU AI Act": ["Article 10"], "SOC 2 / ISO 27001": ["CC 4.1"] }, evidence: ["Data Quality Scorecards", "Lineage Maps"], implementation: "Implement data quality scorecards and bias testing." },
    { id: 4, concept: "Technical Documentation", riskTier: "High-Risk", priority: "High", lifecycle: "All Stages", description: "Comprehensive documentation of AI system design and operations.", mappings: { "NIST AI RMF": ["GOVERN 3.1", "MANAGE 4.2"], "ISO/IEC 42001": ["Clause 7.5", "Annex A.4"], "EU AI Act": ["Article 11"], "SOC 2 / ISO 27001": ["CC 5.2"] }, evidence: ["Model Cards", "Architecture Diagrams"], implementation: "Maintain up-to-date model cards and system architecture." },
    { id: 5, concept: "System Monitoring & Logging", riskTier: "High-Risk", priority: "Critical", lifecycle: "Monitoring", description: "Continuous monitoring of performance and anomaly detection.", mappings: { "NIST AI RMF": ["MEASURE 2.7", "MANAGE 3.2"], "ISO/IEC 42001": ["Clause 9.1", "Annex A.9"], "EU AI Act": ["Article 12"], "SOC 2 / ISO 27001": ["CC 7.2"] }, evidence: ["Monitoring Dashboards", "Incident Logs"], implementation: "Automated monitoring with anomaly detection alerts." },
    { id: 6, concept: "Transparency & Explainability", riskTier: "High-Risk", priority: "High", lifecycle: "Design", description: "Ability to explain AI decisions to stakeholders.", mappings: { "NIST AI RMF": ["GOVERN 1.2", "MEASURE 3.1"], "ISO/IEC 42001": ["Annex A.10", "Clause 7.4"], "EU AI Act": ["Article 13"], "SOC 2 / ISO 27001": ["CC 1.4"] }, evidence: ["Explainability Reports", "User Disclosures"], implementation: "Use SHAP/LIME tools and provide user-facing disclosures." },
    { id: 7, concept: "Vendor Management", riskTier: "All Systems", priority: "High", lifecycle: "All Stages", description: "Oversight of third-party AI providers and components.", mappings: { "NIST AI RMF": ["MAP 1.5", "GOVERN 1.5"], "ISO/IEC 42001": ["Clause 8.4", "Annex A.11"], "EU AI Act": ["Article 16"], "SOC 2 / ISO 27001": ["CC 9.2"] }, evidence: ["Vendor Assessments", "SLAs"], implementation: "Conduct AI-specific vendor security questionnaires." },
    { id: 8, concept: "Incident Response", riskTier: "High-Risk", priority: "Critical", lifecycle: "Monitoring", description: "Procedures for detecting and responding to AI failures.", mappings: { "NIST AI RMF": ["MANAGE 4.1", "MANAGE 4.3"], "ISO/IEC 42001": ["Clause 10.1", "Annex A.12"], "EU AI Act": ["Article 62"], "SOC 2 / ISO 27001": ["CC 7.3"] }, evidence: ["IR Plan", "Post-Mortem Reports"], implementation: "AI-specific incident response playbook." },
    { id: 9, concept: "Testing & Validation", riskTier: "High-Risk", priority: "Critical", lifecycle: "Development", description: "Rigorous testing for accuracy, robustness, and safety.", mappings: { "NIST AI RMF": ["MEASURE 2.3", "MEASURE 2.8"], "ISO/IEC 42001": ["Annex A.5", "Clause 8.1"], "EU AI Act": ["Article 15"], "SOC 2 / ISO 27001": ["CC 8.1"] }, evidence: ["Test Plans", "Adversarial Results"], implementation: "Adversarial testing and edge case validation." },
    { id: 10, concept: "Change Management", riskTier: "High-Risk", priority: "High", lifecycle: "All Stages", description: "Controlled processes for model updates and retraining.", mappings: { "NIST AI RMF": ["MANAGE 3.1", "GOVERN 4.1"], "ISO/IEC 42001": ["Clause 8.1", "Annex A.6"], "EU AI Act": ["Article 43"], "SOC 2 / ISO 27001": ["CC 6.3"] }, evidence: ["Change Requests", "Version Logs"], implementation: "Formal change control for model retraining." },
    { id: 11, concept: "Privacy & Data Protection", riskTier: "All Systems", priority: "Critical", lifecycle: "All Stages", description: "Safeguards for personal data and GDPR compliance.", mappings: { "NIST AI RMF": ["MAP 2.3", "GOVERN 5.1"], "ISO/IEC 42001": ["Annex A.7", "Clause 8.3"], "EU AI Act": ["Article 10(5)"], "SOC 2 / ISO 27001": ["P1.1"] }, evidence: ["DPIA", "Anonymization Logs"], implementation: "Privacy Impact Assessments for all AI data." },
    { id: 12, concept: "Accuracy & Performance", riskTier: "High-Risk", priority: "High", lifecycle: "Monitoring", description: "Continuous measurement of accuracy and reliability.", mappings: { "NIST AI RMF": ["MEASURE 1.1", "MEASURE 2.1"], "ISO/IEC 42001": ["Clause 9.1", "Annex A.9"], "EU AI Act": ["Article 15"], "SOC 2 / ISO 27001": ["CC 4.2"] }, evidence: ["Accuracy Metrics", "Drift Reports"], implementation: "Monitor for model drift and accuracy decay." },
    { id: 13, concept: "Cybersecurity", riskTier: "High-Risk", priority: "Critical", lifecycle: "All Stages", description: "Protection against adversarial attacks and poisoning.", mappings: { "NIST AI RMF": ["MAP 3.1", "MANAGE 2.3"], "ISO/IEC 42001": ["Annex A.13", "Clause 8.2"], "EU AI Act": ["Article 15"], "SOC 2 / ISO 27001": ["CC 6.1"] }, evidence: ["Pen Test Reports", "Vuln Scans"], implementation: "Secure training environments and model weights." },
    { id: 14, concept: "Bias & Fairness", riskTier: "High-Risk", priority: "Critical", lifecycle: "Development", description: "Evaluation and mitigation of discriminatory bias.", mappings: { "NIST AI RMF": ["MEASURE 2.4", "MANAGE 1.1"], "ISO/IEC 42001": ["Annex A.8", "Clause 9.1"], "EU AI Act": ["Article 10(2)(f)"], "SOC 2 / ISO 27001": ["CC 4.1"] }, evidence: ["Fairness Audits", "Bias Mitigation Docs"], implementation: "Test across protected groups for equalized odds." },
    { id: 15, concept: "AI Safety & Alignment", riskTier: "High-Risk", priority: "Critical", lifecycle: "Design", description: "Ensuring systems behave as intended and aligned with values.", mappings: { "NIST AI RMF": ["MAP 1.2", "GOVERN 1.3"], "ISO/IEC 42001": ["Annex A.3"], "EU AI Act": ["Recital 27"], "SOC 2 / ISO 27001": ["CC 2.1"] }, evidence: ["Safety Tests", "Alignment Docs"], implementation: "Red teaming for alignment failures." },
    { id: 16, concept: "Appeals & Redress", riskTier: "High-Risk", priority: "High", lifecycle: "Deployment", description: "Processes for individuals to challenge automated decisions.", mappings: { "NIST AI RMF": ["MANAGE 2.4", "MEASURE 3.1"], "ISO/IEC 42001": ["Clause 10.1", "Annex B.9"], "EU AI Act": ["Article 86"], "SOC 2 / ISO 27001": ["CC 3.3"] }, evidence: ["Appeals Log", "Redress Policy"], implementation: "Clear channels for users to contest AI decisions." },
    { id: 17, concept: "Environmental Impact", riskTier: "All Systems", priority: "Medium", lifecycle: "Development", description: "Tracking energy consumption and carbon footprint.", mappings: { "NIST AI RMF": ["MAP 1.6", "GOVERN 1.6"], "ISO/IEC 42001": ["Annex A.14"], "EU AI Act": ["Recital 93"], "SOC 2 / ISO 27001": ["ISO 14001"] }, evidence: ["Carbon Report", "Energy Metrics"], implementation: "Measure training compute energy and optimize efficiency." },
    { id: 18, concept: "Accountability Structure", riskTier: "All Systems", priority: "High", lifecycle: "All Stages", description: "Defined roles and responsibilities for AI governance.", mappings: { "NIST AI RMF": ["GOVERN 1.1", "GOVERN 2.2"], "ISO/IEC 42001": ["Clause 5.3"], "EU AI Act": ["Article 26"], "SOC 2 / ISO 27001": ["CC 2.2"] }, evidence: ["RACI Matrix", "Governance Charter"], implementation: "Establish AI Board and assign accountable officers." },
    { id: 19, concept: "Training & Competence", riskTier: "All Systems", priority: "Medium", lifecycle: "All Stages", description: "Ensuring staff have AI literacy and skills.", mappings: { "NIST AI RMF": ["GOVERN 2.1", "GOVERN 5.2"], "ISO/IEC 42001": ["Clause 7.2"], "EU AI Act": ["Article 4"], "SOC 2 / ISO 27001": ["CC 1.4"] }, evidence: ["Training Logs", "Certifications"], implementation: "Role-based AI ethics and security training." },
    { id: 20, concept: "Continuous Improvement", riskTier: "All Systems", priority: "High", lifecycle: "Monitoring", description: "Regular audits and performance reviews.", mappings: { "NIST AI RMF": ["MEASURE 4.1", "GOVERN 4.3"], "ISO/IEC 42001": ["Clause 10.2", "Clause 9.2"], "EU AI Act": ["Article 72"], "SOC 2 / ISO 27001": ["CC 5.3"] }, evidence: ["Audit Reports", "Improvement Plan"], implementation: "Quarterly governance reviews and annual third-party audits." }
  ];

  // FILTERS
  const filteredData = useMemo(() => {
    return complianceData.filter(item => {
      const matchesSearch = searchTerm === '' || item.concept.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFramework = selectedFrameworks.includes('all') || selectedFrameworks.some(fw => item.mappings[fw] && item.mappings[fw].length > 0);
      const matchesRisk = selectedRiskTier === 'all' || item.riskTier === selectedRiskTier;
      const matchesLifecycle = selectedLifecycle === 'all' || item.lifecycle.includes(selectedLifecycle);
      return matchesSearch && matchesFramework && matchesRisk && matchesLifecycle;
    });
  }, [searchTerm, selectedFrameworks, selectedRiskTier, selectedLifecycle]);

  // GAP ANALYSIS
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try { setUserControls(JSON.parse(event.target.result)); setUploadedFile(file.name); } catch (error) { alert('Invalid JSON'); }
      };
      reader.readAsText(file);
    }
  };
  const gapAnalysis = useMemo(() => {
    if (userControls.length === 0) return null;
    const implemented = userControls.map(c => c.concept.toLowerCase());
    const gaps = complianceData.filter(item => !implemented.includes(item.concept.toLowerCase()));
    return {
      coverage: ((complianceData.length - gaps.length) / complianceData.length * 100).toFixed(0),
      implemented: complianceData.length - gaps.length,
      gaps: gaps
    };
  }, [userControls]);

  // EXPORT PDF FUNCTION
  const exportToPDF = () => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    if (!printWindow) return alert('Please allow popups');
    const html = `
      <html><head><title>AI Governance Report</title>
      <style>body{font-family:sans-serif;padding:40px}h1{color:#0f172a}h2{color:#334155;border-bottom:2px solid #e2e8f0;padding-bottom:10px}.control{margin-bottom:30px;page-break-inside:avoid}.badge{display:inline-block;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold;margin-right:8px;background:#e2e8f0}.critical{background:#fee2e2;color:#991b1b}</style>
      </head><body><h1>AI Governance Audit Report</h1><p>Date: ${new Date().toLocaleDateString()}</p>
      ${filteredData.map(item => `<div class="control"><h2>${item.concept} <span class="badge ${item.priority === 'Critical' ? 'critical' : ''}">${item.priority}</span></h2><p>${item.description}</p><p><strong>Evidence:</strong> ${item.evidence.join(', ')}</p></div>`).join('')}
      </body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  // EXPORT CSV FUNCTION
  const exportToCSV = () => {
    const headers = ['Concept', 'Risk Tier', 'Lifecycle', 'Priority', 'Description', 'Implementation'];
    const rows = filteredData.map(item => [item.concept, item.riskTier, item.lifecycle, item.priority, item.description, item.implementation]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-governance-map.csv';
    a.click();
  };

  // STYLING HELPERS
  const getPriorityColor = (p) => {
    if (p === 'Critical') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (p === 'High') return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* HEADER */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
               <Shield className="w-8 h-8 text-cyan-400" />
             </div>
             <div>
               <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                 AI Governance Map
               </h1>
               <p className="text-slate-400 text-sm sm:text-base">NIST • ISO 42001 • EU AI Act • SOC 2</p>
             </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-sm mb-8">
          {['map', 'network', 'gap'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-slate-800 text-cyan-400 shadow-lg shadow-cyan-900/20 border border-slate-700' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {tab === 'map' && <Map className="w-4 h-4" />}
              {tab === 'network' && <Network className="w-4 h-4" />}
              {tab === 'gap' && <BarChart3 className="w-4 h-4" />}
              <span className="capitalize hidden sm:inline">{tab}</span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* SEARCH & FILTERS */}
            <div className="sticky top-4 z-10 flex flex-col sm:flex-row gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur-md shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search controls..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${showFilters ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <Filter className="w-4 h-4" />
                </button>
                <button onClick={exportToCSV} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-slate-700">CSV</button>
                <button onClick={exportToPDF} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-slate-700">PDF</button>
              </div>
            </div>

            {showFilters && (
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 animate-in slide-in-from-top-2">
                 <div className="space-y-2">
                   <label className="text-xs font-semibold text-slate-500 uppercase">Risk Tier</label>
                   <select onChange={(e) => setSelectedRiskTier(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500">
                     <option value="all">All Tiers</option>
                     <option value="High-Risk">High-Risk</option>
                     <option value="All Systems">All Systems</option>
                   </select>
                 </div>
               </div>
            )}

            {/* CARDS */}
            <div className="grid gap-4">
              {filteredData.map(item => (
                <div key={item.id} className="group bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 rounded-xl overflow-hidden transition-all duration-300">
                  <div 
                    onClick={() => {
                      const newSet = new Set(expandedRows);
                      newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
                      setExpandedRows(newSet);
                    }}
                    className="p-5 cursor-pointer"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{item.concept}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedRows.has(item.id) ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* EXPANDED CONTENT */}
                  {expandedRows.has(item.id) && (
                    <div className="px-5 pb-5 pt-0 space-y-4 border-t border-slate-800/50 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        {Object.entries(item.mappings).map(([fw, reqs]) => (
                          reqs.length > 0 && (
                            <div key={fw} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                              <div className="text-xs font-semibold text-slate-500 mb-1">{fw}</div>
                              <div className="space-y-1">
                                {reqs.map(r => <div key={r} className="text-sm text-cyan-200/80">• {r}</div>)}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Required Evidence</div>
                        <div className="flex flex-wrap gap-2">
                          {item.evidence.map(e => (
                            <span key={e} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">{e}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAP ANALYSIS TAB */}
        {activeTab === 'gap' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-slate-600 mb-4" />
              <label className="inline-block">
                <span className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium cursor-pointer transition-colors">
                  Upload Controls JSON
                </span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
              {uploadedFile && <div className="mt-4 text-green-400 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4"/> {uploadedFile}</div>}
            </div>

            {gapAnalysis && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">{gapAnalysis.coverage}%</div>
                  <div className="text-xs text-slate-500 uppercase mt-1">Coverage</div>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
                   <div className="text-3xl font-bold text-red-400">{gapAnalysis.gaps.length}</div>
                   <div className="text-xs text-slate-500 uppercase mt-1">Missing Controls</div>
                </div>
              </div>
            )}
            
            {/* GAP LIST */}
            {gapAnalysis && gapAnalysis.gaps.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-200">Critical Gaps</h3>
                {gapAnalysis.gaps.map(gap => (
                  <div key={gap.id} className="flex items-center justify-between p-4 bg-red-950/10 border border-red-900/30 rounded-lg">
                    <span className="text-red-200">{gap.concept}</span>
                    <span className="px-2 py-1 bg-red-900/20 text-red-400 text-xs rounded border border-red-900/30">{gap.priority}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NETWORK TAB */}
        {activeTab === 'network' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MATRIX VIEW */}
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Framework Interconnections
                </h3>
                <div className="space-y-2">
                  {frameworks.map((fw1, i) => (
                    <div key={fw1} className="flex items-center gap-2">
                      <div className="w-24 text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate text-right">{fw1.split(' ')[0]}</div>
                      <div className="flex gap-1">
                        {frameworks.map((fw2, j) => {
                          const overlap = complianceData.filter(item => 
                            item.mappings[fw1]?.length > 0 && item.mappings[fw2]?.length > 0
                          ).length;
                          const intensity = overlap / complianceData.length;
                          return (
                            <div
                              key={`${fw1}-${fw2}`}
                              className={`w-12 h-10 rounded transition-all duration-500 flex items-center justify-center text-xs font-bold ${
                                i === j 
                                  ? 'bg-slate-800/50 text-slate-600' 
                                  : `bg-cyan-500/${Math.max(10, Math.floor(intensity * 100))} text-cyan-200 border border-cyan-500/20`
                              }`}
                              title={`${fw1} + ${fw2}: ${overlap} shared controls`}
                            >
                              {i === j ? '—' : overlap}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DISTRIBUTIONS */}
              <div className="space-y-6">
                <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-xl">
                  <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    Risk Distribution
                  </h3>
                  <div className="space-y-4">
                    {['High-Risk', 'All Systems'].map(tier => {
                      const count = complianceData.filter(item => item.riskTier === tier).length;
                      const pct = Math.round((count / complianceData.length) * 100);
                      return (
                        <div key={tier}>
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>{tier}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${tier === 'High-Risk' ? 'bg-orange-500' : 'bg-cyan-500'}`} 
                              style={{ width: `${pct}%` }} 
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-xl">
                   <h3 className="text-lg font-bold text-slate-200 mb-4">Lifecycle Coverage</h3>
                   <div className="flex flex-wrap gap-2">
                     {['Design', 'Development', 'Deployment', 'Monitoring'].map(stage => {
                        const count = complianceData.filter(item => item.lifecycle.includes(stage) || item.lifecycle === 'All Stages').length;
                        return (
                          <div key={stage} className="flex-1 min-w-[100px] bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                            <div className="text-2xl font-bold text-slate-200">{count}</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold">{stage}</div>
                          </div>
                        )
                     })}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIGovernancePlatform;
