import React, { useState, useMemo } from 'react';
import { 
  Map, // Added this import to fix your blank page issue
  Search, Filter, ChevronDown, CheckCircle, Shield, Activity, Zap, 
  TrendingUp, Clock, FileText, Printer, Lock, AlertTriangle, Globe, 
  Network, BarChart3, Upload, Save, ArrowRight, Download, X, AlertCircle 
} from 'lucide-react';

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

  // --- THE MASTER LIST: 30 VERIFIED FRAMEWORKS (2025 EDITION) ---
  const frameworks = [
    // 1. THE BIG 5 (Core AI)
    'NIST AI RMF 1.0', 
    'ISO/IEC 42001 (AIMS)', 
    'EU AI Act (Final)', 
    'OECD AI Principles', 
    'Singapore GenAI FW', // Updated to 2024 GenAI Framework

    // 2. SECURITY & DEFENSE
    'OWASP Top 10 LLM',
    'MITRE ATLAS',
    'NIST CSF 2.0',       // Updated to v2.0
    'Google SAIF',
    'CSA AI Safety',

    // 3. PRIVACY & DATA
    'GDPR',
    'CCPA / CPRA',
    'ISO/IEC 27001',
    'NIST Privacy FW',
    'IEEE 7000',

    // 4. NATIONAL REGS
    'Canada AIDA',
    'US EO 14110',
    'China GenAI Measures',
    'UK AI Strategy',
    'Japan AI Guidelines', // Updated to 2024 Business Guidelines
    'Brazil Bill 2338',
    'Australia Ethics',

    // 5. SECTOR SPECIFIC
    'US Banking (SR 11-7)',
    'FDA AI/ML (Health)',
    'NYC Law 144 (HR)',
    'UNECE (Automotive)',

    // 6. EMERGING & ETHICS
    'NHID-Clinical',      // Your Standard
    'Montreal Declaration',
    'Microsoft RAI v2',
    'UNESCO Ethics'
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

  // DATA: Mapped to Key Standards + NHID Clinical
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
    
    // --- NEW NHID-CLINICAL CONTROLS (Solving Dr. Montesano's Problem) ---
    { 
      id: 17, 
      concept: "Pre-Interaction Disclosure", 
      riskTier: "High-Risk", 
      priority: "Critical", 
      lifecycle: "Deployment",
      description: "AI must disclose non-human status BEFORE user data is collected.", 
      mappings: { "NHID-Clinical": ["Rule 1.1"], "EU AI Act (Final)": ["Article 50"] }, 
      implementation: "Audio/Text banner: 'I am an AI assistant' must play before prompt." 
    },
    { 
      id: 18, 
      concept: "Zero-Loop Escalation", 
      riskTier: "High-Risk", 
      priority: "Critical", 
      lifecycle: "Monitoring",
      description: "Mandatory human hand-off if user intent is unresolved after 1 turn.", 
      mappings: { "NHID-Clinical": ["Rule 2.4"], "US Banking (SR 11-7)": ["Complaint Mgmt"] }, 
      implementation: "If confidence < 90% or user repeats query, route to human immediately." 
    },
    { 
      id: 19, 
      concept: "The Turing Boundary", 
      riskTier: "GenAI", 
      priority: "High", 
      lifecycle: "Design",
      description: "Prohibition of deceptive human-like mimicry (fake breathing, typing sounds).", 
      mappings: { "NHID-Clinical": ["Rule 3.0"], "OECD Principles": ["Transparency"] }, 
      implementation: "Remove synthetic 'human' artifacts from voice/text generation." 
    }
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

  const handleMatrixClick = (fw1, fw2) => {
    setSelectedFrameworks([fw1, fw2]);
    setSearchTerm('');
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

  const exportToCSV = () => {
    const headers = ['Concept', 'Risk Tier', 'Priority', 'Maturity', 'Remediation'];
    const rows = complianceData.map(item => [
      item.concept, 
      item.riskTier, 
      item.priority, 
      getMaturity(item.id), 
      getRemediation(item.id)
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
      const matchesFramework = selectedFrameworks.includes('all') || selectedFrameworks.every(fw => item.mappings[fw]);
      const matchesRisk = selectedRiskTier === 'all' || item.riskTier === selectedRiskTier;
      const matchesLifecycle = selectedLifecycle === 'all' || item.lifecycle === selectedLifecycle || item.lifecycle === 'All Stages';
      const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
      
      return matchesSearch && matchesFramework && matchesRisk && matchesLifecycle && matchesPriority;
    });
  }, [searchTerm, selectedFrameworks, selectedRiskTier, selectedLifecycle, selectedPriority]);

  const getPriorityColor =