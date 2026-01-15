import React, { useState, useMemo, useRef } from 'react';
import { Search, Download, Filter, X, ChevronDown, ChevronUp, Network, BarChart3, FileCheck, Upload, Map, Layers, AlertCircle, CheckCircle, Plus, Minus } from 'lucide-react';

const AIGovernancePlatform = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState(['all']);
  const [selectedRiskTier, setSelectedRiskTier] = useState('all');
  const [selectedLifecycle, setSelectedLifecycle] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showFilters, setShowFilters] = useState(true);
  const [userControls, setUserControls] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const frameworks = ['NIST AI RMF', 'ISO/IEC 42001', 'EU AI Act', 'SOC 2 / ISO 27001'];
  
  const complianceData = [
    {
      id: 1,
      concept: "Risk Management System",
      riskTier: "High-Risk",
      lifecycle: "All Stages",
      description: "Systematic approach to identify, assess, and mitigate AI-related risks throughout the system lifecycle",
      mappings: {
        "NIST AI RMF": ["MAP 1.1: Context is established and risks are identified", "MEASURE 2.6: Risk impacts are tracked over time"],
        "ISO/IEC 42001": ["Clause 8.2: Internal audit & risk assessment", "Annex A.8: AI Risk Assessment controls"],
        "EU AI Act": ["Article 9: Risk Management System (Mandatory for High-Risk AI)"],
        "SOC 2 / ISO 27001": ["CC 3.1: Entity specifies objectives to identify risks"]
      },
      evidence: ["AI Risk Register", "Risk Assessment Reports", "Board Meeting Minutes", "Risk Review Logs"],
      implementation: "Maintain a living AI Risk Register with impact tracking, reviewed quarterly by designated oversight committee",
      priority: "Critical"
    },
    {
      id: 2,
      concept: "Human Oversight",
      riskTier: "High-Risk",
      lifecycle: "Deployment, Monitoring",
      description: "Mechanisms ensuring human intervention and control over AI system decisions and operations",
      mappings: {
        "NIST AI RMF": ["GOVERN 2.2: Roles & responsibilities defined", "MANAGE 2.4: Human oversight mechanisms in place"],
        "ISO/IEC 42001": ["Clause 5.3: Org roles, responsibilities & authorities", "Annex B.9: AI System Oversight & human intervention"],
        "EU AI Act": ["Article 14: Human Oversight (Natural persons must oversee High-Risk AI)"],
        "SOC 2 / ISO 27001": ["CC 1.3: Management board oversight of the entity's system"]
      },
      evidence: ["Human-in-the-Loop Procedures", "Oversight Committee Charter", "Decision Review Logs", "Escalation Protocols"],
      implementation: "Establish oversight committee with defined intervention triggers and decision review protocols",
      priority: "Critical"
    },
    {
      id: 3,
      concept: "Data Governance & Quality",
      riskTier: "All Systems",
      lifecycle: "Design, Development",
      description: "Controls for data acquisition, quality assessment, bias detection, and lifecycle management",
      mappings: {
        "NIST AI RMF": ["MAP 2.2: Data characteristics (bias, quality) are understood", "MEASURE 2.2: Data quality is evaluated"],
        "ISO/IEC 42001": ["Annex A.7: Data for AI Systems (Controls for acquisition & quality)", "Clause 8.4: Control of externally provided processes"],
        "EU AI Act": ["Article 10: Data Governance (Training, validation & testing data requirements)"],
        "SOC 2 / ISO 27001": ["CC 4.1: COSO Principle 13: Quality of Information"]
      },
      evidence: ["Data Quality Reports", "Bias Assessment Results", "Data Lineage Documentation", "Vendor Data Agreements"],
      implementation: "Implement data quality scorecards with bias testing for all training datasets, maintain data lineage documentation",
      priority: "High"
    },
    {
      id: 4,
      concept: "Technical Documentation",
      riskTier: "High-Risk",
      lifecycle: "All Stages",
      description: "Comprehensive documentation of AI system design, development, testing, and operational characteristics",
      mappings: {
        "NIST AI RMF": ["GOVERN 3.1: Documentation practices are established", "MANAGE 4.2: System documentation is maintained"],
        "ISO/IEC 42001": ["Clause 7.5: Documented information", "Annex A.4: AI System Lifecycle documentation"],
        "EU AI Act": ["Article 11: Technical Documentation (Must be kept up-to-date)"],
        "SOC 2 / ISO 27001": ["CC 5.2: Policies & procedures are documented and communicated"]
      },
      evidence: ["Model Cards", "System Architecture Diagrams", "Algorithm Documentation", "Change Logs", "Test Reports"],
      implementation: "Create and maintain model cards with architecture diagrams, performance metrics, and limitations documentation",
      priority: "High"
    },
    {
      id: 5,
      concept: "System Monitoring & Logging",
      riskTier: "High-Risk",
      lifecycle: "Deployment, Monitoring",
      description: "Continuous monitoring of AI system performance, detection of anomalies, and comprehensive event logging",
      mappings: {
        "NIST AI RMF": ["MEASURE 2.7: AI system performance is monitored", "MANAGE 3.2: Anomalies are detected and responded to"],
        "ISO/IEC 42001": ["Clause 9.1: Monitoring, measurement, analysis, and evaluation", "Annex A.9: AI System Operation (Logging)"],
        "EU AI Act": ["Article 12: Record-Keeping (Automatic recording of events/logs)"],
        "SOC 2 / ISO 27001": ["CC 7.2: Security events and anomalies are monitored"]
      },
      evidence: ["Monitoring Dashboards", "Performance Metrics Reports", "Incident Logs", "Anomaly Detection Reports"],
      implementation: "Deploy automated monitoring with anomaly detection, maintain logs for minimum 6 months (EU AI Act requirement)",
      priority: "Critical"
    },
    {
      id: 6,
      concept: "Transparency & Explainability",
      riskTier: "High-Risk",
      lifecycle: "Design, Deployment",
      description: "Ability to explain AI system decisions and communicate capabilities/limitations to stakeholders",
      mappings: {
        "NIST AI RMF": ["GOVERN 1.2: AI system capabilities are understood", "MEASURE 3.1: Mechanisms for stakeholder feedback"],
        "ISO/IEC 42001": ["Annex A.10: AI System Transparency", "Clause 7.4: Communication"],
        "EU AI Act": ["Article 13: Transparency obligations for High-Risk AI systems"],
        "SOC 2 / ISO 27001": ["CC 1.4: Entity demonstrates commitment to competence"]
      },
      evidence: ["Explainability Reports", "User Disclosure Statements", "Stakeholder Communications", "Interpretability Analysis"],
      implementation: "Implement SHAP/LIME or similar explainability tools, provide user-facing disclosures about AI usage",
      priority: "High"
    },
    {
      id: 7,
      concept: "Third-Party AI Vendor Management",
      riskTier: "All Systems",
      lifecycle: "All Stages",
      description: "Due diligence, risk assessment, and ongoing oversight of external AI providers and components",
      mappings: {
        "NIST AI RMF": ["MAP 1.5: Risks from third-party entities are understood", "GOVERN 1.5: Processes for third-party entities"],
        "ISO/IEC 42001": ["Clause 8.4: Control of externally provided processes", "Annex A.11: Third-Party AI Relationships"],
        "EU AI Act": ["Article 16: Obligations for providers of High-Risk AI"],
        "SOC 2 / ISO 27001": ["CC 9.2: Vendor and business partner commitments"]
      },
      evidence: ["Vendor Risk Assessments", "Third-Party Audit Reports", "SLA Agreements", "Vendor Security Questionnaires"],
      implementation: "Conduct vendor due diligence including AI-specific security questionnaires, require SOC 2/ISO certifications",
      priority: "High"
    },
    {
      id: 8,
      concept: "Incident Response & Remediation",
      riskTier: "High-Risk",
      lifecycle: "Monitoring",
      description: "Procedures for detecting, responding to, and remediating AI system incidents and failures",
      mappings: {
        "NIST AI RMF": ["MANAGE 4.1: Incidents are documented and managed", "MANAGE 4.3: Responses to incidents are developed"],
        "ISO/IEC 42001": ["Clause 10.1: Nonconformity and corrective action", "Annex A.12: AI Incident Management"],
        "EU AI Act": ["Article 62: Reporting of serious incidents"],
        "SOC 2 / ISO 27001": ["CC 7.3: Entity responds to security incidents"]
      },
      evidence: ["Incident Response Plan", "Post-Incident Reports", "Remediation Tracking", "Stakeholder Notifications"],
      implementation: "Establish AI incident response playbook with defined severity levels and escalation procedures",
      priority: "Critical"
    },
    {
      id: 9,
      concept: "Testing & Validation",
      riskTier: "High-Risk",
      lifecycle: "Development, Deployment",
      description: "Rigorous testing protocols for accuracy, robustness, bias, and safety before deployment",
      mappings: {
        "NIST AI RMF": ["MEASURE 2.3: AI system performance is evaluated", "MEASURE 2.8: Risks are examined and documented"],
        "ISO/IEC 42001": ["Annex A.5: AI System Development & Testing", "Clause 8.1: Operational planning"],
        "EU AI Act": ["Article 15: Accuracy, robustness and cybersecurity"],
        "SOC 2 / ISO 27001": ["CC 8.1: Entity authorizes, designs, and configures systems"]
      },
      evidence: ["Test Plans", "Validation Reports", "Adversarial Testing Results", "Performance Benchmarks"],
      implementation: "Conduct comprehensive testing including adversarial attacks, bias testing, and edge case validation",
      priority: "Critical"
    },
    {
      id: 10,
      concept: "Change Management",
      riskTier: "High-Risk",
      lifecycle: "All Stages",
      description: "Controlled processes for modifications to AI systems including retraining and version control",
      mappings: {
        "NIST AI RMF": ["MANAGE 3.1: AI system changes are managed", "GOVERN 4.1: Organizational teams are responsible for change"],
        "ISO/IEC 42001": ["Clause 8.1: Operational planning and control", "Annex A.6: AI System Changes"],
        "EU AI Act": ["Article 43: Conformity assessment procedures"],
        "SOC 2 / ISO 27001": ["CC 6.3: Entity implements change management processes"]
      },
      evidence: ["Change Request Forms", "Version Control Logs", "Retraining Documentation", "Impact Assessments"],
      implementation: "Implement formal change control with impact analysis for model updates and retraining cycles",
      priority: "High"
    },
    {
      id: 11,
      concept: "Privacy & Data Protection",
      riskTier: "All Systems",
      lifecycle: "All Stages",
      description: "Safeguards for personal data processing, GDPR compliance, and privacy-preserving techniques",
      mappings: {
        "NIST AI RMF": ["MAP 2.3: Privacy and data protection are considered", "GOVERN 5.1: Privacy practices are established"],
        "ISO/IEC 42001": ["Annex A.7: Data for AI Systems (Privacy controls)", "Clause 8.3: Privacy by design"],
        "EU AI Act": ["Recital 41: Consistency with GDPR", "Article 10(5): Personal data processing"],
        "SOC 2 / ISO 27001": ["P1.1: Privacy Notice", "ISO 27701: Privacy extension"]
      },
      evidence: ["Privacy Impact Assessments", "Data Processing Agreements", "Anonymization Reports", "GDPR Compliance Documentation"],
      implementation: "Conduct Privacy Impact Assessments, implement differential privacy or federated learning where applicable",
      priority: "Critical"
    },
    {
      id: 12,
      concept: "Accuracy & Performance Metrics",
      riskTier: "High-Risk",
      lifecycle: "Development, Monitoring",
      description: "Defined performance standards and continuous measurement of accuracy, precision, and reliability",
      mappings: {
        "NIST AI RMF": ["MEASURE 1.1: Performance metrics are defined", "MEASURE 2.1: AI system performance is evaluated"],
        "ISO/IEC 42001": ["Clause 9.1: Monitoring and measurement", "Annex A.9: Performance Monitoring"],
        "EU AI Act": ["Article 15: Accuracy requirements for High-Risk AI"],
        "SOC 2 / ISO 27001": ["CC 4.2: Entity implements control activities"]
      },
      evidence: ["Performance Dashboards", "Accuracy Reports", "Benchmark Testing Results", "Drift Detection Reports"],
      implementation: "Define minimum accuracy thresholds, monitor for model drift, establish retraining triggers",
      priority: "High"
    },
    {
      id: 13,
      concept: "Cybersecurity & Robustness",
      riskTier: "High-Risk",
      lifecycle: "All Stages",
      description: "Protection against adversarial attacks, model poisoning, and security vulnerabilities",
      mappings: {
        "NIST AI RMF": ["MAP 3.1: Security vulnerabilities are identified", "MANAGE 2.3: Cybersecurity measures are implemented"],
        "ISO/IEC 42001": ["Annex A.13: AI System Security", "Clause 8.2: Risk treatment"],
        "EU AI Act": ["Article 15: Cybersecurity requirements"],
        "SOC 2 / ISO 27001": ["CC 6.1: Logical and physical access controls", "ISO 27001 Annex A.8"]
      },
      evidence: ["Penetration Test Reports", "Adversarial Testing Results", "Security Architecture Documentation", "Vulnerability Assessments"],
      implementation: "Conduct adversarial testing, implement model versioning and integrity checks, secure training infrastructure",
      priority: "Critical"
    },
    {
      id: 14,
      concept: "Bias & Fairness Assessment",
      riskTier: "High-Risk",
      lifecycle: "Development, Monitoring",
      description: "Systematic evaluation and mitigation of discriminatory bias across protected characteristics",
      mappings: {
        "NIST AI RMF": ["MEASURE 2.4: Bias is evaluated and documented", "MANAGE 1.1: Bias is managed"],
        "ISO/IEC 42001": ["Annex A.8: AI Risk Assessment (Bias)", "Clause 9.1: Fairness monitoring"],
        "EU AI Act": ["Recital 44: High-risk AI addressing persons", "Article 10(2)(f): Bias mitigation"],
        "SOC 2 / ISO 27001": ["CC 4.1: Quality information"]
      },
      evidence: ["Fairness Audit Reports", "Bias Testing Results", "Demographic Impact Analysis", "Mitigation Strategies Documentation"],
      implementation: "Use fairness metrics (demographic parity, equalized odds), test across protected groups, document mitigation strategies",
      priority: "Critical"
    },
    {
      id: 15,
      concept: "Training & Competence",
      riskTier: "All Systems",
      lifecycle: "All Stages",
      description: "Ensuring personnel have appropriate AI literacy, technical skills, and ethical awareness",
      mappings: {
        "NIST AI RMF": ["GOVERN 2.1: AI system personnel have appropriate skills", "GOVERN 5.2: Training is provided"],
        "ISO/IEC 42001": ["Clause 7.2: Competence", "Clause 7.3: Awareness"],
        "EU AI Act": ["Article 4: AI literacy"],
        "SOC 2 / ISO 27001": ["CC 1.4: Commitment to competence"]
      },
      evidence: ["Training Records", "Competency Assessments", "Certification Documentation", "AI Ethics Training Materials"],
      implementation: "Implement role-based AI training program, require ethics training for all AI team members, track completion",
      priority: "Medium"
    },
    {
      id: 16,
      concept: "AI Safety & Alignment",
      riskTier: "High-Risk",
      lifecycle: "Design, Development",
      description: "Ensuring AI systems behave as intended and aligned with human values and organizational objectives",
      mappings: {
        "NIST AI RMF": ["MAP 1.2: AI system intended use is understood", "GOVERN 1.3: AI system objectives are defined"],
        "ISO/IEC 42001": ["Clause 4.1: Understanding organization context", "Annex A.3: AI System Objectives"],
        "EU AI Act": ["Recital 27: AI systems should be safe"],
        "SOC 2 / ISO 27001": ["CC 2.1: Entity demonstrates commitment to integrity"]
      },
      evidence: ["Safety Test Reports", "Alignment Documentation", "Value Specification Documents", "Red Team Testing Results"],
      implementation: "Conduct red team exercises, implement safety constraints, define clear success criteria aligned with organizational values",
      priority: "Critical"
    },
    {
      id: 17,
      concept: "Accountability & Governance Structure",
      riskTier: "All Systems",
      lifecycle: "All Stages",
      description: "Clear assignment of responsibilities, decision rights, and escalation paths for AI systems",
      mappings: {
        "NIST AI RMF": ["GOVERN 1.1: Legal and regulatory requirements are understood", "GOVERN 2.2: Roles and responsibilities are defined"],
        "ISO/IEC 42001": ["Clause 5.1: Leadership and commitment", "Clause 5.3: Organizational roles"],
        "EU AI Act": ["Article 26: Responsibilities along the AI value chain"],
        "SOC 2 / ISO 27001": ["CC 2.2: Board of directors oversees"]
      },
      evidence: ["RACI Matrix", "Governance Charter", "Decision Authority Documentation", "Accountability Framework"],
      implementation: "Establish AI governance committee with C-level sponsorship, define RACI for all AI lifecycle activities",
      priority: "High"
    },
    {
      id: 18,
      concept: "Appeals & Redress Mechanisms",
      riskTier: "High-Risk",
      lifecycle: "Deployment, Monitoring",
      description: "Processes for individuals to challenge automated decisions and seek human review",
      mappings: {
        "NIST AI RMF": ["MANAGE 2.4: Human oversight mechanisms", "MEASURE 3.1: Mechanisms for stakeholder feedback"],
        "ISO/IEC 42001": ["Clause 10.1: Nonconformity and corrective action", "Annex B.9: Human intervention"],
        "EU AI Act": ["Article 86: Right to explanation and individual redress"],
        "SOC 2 / ISO 27001": ["CC 3.3: Entity considers potential fraudulent reporting"]
      },
      evidence: ["Appeals Process Documentation", "Redress Mechanism Procedures", "Decision Review Logs", "Stakeholder Communication Records"],
      implementation: "Implement appeals workflow with SLAs, provide clear channels for challenging decisions, track resolution times",
      priority: "High"
    },
    {
      id: 19,
      concept: "Environmental Impact & Sustainability",
      riskTier: "All Systems",
      lifecycle: "Design, Development, Deployment",
      description: "Assessment and mitigation of AI systems' energy consumption and environmental footprint",
      mappings: {
        "NIST AI RMF": ["MAP 1.6: Societal and environmental impacts are understood", "GOVERN 1.6: Environmental considerations"],
        "ISO/IEC 42001": ["Clause 4.1: Understanding context (Environmental)", "Annex A.14: Environmental Impact"],
        "EU AI Act": ["Recital 93: Environmental impact considerations"],
        "SOC 2 / ISO 27001": ["ISO 14001 integration: Environmental management"]
      },
      evidence: ["Carbon Footprint Reports", "Energy Consumption Metrics", "Sustainability Assessments", "Green Computing Practices Documentation"],
      implementation: "Measure and report model training energy consumption, optimize for efficiency, use renewable energy where possible",
      priority: "Medium"
    },
    {
      id: 20,
      concept: "Continuous Improvement & Auditing",
      riskTier: "All Systems",
      lifecycle: "All Stages",
      description: "Regular audits, performance reviews, and iterative improvements to AI governance practices",
      mappings: {
        "NIST AI RMF": ["MEASURE 4.1: AI system is continually monitored", "GOVERN 4.3: Continuous improvement processes"],
        "ISO/IEC 42001": ["Clause 10.2: Continual improvement", "Clause 9.2: Internal audit"],
        "EU AI Act": ["Article 72: Post-market monitoring"],
        "SOC 2 / ISO 27001": ["CC 5.3: Management reviews objectives", "Clause 9.3: Management review"]
      },
      evidence: ["Audit Reports", "Continuous Improvement Plans", "Performance Review Records", "Corrective Action Logs"],
      implementation: "Conduct quarterly governance reviews, annual third-party audits, maintain continuous improvement backlog",
      priority: "High"
    }
  ];

  const filteredData = useMemo(() => {
    return complianceData.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(item.mappings).flat().some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFramework = selectedFrameworks.includes('all') || 
        selectedFrameworks.some(fw => item.mappings[fw] && item.mappings[fw].length > 0);
      
      const matchesRisk = selectedRiskTier === 'all' || item.riskTier === selectedRiskTier;
      const matchesLifecycle = selectedLifecycle === 'all' || item.lifecycle.includes(selectedLifecycle);
      
      return matchesSearch && matchesFramework && matchesRisk && matchesLifecycle;
    });
  }, [searchTerm, selectedFrameworks, selectedRiskTier, selectedLifecycle]);

  const toggleFramework = (fw) => {
    if (fw === 'all') {
      setSelectedFrameworks(['all']);
    } else {
      const newSelection = selectedFrameworks.includes(fw)
        ? selectedFrameworks.filter(f => f !== fw)
        : [...selectedFrameworks.filter(f => f !== 'all'), fw];
      setSelectedFrameworks(newSelection.length === 0 ? ['all'] : newSelection);
    }
  };

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const exportToCSV = () => {
    const headers = ['Concept', 'Risk Tier', 'Lifecycle', 'Priority', 'Description', ...frameworks, 'Evidence', 'Implementation'];
    const rows = filteredData.map(item => [
      item.concept,
      item.riskTier,
      item.lifecycle,
      item.priority,
      item.description,
      ...frameworks.map(fw => (item.mappings[fw] || []).join('; ')),
      item.evidence.join('; '),
      item.implementation
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-governance-map.csv';
    a.click();
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AI Governance Compliance Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1e293b; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
          h2 { color: #475569; margin-top: 30px; }
          .control { margin-bottom: 30px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; page-break-inside: avoid; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-right: 8px; }
          .high-risk { background: #fee2e2; color: #991b1b; }
          .all-systems { background: #dbeafe; color: #1e40af; }
          .priority-critical { background: #fecaca; color: #991b1b; }
          .priority-high { background: #fed7aa; color: #9a3412; }
          .priority-medium { background: #fef3c7; color: #92400e; }
          .mapping { background: #f1f5f9; padding: 10px; margin: 10px 0; border-radius: 4px; }
          .evidence { color: #059669; font-size: 14px; }
          @media print { .control { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>AI Governance Compliance Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Total Controls:</strong> ${filteredData.length}</p>
        <p><strong>Frameworks:</strong> NIST AI RMF, ISO/IEC 42001, EU AI Act, SOC 2 / ISO 27001</p>
        <hr/>
        ${filteredData.map(item => `
          <div class="control">
            <h2>${item.concept}</h2>
            <div>
              <span class="badge ${item.riskTier === 'High-Risk' ? 'high-risk' : 'all-systems'}">${item.riskTier}</span>
              <span class="badge priority-${item.priority.toLowerCase()}">${item.priority} Priority</span>
            </div>
            <p><strong>Lifecycle:</strong> ${item.lifecycle}</p>
            <p>${item.description}</p>
            <h3>Framework Mappings</h3>
            ${Object.entries(item.mappings).map(([fw, reqs]) => `
              <div class="mapping">
                <strong>${fw}:</strong>
                <ul>${reqs.map(r => `<li>${r}</li>`).join('')}</ul>
              </div>
            `).join('')}
            <h3>Required Evidence</h3>
            <p class="evidence">${item.evidence.join(', ')}</p>
            <h3>Implementation Guidance</h3>
            <p>${item.implementation}</p>
          </div>
        `).join('')}
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const getRiskColor = (tier) => {
    const colors = {
      "High-Risk": "bg-red-100 text-red-800 border-red-300",
      "All Systems": "bg-blue-100 text-blue-800 border-blue-300"
    };
    return colors[tier] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      "Critical": "bg-red-50 text-red-700 border-red-200",
      "High": "bg-orange-50 text-orange-700 border-orange-200",
      "Medium": "bg-yellow-50 text-yellow-700 border-yellow-200"
    };
    return colors[priority] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  // Gap Analysis Logic
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const controls = JSON.parse(event.target.result);
          setUserControls(controls);
          setUploadedFile(file.name);
        } catch (error) {
          alert('Invalid JSON file. Please upload a valid controls file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const gapAnalysis = useMemo(() => {
    if (userControls.length === 0) return null;
    
    const implementedConcepts = userControls.map(c => c.concept.toLowerCase());
    const gaps = complianceData.filter(item => 
      !implementedConcepts.includes(item.concept.toLowerCase())
    );
    
    const coverage = ((complianceData.length - gaps.length) / complianceData.length * 100).toFixed(1);
    
    return {
      totalControls: complianceData.length,
      implemented: complianceData.length - gaps.length,
      gaps: gaps,
      coverage: coverage
    };
  }, [userControls]);

  // Network Graph Component (Simplified visualization)
  const NetworkGraph = () => {
    const [selectedNode, setSelectedNode] = useState(null);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Framework Relationship Network</h2>
        <p className="text-slate-600 mb-6">Visual representation of how compliance controls interconnect across frameworks</p>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Framework Overlap Matrix */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Framework Overlap Matrix</h3>
            <div className="space-y-2">
              {frameworks.map((fw1, i) => (
                <div key={fw1} className="flex items-center gap-2">
                  <div className="w-40 text-sm font-medium text-slate-700 truncate">{fw1}</div>
                  {frameworks.map((fw2, j) => {
                    const overlap = complianceData.filter(item => 
                      item.mappings[fw1]?.length > 0 && item.mappings[fw2]?.length > 0
                    ).length;
                    const intensity = overlap / complianceData.length;
                    return (
                      <div
                        key={fw2}
                        className="w-12 h-12 rounded flex items-center justify-center text-xs font-bold border"
                        style={{
                          backgroundColor: i === j ? '#e2e8f0' : `rgba(59, 130, 246, ${intensity})`,
                          color: intensity > 0.5 || i === j ? '#1e293b' : '#64748b'
                        }}
                        title={`${fw1} ∩ ${fw2}: ${overlap} controls`}
                      >
                        {i === j ? '—' : overlap}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Control Distribution */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Controls by Risk Tier</h3>
            <div className="space-y-4">
              {['High-Risk', 'All Systems'].map(tier => {
                const count = complianceData.filter(item => item.riskTier === tier).length;
                const percentage = (count / complianceData.length * 100).toFixed(1);
                return (
                  <div key={tier}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{tier}</span>
                      <span className="text-sm text-slate-600">{count} controls ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${tier === 'High-Risk' ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 className="font-semibold text-slate-900 mt-6 mb-4">Controls by Priority</h3>
            <div className="space-y-4">
              {['Critical', 'High', 'Medium'].map(priority => {
                const count = complianceData.filter(item => item.priority === priority).length;
                const percentage = (count / complianceData.length * 100).toFixed(1);
                return (
                  <div key={priority}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{priority}</span>
                      <span className="text-sm text-slate-600">{count} controls ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          priority === 'Critical' ? 'bg-red-500' : 
                          priority === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lifecycle Stage Distribution */}
        <div className="mt-6">
          <h3 className="font-semibold text-slate-900 mb-4">Controls by Lifecycle Stage</h3>
          <div className="grid grid-cols-5 gap-4">
            {['All Stages', 'Design', 'Development', 'Deployment', 'Monitoring'].map(stage => {
              const count = complianceData.filter(item => item.lifecycle.includes(stage)).length;
              return (
                <div key={stage} className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center">
                  <div className="text-2xl font-bold text-slate-900">{count}</div>
                  <div className="text-sm text-slate-600 mt-1">{stage}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Framework Coverage Summary */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">Coverage Insights</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {frameworks.map(fw => {
              const controlsWithFw = complianceData.filter(item => item.mappings[fw]?.length > 0).length;
              const totalReqs = complianceData.reduce((sum, item) => sum + (item.mappings[fw]?.length || 0), 0);
              return (
                <div key={fw} className="flex justify-between">
                  <span className="text-blue-900 font-medium">{fw}:</span>
                  <span className="text-blue-700">{controlsWithFw} controls / {totalReqs} requirements</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Gap Analysis Component
  const GapAnalysisView = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Gap Analysis Tool</h2>
          <p className="text-slate-600 mb-6">
            Upload your existing controls (JSON format) to identify coverage gaps and compliance priorities
          </p>

          {/* Upload Section */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-6">
            <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <label className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">Upload controls file</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-slate-500 mt-2">JSON file with array of controls (e.g., [{`"concept": "Risk Management System"`}])</p>
            {uploadedFile && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Uploaded: {uploadedFile}</span>
              </div>
            )}
          </div>

          {/* Sample JSON Template */}
          <details className="mb-6">
            <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
              Show sample JSON format
            </summary>
            <pre className="mt-2 bg-slate-50 p-4 rounded-lg text-xs overflow-x-auto border border-slate-200">
{`[
  {
    "concept": "Risk Management System",
    "status": "implemented"
  },
  {
    "concept": "Human Oversight",
    "status": "implemented"
  },
  {
    "concept": "Data Governance & Quality",
    "status": "partial"
  }
]`}
            </pre>
          </details>

          {/* Gap Analysis Results */}
          {gapAnalysis && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-900">{gapAnalysis.coverage}%</div>
                  <div className="text-sm text-blue-700 mt-1">Overall Coverage</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-3xl font-bold text-green-900">{gapAnalysis.implemented}</div>
                  <div className="text-sm text-green-700 mt-1">Implemented</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-3xl font-bold text-red-900">{gapAnalysis.gaps.length}</div>
                  <div className="text-sm text-red-700 mt-1">Gaps Found</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-3xl font-bold text-slate-900">{gapAnalysis.totalControls}</div>
                  <div className="text-sm text-slate-700 mt-1">Total Controls</div>
                </div>
              </div>

              {/* Coverage Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Compliance Progress</span>
                  <span className="text-sm text-slate-600">{gapAnalysis.implemented} of {gapAnalysis.totalControls} controls</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${gapAnalysis.coverage}%` }}
                  />
                </div>
              </div>

              {/* Priority Gaps */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Priority Gaps to Address</h3>
                <div className="space-y-3">
                  {gapAnalysis.gaps
                    .sort((a, b) => {
                      const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2 };
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    })
                    .map(gap => (
                      <div key={gap.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-slate-900">{gap.concept}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(gap.priority)}`}>
                                {gap.priority}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(gap.riskTier)}`}>
                                {gap.riskTier}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{gap.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.keys(gap.mappings).map(fw => (
                                gap.mappings[fw]?.length > 0 && (
                                  <span key={fw} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200">
                                    {fw}
                                  </span>
                                )
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Export Gap Report */}
              <button
                onClick={() => {
                  const report = {
                    generatedDate: new Date().toISOString(),
                    coverage: gapAnalysis.coverage,
                    implemented: gapAnalysis.implemented,
                    totalControls: gapAnalysis.totalControls,
                    gaps: gapAnalysis.gaps.map(g => ({
                      concept: g.concept,
                      priority: g.priority,
                      riskTier: g.riskTier,
                      frameworks: Object.keys(g.mappings).filter(fw => g.mappings[fw]?.length > 0)
                    }))
                  };
                  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'gap-analysis-report.json';
                  a.click();
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Export Gap Analysis Report
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main Compliance Map View
  const ComplianceMapView = () => {
    return (
      <div className="space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{complianceData.length}</div>
            <div className="text-sm text-slate-600">Total Controls</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{filteredData.length}</div>
            <div className="text-sm text-slate-600">Matching Filters</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">4</div>
            <div className="text-sm text-slate-600">Frameworks</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">120+</div>
            <div className="text-sm text-slate-600">Mapped Requirements</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search controls, requirements, or concepts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Frameworks</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedFrameworks.includes('all')}
                      onChange={() => toggleFramework('all')}
                      className="rounded"
                    />
                    All Frameworks
                  </label>
                  {frameworks.map(fw => (
                    <label key={fw} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedFrameworks.includes(fw)}
                        onChange={() => toggleFramework(fw)}
                        className="rounded"
                      />
                      {fw}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Risk Tier</label>
                <select
                  value={selectedRiskTier}
                  onChange={(e) => setSelectedRiskTier(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Tiers</option>
                  <option value="High-Risk">High-Risk</option>
                  <option value="All Systems">All Systems</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lifecycle Stage</label>
                <select
                  value={selectedLifecycle}
                  onChange={(e) => setSelectedLifecycle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Stages</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Deployment">Deployment</option>
                  <option value="Monitoring">Monitoring</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredData.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div 
                className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleRow(item.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">{item.concept}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(item.riskTier)}`}>
                        {item.riskTier}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                        {item.lifecycle}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(item.mappings).map(fw => (
                        item.mappings[fw] && item.mappings[fw].length > 0 && (
                          <span key={fw} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-200">
                            {fw}: {item.mappings[fw].length} requirements
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                  <button className="ml-4 text-slate-400 hover:text-slate-600">
                    {expandedRows.has(item.id) ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
              </div>

              {expandedRows.has(item.id) && (
                <div className="border-t border-slate-200 bg-slate-50 p-6">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Framework Mappings */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Framework Mappings</h4>
                      <div className="space-y-3">
                        {Object.entries(item.mappings).map(([fw, reqs]) => (
                          reqs && reqs.length > 0 && (
                            <div key={fw} className="bg-white p-4 rounded-lg border border-slate-200">
                              <div className="font-medium text-slate-900 mb-2">{fw}</div>
                              <ul className="space-y-1 text-sm text-slate-700">
                                {reqs.map((req, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Evidence */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Required Evidence</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.evidence.map((ev, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Implementation Guidance */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Implementation Guidance</h4>
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-slate-700 text-sm leading-relaxed">{item.implementation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <div className="text-slate-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No results found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">AI Governance Platform</h1>
          <p className="text-slate-600 text-lg">Complete compliance suite for AI systems</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Map className="w-4 h-4" />
            Compliance Map
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'network'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Network className="w-4 h-4" />
            Network View
          </button>
          <button
            onClick={() => setActiveTab('gap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'gap'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Gap Analysis
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'map' && <ComplianceMapView />}
        {activeTab === 'network' && <NetworkGraph />}
        {activeTab === 'gap' && <GapAnalysisView />}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Last updated: January 2026 | Framework versions: NIST AI RMF 1.0, ISO/IEC 42001:2023, EU AI Act (2024), SOC 2 (2017) / ISO 27001:2022</p>
          <p className="mt-2">This tool is for reference only. Always consult official framework documentation and legal counsel.</p>
        </div>
      </div>
    </div>
  );
};

export default AIGovernancePlatform;