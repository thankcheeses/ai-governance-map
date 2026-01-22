import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, ChevronDown, Network, BarChart3, Upload, Map, CheckCircle, Shield, Activity, Zap, ArrowRight, X, FileText, AlertCircle, TrendingUp, Clock } from 'lucide-react';

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
  const [selectedPriority, setSelectedPriority] = useState('all');

  const frameworks = ['NIST AI RMF', 'ISO/IEC 42001', 'EU AI Act', 'OWASP Top 10', 'US State Laws'];
  const lifecycleStages = ['All Stages', 'Design', 'Development', 'Deployment', 'Monitoring'];

  const complianceData = [
    { id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical", lifecycle: "All Stages", description: "Systematic approach to identify, assess, and mitigate AI-related risks.", mappings: { "NIST AI RMF": ["MAP 1.1", "MEASURE 2.6"], "ISO/IEC 42001": ["Clause 8.2", "Annex A.8"], "EU AI Act": ["Article 9"], "OWASP Top 10": ["LLM02: Insecure Output Handling"], "US State Laws": ["CO SB 205 (Assessments)"] }, evidence: ["Risk Register", "Assessment Reports"], implementation: "Maintain a living AI Risk Register with quarterly reviews and executive oversight." },
    { id: 2, concept: "Human Oversight", riskTier: "High-Risk", priority: "Critical", lifecycle: "Deployment", description: "Mechanisms ensuring human intervention and control over AI decisions.", mappings: { "NIST AI RMF": ["GOVERN 2.2", "MANAGE 2.4"], "ISO/IEC 42001": ["Clause 5.3", "Annex B.9"], "EU AI Act": ["Article 14"], "US State Laws": ["CA AB 2013 (Transparency)"] }, evidence: ["Oversight Charter", "Intervention Logs"], implementation: "Establish oversight committee with defined intervention triggers and escalation procedures." },
    { id: 3, concept: "Data Governance & Quality", riskTier: "All Systems", priority: "High", lifecycle: "Design", description: "Controls for data acquisition, quality, bias detection, and lineage.", mappings: { "NIST AI RMF": ["MAP 2.2", "MEASURE 2.2"], "ISO/IEC 42001": ["Annex A.7", "Clause 8.4"], "EU AI Act": ["Article 10"], "OWASP Top 10": ["LLM06: Sensitive Info Disclosure"], "US State Laws": ["CT SB 2 (Data Privacy)"] }, evidence: ["Data Quality Scorecards", "Lineage Maps"], implementation: "Data used to train the AI model shall be classified as restricted and encrypted at rest and in transit." },
    { id: 4, concept: "Model Documentation", riskTier: "All Systems", priority: "High", lifecycle: "Development", description: "Comprehensive documentation of model architecture, training, and performance.", mappings: { "NIST AI RMF": ["MAP 3.4", "GOVERN 4.1"], "ISO/IEC 42001": ["Clause 7.5", "Annex A.5"], "EU AI Act": ["Article 11"], "US State Laws": ["NY AI Bill (Documentation)"] }, evidence: ["Model Cards", "Technical Documentation"], implementation: "Create comprehensive model cards documenting training data, performance metrics, and known limitations." },
    { id: 5, concept: "System Monitoring & Logging", riskTier: "High-Risk", priority: "Critical", lifecycle: "Monitoring", description: "Continuous monitoring of performance and anomaly detection.", mappings: { "NIST AI RMF": ["MEASURE 2.7", "MANAGE 3.2"], "ISO/IEC 42001": ["Clause 9.1", "Annex A.9"], "EU AI Act": ["Article 12"], "OWASP Top 10": ["LLM08: Excessive Agency"], "US State Laws": ["CO SB 205 (Duty of Care)"] }, evidence: ["Monitoring Dashboards", "Incident Logs"], implementation: "Implement real-time monitoring with automated alerting for performance degradation and anomalies." },
    { id: 6, concept: "Bias Testing & Fairness", riskTier: "High-Risk", priority: "Critical", lifecycle: "All Stages", description: "Regular assessment and mitigation of algorithmic bias across protected classes.", mappings: { "NIST AI RMF": ["MEASURE 2.3", "MAP 1.2"], "ISO/IEC 42001": ["Annex A.6"], "EU AI Act": ["Article 10(2)"], "US State Laws": ["IL HB 3773 (Bias Audits)"] }, evidence: ["Bias Audit Reports", "Fairness Metrics"], implementation: "Conduct quarterly bias testing across demographic groups with independent validation." },
    { id: 7, concept: "Vendor/Supply Chain Management", riskTier: "All Systems", priority: "High", lifecycle: "All Stages", description: "Oversight of third-party AI providers and components.", mappings: { "NIST AI RMF": ["MAP 1.5", "GOVERN 1.5"], "ISO/IEC 42001": ["Clause 8.4", "Annex A.11"], "EU AI Act": ["Article 16"], "OWASP Top 10": ["LLM05: Supply Chain Vulnerabilities"] }, evidence: ["Vendor Assessments", "SLAs"], implementation: "Establish vendor risk assessment process with annual re-certification requirements." },
    { id: 8, concept: "Transparency & Explainability", riskTier: "High-Risk", priority: "High", lifecycle: "All Stages", description: "Mechanisms to explain AI decisions to stakeholders and affected parties.", mappings: { "NIST AI RMF": ["GOVERN 3.1", "MEASURE 3.1"], "ISO/IEC 42001": ["Clause 6.2"], "EU AI Act": ["Article 13"], "US State Laws": ["CA AB 2013"] }, evidence: ["Explainability Reports", "User Disclosures"], implementation: "Provide clear explanations of AI decision-making processes to affected individuals." },
    { id: 9, concept: "Incident Response", riskTier: "High-Risk", priority: "Critical", lifecycle: "All Stages", description: "Processes for detecting, reporting, and responding to AI system failures.", mappings: { "NIST AI RMF": ["MANAGE 4.1", "MANAGE 4.2"], "ISO/IEC 42001": ["Clause 10.1"], "EU AI Act": ["Article 62"], "OWASP Top 10": ["LLM10: Model Theft"] }, evidence: ["Incident Response Plan", "Post-Incident Reports"], implementation: "Maintain 24/7 incident response capability with defined escalation procedures." },
    { id: 10, concept: "Training & Competency", riskTier: "All Systems", priority: "Medium", lifecycle: "All Stages", description: "Ensuring staff have appropriate AI governance and technical competencies.", mappings: { "NIST AI RMF": ["GOVERN 1.4"], "ISO/IEC 42001": ["Clause 7.2", "Annex A.3"], "EU AI Act": ["Article 4"] }, evidence: ["Training Records", "Competency Assessments"], implementation: "Provide annual AI ethics and governance training for all AI system stakeholders." },
    { id: 11, concept: "Privacy & Data Protection", riskTier: "All Systems", priority: "Critical", lifecycle: "All Stages", description: "Safeguards for personal data and GDPR/State Law compliance.", mappings: { "NIST AI RMF": ["MAP 2.3", "GOVERN 5.1"], "ISO/IEC 42001": ["Annex A.7", "Clause 8.3"], "EU AI Act": ["Article 10(5)"], "US State Laws": ["CA CCPA", "VA CDPA"] }, evidence: ["DPIA", "Anonymization Logs"], implementation: "Conduct privacy impact assessments before processing personal data with AI systems." },
    { id: 12, concept: "Model Validation & Testing", riskTier: "High-Risk", priority: "Critical", lifecycle: "Development", description: "Rigorous testing protocols for model accuracy, robustness, and safety.", mappings: { "NIST AI RMF": ["MEASURE 2.1", "MEASURE 2.5"], "ISO/IEC 42001": ["Clause 8.5"], "EU AI Act": ["Article 15"], "OWASP Top 10": ["LLM07: Insecure Plugin Design"] }, evidence: ["Validation Reports", "Test Results"], implementation: "Implement comprehensive testing including adversarial testing and edge case analysis." },
    { id: 13, concept: "Cybersecurity & Access Control", riskTier: "High-Risk", priority: "Critical", lifecycle: "All Stages", description: "Protection against adversarial attacks, poisoning, and unauthorized access.", mappings: { "NIST AI RMF": ["MAP 3.1", "MANAGE 2.3"], "ISO/IEC 42001": ["Annex A.13", "Clause 8.2"], "EU AI Act": ["Article 15"], "OWASP Top 10": ["LLM01: Prompt Injection"] }, evidence: ["Pen Test Reports", "MFA Logs"], implementation: "Implement multi-factor authentication, encryption, and regular penetration testing." }
  ];

  const handleMatrixClick = (fw1, fw2) => {
    setSelectedFrameworks([fw1, fw2]);
    setSearchTerm('');
    setSelectedRiskTier('all');
    setSelectedLifecycle('all');
    setSelectedPriority('all');
    setActiveTab('map');
    setShowFilters(true);
  };

  const handleResetFilters = () => {
    setSelectedFrameworks(['all']);
    setSelectedRiskTier('all');
    setSelectedLifecycle('all');
    setSelectedPriority('all');
    setSearchTerm('');
  };

  const filteredData = useMemo(() => {
    return complianceData.filter(item => {
      const matchesSearch = searchTerm === '' || item.concept.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFramework = selectedFrameworks.includes('all') || selectedFrameworks.every(fw => item.mappings[fw] && item.mappings[fw].length > 0);
      const matchesRisk = selectedRiskTier === 'all' || item.riskTier === selectedRiskTier;
      const matchesLifecycle = selectedLifecycle === 'all' || item.lifecycle.includes(selectedLifecycle);
      const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
      return matchesSearch && matchesFramework && matchesRisk && matchesLifecycle && matchesPriority;
    });
  }, [searchTerm, selectedFrameworks, selectedRiskTier, selectedLifecycle, selectedPriority]);

  const getPriorityColor = (p) => {
    if (p === 'Critical') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (p === 'High') return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          setUserControls(JSON.parse(event.target.result));
          setUploadedFile(file.name);
        } catch (error) {
          alert('Invalid JSON file. Please upload a valid JSON file.');
        }
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
      gaps: gaps,
      criticalGaps: gaps.filter(g => g.priority === 'Critical'),
      highGaps: gaps.filter(g => g.priority === 'High')
    };
  }, [userControls]);

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
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => ({
    total: complianceData.length,
    critical: complianceData.filter(i => i.priority === 'Critical').length,
    highRisk: complianceData.filter(i => i.riskTier === 'High-Risk').length,
    frameworks: frameworks.length
  }), []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  AI Governance Map
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">NIST • ISO 42001 • EU AI Act • OWASP • State Laws</p>
              </div>
            </div>
            <a href="https://ionized-harbor-65d.notion.site/AI-Governance-Map-Rosetta-Stone-2e92994f19fb80f7b04df5658836cb31" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 hover:border-cyan-500/30 transition-all group">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">User Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Controls', value: stats.total, icon: Shield },
              { label: 'Critical Priority', value: stats.critical, icon: AlertCircle },
              { label: 'High-Risk Systems', value: stats.highRisk, icon: TrendingUp },
              { label: 'Frameworks', value: stats.frameworks, icon: Network }
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-2xl font-bold text-cyan-400">{stat.value}</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-sm mb-8 sticky top-2 z-20 shadow-2xl">
          {[
            { id: 'map', icon: Map, label: 'Control Map' },
            { id: 'network', icon: Network, label: 'Cross-Walk' },
            { id: 'gap', icon: BarChart3, label: 'Gap Analysis' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-slate-800 text-cyan-400 shadow-lg shadow-cyan-900/20 border border-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}>
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur-md shadow-xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
                <input type="text" placeholder="Search controls..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder:text-slate-600" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all whitespace-nowrap ${showFilters ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {!selectedFrameworks.includes('all') && <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>}
                </button>
                <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 rounded-lg transition-all">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Frameworks</label>
                    {!selectedFrameworks.includes('all') && (
                      <button onClick={handleResetFilters} className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                        <X className="w-3 h-3"/> Reset All
                      </button>
                    )}
                  </div>
                  <select multiple value={selectedFrameworks} onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedFrameworks(values.includes('all') ? ['all'] : values);
                    }} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500 h-24">
                    <option value="all">All Frameworks</option>
                    {frameworks.map(fw => <option key={fw} value={fw}>{fw}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Risk Tier</label>
                  <select onChange={(e) => setSelectedRiskTier(e.target.value)} value={selectedRiskTier} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500">
                    <option value="all">All Tiers</option>
                    <option value="High-Risk">High-Risk</option>
                    <option value="All Systems">All Systems</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Priority</label>
                  <select onChange={(e) => setSelectedPriority(e.target.value)} value={selectedPriority} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500">
                    <option value="all">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Lifecycle</label>
                  <select onChange={(e) => setSelectedLifecycle(e.target.value)} value={selectedLifecycle} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500">
                    <option value="all">All Stages</option>
                    {lifecycleStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Showing {filteredData.length} of {complianceData.length} Controls
            </div>

            <div className="grid gap-4">
              {filteredData.map((item) => (
                <div key={item.id} className="group bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                  <div onClick={() => {
                      const newSet = new Set(expandedRows);
                      newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
                      setExpandedRows(newSet);
                    }} className="p-5 cursor-pointer">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{item.concept}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(item.priority)}`}>{item.priority}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">{item.riskTier}</span>
                        </div>
                        <p className="text-sm text-slate-400">{item.description}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{item.lifecycle}</span>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 flex-shrink-0 ${expandedRows.has(item.id) ? 'rotate-180 text-cyan-400' : ''}`} />
                    </div>
                  </div>

                  {expandedRows.has(item.id) && (
                    <div className="px-5 pb-5 pt-0 space-y-4 border-t border-slate-800/50 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        {Object.entries(item.mappings).map(([fw, reqs]) => reqs && reqs.length > 0 && (
                          <div key={fw} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors">
                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider">{fw}</div>
                            <div className="space-y-1.5">
                              {reqs.map(r => <div key={r} className="text-sm text-cyan-100/90 pl-2 border-l-2 border-cyan-500/20">{r}</div>)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-slate-950/30 p-3 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider flex items-center gap-2">
                          <CheckCircle className="w-3 h-3" /> Implementation Guidance
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-emerald-500/30 pl-3">{item.implementation}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-1000" />
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2 relative z-10">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Cross-Walk Matrix <span className="text-[10px] text-slate-500 font-normal ml-auto bg-slate-800 px-2 py-1 rounded border border-slate-700">CLICK TO FILTER</span>
                </h3>
                <div className="space-y-2 relative z-10">
                  {frameworks.slice(0, 4).map((fw1, i) => (
                    <div key={fw1} className="flex items-center gap-2">
                      <div className="w-24 text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate text-right">{fw1.split(' ')[0]}</div>
                      <div className="flex gap-1">
                        {frameworks.slice(0, 4).map((fw2, j) => {
                          const overlap = complianceData.filter(item => item.mappings[fw1]?.length > 0 && item.mappings[fw2]?.length > 0).length;
                          const intensity = overlap / complianceData.length;
                          const isSelf = i === j;
                          return (
                            <button key={`${fw1}-${fw2}`} disabled={isSelf} onClick={() => !isSelf && handleMatrixClick(fw1, fw2)} className={`w-12 h-10 rounded transition-all duration-300 flex items-center justify-center text-xs font-bold relative ${isSelf ? 'bg-slate-800/30 text-slate-700 cursor-default' : `bg-cyan-900/${Math.max(20, Math.floor(intensity * 100))} text-cyan-200 border border-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-110 hover:z-20 cursor-pointer`}`}>
                              {isSelf ? '—' : overlap}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md">
                  <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    Risk Tier Distribution
                  </h3>
                  <div className="space-y-4">
                    {['High-Risk', 'All Systems'].map(tier => {
                      const count = complianceData.filter(item => item.riskTier === tier).length;
                      const pct = Math.round((count / complianceData.length) * 100);
                      return (
                        <div key={tier}>
                          <div className="flex justify-between text-xs text-slate-400 mb-1 font-bold tracking-wide">
                            <span>{tier}</span>
                            <span>{count} controls ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${tier === 'High-Risk' ? 'bg-gradient-to-r from-orange-600 to-orange-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md">
                  <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Priority Distribution
                  </h3>
                  <div className="space-y-4">
                    {['Critical', 'High', 'Medium'].map(priority => {
                      const count = complianceData.filter(item => item.priority === priority).length;
                      const pct = Math.round((count / complianceData.length) * 100);
                      return (
                        <div key={priority}>
                          <div className="flex justify-between text-xs text-slate-400 mb-1 font-bold tracking-wide">
                            <span>{priority}</span>
                            <span>{count} controls ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${priority === 'Critical' ? 'bg-gradient-to-r from-purple-600 to-purple-400' : priority === 'High' ? 'bg-gradient-to-r from-orange-600 to-orange-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md">
              <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-400" />
                Framework Coverage Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {frameworks.map(fw => {
                  const controlsWithMapping = complianceData.filter(item => item.mappings[fw] && item.mappings[fw].length > 0);
                  const coverage = Math.round((controlsWithMapping.length / complianceData.length) * 100);
                  return (
                    <div key={fw} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
                      <div className="text-sm font-bold text-slate-300 mb-2">{fw}</div>
                      <div className="text-2xl font-bold text-cyan-400 mb-2">{coverage}%</div>
                      <div className="text-xs text-slate-500">{controlsWithMapping.length} of {complianceData.length} controls</div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                        <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full transition-all duration-1000" style={{ width: `${coverage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gap' && (
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-12 text-center group hover:border-cyan-500/30 transition-colors">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">Upload Your Controls</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">Upload a JSON file of your current controls to identify gaps against best practices.</p>
              <label className="inline-block">
                <span className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-900/20 cursor-pointer transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                  Select JSON File <Upload className="w-4 h-4"/>
                </span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
              {uploadedFile && (
                <div className="mt-6 text-green-400 flex items-center justify-center gap-2 bg-green-900/10 py-2 px-4 rounded-full inline-flex border border-green-500/20">
                  <CheckCircle className="w-4 h-4"/> {uploadedFile}
                </div>
              )}
            </div>

            {gapAnalysis && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="w-6 h-6 text-cyan-400" />
                      <span className="text-3xl font-bold text-cyan-400">{gapAnalysis.coverage}%</span>
                    </div>
                    <div className="text-sm font-medium text-slate-300">Coverage</div>
                    <div className="text-xs text-slate-500 mt-1">{gapAnalysis.implemented} of {complianceData.length} controls</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <AlertCircle className="w-6 h-6 text-purple-400" />
                      <span className="text-3xl font-bold text-purple-400">{gapAnalysis.criticalGaps.length}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-300">Critical Gaps</div>
                    <div className="text-xs text-slate-500 mt-1">High priority items missing</div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-6 h-6 text-orange-400" />
                      <span className="text-3xl font-bold text-orange-400">{gapAnalysis.gaps.length}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-300">Total Gaps</div>
                    <div className="text-xs text-slate-500 mt-1">Controls to implement</div>
                  </div>
                </div>

                {gapAnalysis.gaps.length > 0 && (
                  <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md">
                    <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      Identified Gaps ({gapAnalysis.gaps.length})
                    </h3>
                    <div className="space-y-3">
                      {gapAnalysis.gaps.map(gap => (
                        <div key={gap.id} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80 hover:border-orange-500/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-slate-200">{gap.concept}</h4>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(gap.priority)}`}>
                                  {gap.priority}
                                </span>
                              </div>
                              <p className="text-sm text-slate-400 mb-2">{gap.description}</p>
                              <div className="text-xs text-slate-500 flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                {gap.lifecycle}
                              </div>
                            </div>
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