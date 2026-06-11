import React, { useState, useMemo, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Search, ChevronDown, Shield, Activity, TrendingUp, FileText,
  Globe, Network, BarChart3, Save, RotateCcw, Download,
  Filter, Zap, Radio, ArrowLeft, CheckCircle2, AlertTriangle,
  Lock, Eye, Server, Database, Users, GitBranch, Cpu, Link2,
  Bug, ClipboardCheck, UserCheck, Key, HardDrive, Shuffle, Bell
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CCM_DOMAINS = ['A&A','AIS','BCR','CCC','CEK','DCS','DSP','GRC','HRS','IAM','IPY','I&S','LOG','SEF','STA','TVM','UEM'];

const complianceData = [
  {
    id: 1, code: 'CTRL-GRC-001', concept: 'AI Governance Board & Charter', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'GRC',
    description: 'Establish a cross-functional AI Governance Board with documented charter, roles, and decision rights over AI system deployment and oversight.',
    mappings: { 'NIST AI RMF': ['GOV 1.1', 'GOV 1.2'], 'ISO/IEC 42001': ['5.1', '5.3'], 'EU AI Act': ['Art 4', 'Art 26'] },
    indicator: { name: 'Board Meeting Cadence & Quorum Rate', method: 'Meetings held / scheduled with quorum', slo: '≥90% quorum on monthly cadence' },
    implementation: 'Document charter with mandate, membership (CISO, CLO, CPO, business leads), voting thresholds, and escalation paths. Publish minutes within 5 business days.'
  },
  {
    id: 2, code: 'CTRL-GRC-002', concept: 'AI Risk Management Program', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'GRC',
    description: 'Systematic program to identify, assess, treat, and monitor AI-related risks aligned to enterprise risk appetite.',
    mappings: { 'NIST AI RMF': ['MAP 1.1', 'MAP 2.1', 'MANAGE 1.1'], 'ISO/IEC 42001': ['8.2', '8.4'], 'EU AI Act': ['Art 9'] },
    indicator: { name: 'Open Risk Finding Resolution Rate', method: 'Risks closed / total identified per cycle', slo: '≥90% resolved within 30 days of target date' },
    implementation: 'Maintain AI Risk Register with threat, likelihood, impact, owner, and remediation deadline. Conduct quarterly reviews. Escalate critical findings to Board.'
  },
  {
    id: 3, code: 'CTRL-GRC-003', concept: 'AI Policy & Standards Framework', riskTier: 'All Systems', priority: 'High', ccmDomain: 'GRC',
    description: 'Authoritative policy hierarchy governing acceptable AI use, prohibited applications, and mandatory technical standards.',
    mappings: { 'NIST AI RMF': ['GOV 1.3', 'GOV 1.4'], 'ISO/IEC 42001': ['5.2', '7.5'], 'EU AI Act': ['Art 4'] },
    indicator: { name: 'Policy Coverage & Review Rate', method: 'Policies current (≤12 months) / total active policies', slo: '100% of policies reviewed annually' },
    implementation: 'Publish Acceptable Use Policy, Prohibited AI Use List, Data Governance for AI Standard, and Model Risk Standard. Review annually or after major regulatory updates.'
  },
  {
    id: 4, code: 'CTRL-GRC-004', concept: 'AI Compliance Obligations Tracker', riskTier: 'All Systems', priority: 'High', ccmDomain: 'GRC',
    description: 'Centralized register mapping applicable legal and regulatory obligations (EU AI Act, GDPR, sector rules) to internal controls.',
    mappings: { 'NIST AI RMF': ['GOV 4.1'], 'ISO/IEC 42001': ['6.1.1', '9.3'], 'EU AI Act': ['Art 16', 'Art 49'] },
    indicator: { name: 'Obligations Mapped to Controls %', method: 'Obligations with ≥1 mapped control / total obligations', slo: '100%' },
    implementation: 'Maintain register in GRC platform. Tag each obligation with jurisdiction, effective date, control owners, and evidence cadence. Trigger gap analysis on new regulation.'
  },
  {
    id: 5, code: 'CTRL-DSP-001', concept: 'AI Training Data Governance', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'DSP',
    description: 'Formal data lineage, quality, and consent controls for datasets used in AI model training and fine-tuning.',
    mappings: { 'NIST AI RMF': ['MAP 2.2', 'MAP 3.5'], 'ISO/IEC 42001': ['8.3', '8.6'], 'EU AI Act': ['Art 10'] },
    indicator: { name: 'Training Dataset Documentation Coverage', method: 'Datasets with complete data cards / total training datasets', slo: '100% before model release' },
    implementation: 'Require data cards for all training datasets covering source, collection method, known biases, consent basis, and retention period. Scan for PII before ingestion.'
  },
  {
    id: 6, code: 'CTRL-DSP-002', concept: 'Personal Data Minimization for AI', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'DSP',
    description: 'Enforce data minimization, purpose limitation, and storage restriction for personal data processed in AI pipelines.',
    mappings: { 'NIST AI RMF': ['MAP 2.2'], 'ISO/IEC 42001': ['8.3'], 'EU AI Act': ['Art 10'], 'GDPR': ['Art 5(1)(b)(c)(e)'] },
    indicator: { name: 'PII Retention Policy Compliance Rate', method: 'AI datasets within retention limits / total datasets', slo: '100%' },
    implementation: 'Apply automated PII scanning to training data pipelines. Enforce retention schedules via data catalog. Document legal basis for each personal data use in AI.'
  },
  {
    id: 7, code: 'CTRL-IAM-001', concept: 'AI System Access Controls', riskTier: 'All Systems', priority: 'Critical', ccmDomain: 'IAM',
    description: 'Role-based access controls (RBAC) enforcing least privilege for AI model endpoints, training infrastructure, and MLOps pipelines.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['IAM-01', 'IAM-02'] },
    indicator: { name: 'Privileged Access Review Completion Rate', method: 'Accounts reviewed on schedule / total privileged accounts', slo: '100% quarterly' },
    implementation: 'Implement RBAC with model-owner, reviewer, deployer, and read-only roles. Enforce MFA on all privileged AI system access. Quarterly access recertification.'
  },
  {
    id: 8, code: 'CTRL-IAM-002', concept: 'Non-Human Identity Governance for AI Agents', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'IAM',
    description: 'Lifecycle management of service accounts, API keys, and machine identities used by AI agents and automated pipelines.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4'], 'ISO/IEC 42001': ['8.5'], 'EU AI Act': ['Art 17'] },
    indicator: { name: 'Orphaned Machine Identity Rate', method: 'Active machine identities with no owner / total machine identities', slo: '<1%' },
    implementation: 'Register all AI agent identities in PAM solution. Rotate API keys every 90 days. Automatically disable identities when agent is decommissioned.'
  },
  {
    id: 9, code: 'CTRL-LOG-001', concept: 'AI Activity Logging & Traceability', riskTier: 'All Systems', priority: 'High', ccmDomain: 'LOG',
    description: 'Comprehensive, tamper-evident audit logs for AI model inference requests, training runs, and configuration changes.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.5', 'MANAGE 2.2'], 'ISO/IEC 42001': ['9.1'], 'EU AI Act': ['Art 12', 'Art 19'] },
    indicator: { name: 'Audit Log Coverage Rate', method: 'AI systems with complete audit logs / total production AI systems', slo: '100%' },
    implementation: 'Configure structured logging for all inference calls (inputs, outputs, model version, user/session). Retain logs for minimum 3 years. Protect with WORM storage.'
  },
  {
    id: 10, code: 'CTRL-LOG-002', concept: 'AI Performance & Drift Monitoring', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'LOG',
    description: 'Continuous monitoring of model performance metrics and statistical drift indicators with automated alerting thresholds.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.5', 'MEASURE 2.9'], 'ISO/IEC 42001': ['9.1'], 'EU AI Act': ['Art 9', 'Art 72'] },
    indicator: { name: 'Model Drift Alert Response Time', method: 'Time from drift alert to acknowledged investigation', slo: '<4 hours for critical, <24 hours for high' },
    implementation: 'Deploy monitoring for input distribution shift, prediction drift, and performance degradation. Set automated SLO breach alerts. Trigger re-evaluation workflow on threshold breach.'
  },
  {
    id: 11, code: 'CTRL-STA-001', concept: 'AI Third-Party & Supplier Oversight', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'STA',
    description: 'Due diligence and contractual controls for AI vendors, foundation model providers, and data suppliers.',
    mappings: { 'NIST AI RMF': ['GOV 6.1', 'GOV 6.2'], 'ISO/IEC 42001': ['8.6'], 'EU AI Act': ['Art 25', 'Art 28'] },
    indicator: { name: 'AI Vendor Risk Assessment Coverage', method: 'Critical AI vendors with completed risk assessments / total critical vendors', slo: '100% annually' },
    implementation: 'Conduct AI-specific vendor risk assessments. Require SLAs covering model update notifications, bias testing results, and security incident disclosure within 48 hours.'
  },
  {
    id: 12, code: 'CTRL-STA-002', concept: 'AI Model Provenance & Documentation', riskTier: 'All Systems', priority: 'High', ccmDomain: 'STA',
    description: 'Model cards and technical documentation capturing architecture, training data, evaluation results, and known limitations for all production AI models.',
    mappings: { 'NIST AI RMF': ['GOV 1.6', 'MEASURE 2.10'], 'ISO/IEC 42001': ['8.3', '8.4'], 'EU AI Act': ['Art 11', 'Ann IV'] },
    indicator: { name: 'Model Card Completeness Rate', method: 'Production models with approved model cards / total production models', slo: '100%' },
    implementation: 'Mandate model cards for all production deployments. Include: intended use, out-of-scope uses, evaluation benchmarks, fairness metrics, and contact for reporting issues.'
  },
  {
    id: 13, code: 'CTRL-STA-003', concept: 'AI System Disclosure & Transparency Notice', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'STA',
    description: 'User-facing disclosure that AI is involved in decisions or content generation, consistent with regulatory transparency requirements.',
    mappings: { 'NIST AI RMF': ['GOV 5.2'], 'ISO/IEC 42001': ['8.7'], 'EU AI Act': ['Art 50', 'Art 52'] },
    indicator: { name: 'AI Disclosure Implementation Rate', method: 'User-facing AI touchpoints with disclosure / total touchpoints', slo: '100%' },
    implementation: 'Display plain-language AI disclosure at point of interaction. For GPAI-generated content include labeling. For chatbots, disclose AI nature at session start.'
  },
  {
    id: 14, code: 'CTRL-TVM-001', concept: 'AI Adversarial Testing & Red-Teaming', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'TVM',
    description: 'Structured adversarial testing program including red-teaming exercises targeting prompt injection, jailbreaks, model extraction, and harmful output generation.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.6', 'MANAGE 2.2'], 'ISO/IEC 42001': ['8.4'], 'EU AI Act': ['Art 9', 'Art 55'] },
    indicator: { name: 'Pre-Release Red-Team Coverage Rate', method: 'High-risk AI systems red-teamed before deployment / total high-risk deployments', slo: '100%' },
    implementation: 'Conduct structured red-team exercises before each high-risk system deployment. Document attack surface, test scenarios, findings, and mitigations. Track remediation to closure.'
  },
  {
    id: 15, code: 'CTRL-TVM-002', concept: 'AI Model Vulnerability Assessment', riskTier: 'All Systems', priority: 'High', ccmDomain: 'TVM',
    description: 'Periodic assessment of AI model vulnerabilities including membership inference, model inversion, poisoning susceptibility, and supply chain risks in dependencies.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.6'], 'ISO/IEC 42001': ['8.4'], 'CCM': ['TVM-01', 'TVM-02'] },
    indicator: { name: 'Critical Vulnerability Remediation Rate', method: 'Critical AI vulns remediated within SLA / total critical vulns', slo: '100% within 30 days' },
    implementation: 'Run AI-specific vulnerability scans quarterly. Include dependency scanning of ML frameworks and model serving infrastructure. Track CVEs for all model serving libraries.'
  },
  {
    id: 16, code: 'CTRL-AA-001', concept: 'AI Internal Audit Program', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'A&A',
    description: 'Annual internal audit program verifying AI governance controls, model risk management practices, and regulatory compliance posture.',
    mappings: { 'NIST AI RMF': ['GOV 1.7'], 'ISO/IEC 42001': ['9.2'], 'EU AI Act': ['Art 17', 'Art 61'] },
    indicator: { name: 'Audit Finding Remediation Rate', method: 'High/critical audit findings closed on time / total high/critical findings', slo: '≥95% within agreed remediation date' },
    implementation: 'Scope annual AI audit to cover governance structure, model risk, data governance, and incident history. Issue findings with risk ratings. Track remediation through to closure.'
  },
  {
    id: 17, code: 'CTRL-AA-002', concept: 'AI Third-Party Audit & Attestation', riskTier: 'High-Risk', priority: 'Medium', ccmDomain: 'A&A',
    description: 'Independent external assessment or attestation of AI system controls, particularly for high-risk systems subject to regulatory scrutiny.',
    mappings: { 'NIST AI RMF': ['GOV 1.7'], 'ISO/IEC 42001': ['9.2'], 'EU AI Act': ['Art 43', 'Art 44'] },
    indicator: { name: 'External Attestation Currency', method: 'High-risk AI systems with current (≤12 month) external attestation / total', slo: '100% for unacceptable/high-risk systems' },
    implementation: 'Engage accredited conformity assessment body for EU AI Act high-risk system certifications. Schedule external penetration tests and model audit annually.'
  },
  {
    id: 18, code: 'CTRL-HRS-001', concept: 'Human Override & Escalation Protocols', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'HRS',
    description: 'Defined and tested mechanisms for humans to monitor, intervene in, override, or shut down AI system operations without undue delay.',
    mappings: { 'NIST AI RMF': ['GOV 2.2', 'MANAGE 4.1'], 'ISO/IEC 42001': ['8.9'], 'EU AI Act': ['Art 9', 'Art 14'] },
    indicator: { name: 'Override Protocol Test Completion Rate', method: 'Scheduled override drills completed / planned drills', slo: '100% semi-annually' },
    implementation: 'Document override procedures per AI system. Implement kill-switch or circuit-breaker pattern for high-risk systems. Test override controls in staging semi-annually.'
  },
  {
    id: 19, code: 'CTRL-HRS-002', concept: 'AI Workforce Competency & Ethics Training', riskTier: 'All Systems', priority: 'High', ccmDomain: 'HRS',
    description: 'Role-based AI literacy, ethics, and governance training for all employees involved in AI development, deployment, or oversight.',
    mappings: { 'NIST AI RMF': ['GOV 3.1', 'GOV 3.2'], 'ISO/IEC 42001': ['7.2', '7.3'], 'EU AI Act': ['Art 4'] },
    indicator: { name: 'AI Training Completion Rate', method: 'Staff in AI roles with current training certification / total staff in AI roles', slo: '≥95% annually' },
    implementation: 'Develop role-tiered curriculum: AI Literacy (all staff), AI Ethics & Governance (practitioners), Model Risk (validators). Require annual recertification. Track in LMS.'
  },
  {
    id: 20, code: 'CTRL-AIS-001', concept: 'AI API Security & Input Validation', riskTier: 'All Systems', priority: 'High', ccmDomain: 'AIS',
    description: 'Input sanitization, rate limiting, and output filtering controls on AI model APIs to prevent abuse, prompt injection, and data exfiltration.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.2'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['AIS-01', 'AIS-04'] },
    indicator: { name: 'API Abuse Incident Rate', method: 'AI API security incidents per month per deployed endpoint', slo: '<1 per endpoint per quarter' },
    implementation: 'Implement input validation, max token limits, PII output scanning, and rate limiting on all AI API endpoints. Log all requests. Alert on anomalous patterns.'
  },
  {
    id: 21, code: 'CTRL-BCR-001', concept: 'AI System Continuity & Recovery Planning', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'BCR',
    description: 'Business continuity and disaster recovery plans covering AI system outages, model rollback procedures, and fallback to non-AI processes.',
    mappings: { 'NIST AI RMF': ['MANAGE 4.2'], 'ISO/IEC 42001': ['8.8'], 'CCM': ['BCR-01', 'BCR-02'] },
    indicator: { name: 'AI System RTO Achievement Rate', method: 'AI system recoveries within defined RTO / total recovery events', slo: '≥99% within RTO' },
    implementation: 'Define RTO/RPO for each AI system by criticality. Implement model versioning enabling rapid rollback. Test failover to rule-based fallback for high-risk systems annually.'
  },
  {
    id: 22, code: 'CTRL-CCC-001', concept: 'AI Model Change Management', riskTier: 'All Systems', priority: 'High', ccmDomain: 'CCC',
    description: 'Structured change management process governing model updates, retraining, version promotion, and configuration changes in AI production environments.',
    mappings: { 'NIST AI RMF': ['MANAGE 3.1', 'MANAGE 3.2'], 'ISO/IEC 42001': ['8.4'], 'CCM': ['CCC-01', 'CCC-04'] },
    indicator: { name: 'Unauthorized Production Change Rate', method: 'AI production changes without approved change record / total changes', slo: '0%' },
    implementation: 'Gate all model promotions through change advisory board (or automated policy check). Require impact assessment, rollback plan, and post-deployment monitoring for 72 hours.'
  },
  {
    id: 23, code: 'CTRL-CEK-001', concept: 'AI Data Encryption & Key Management', riskTier: 'All Systems', priority: 'High', ccmDomain: 'CEK',
    description: 'Encryption-at-rest and in-transit standards for AI training data, model weights, and inference payloads, with formal key management lifecycle.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['CEK-01', 'CEK-02', 'CEK-03'] },
    indicator: { name: 'Encryption Standards Compliance Rate', method: 'AI data stores meeting encryption standard / total AI data stores', slo: '100%' },
    implementation: 'Enforce AES-256 at rest, TLS 1.3 in transit for all AI data. Store model weights in encrypted model registry. Rotate encryption keys annually. Audit key access quarterly.'
  },
  {
    id: 24, code: 'CTRL-DCS-001', concept: 'AI Compute Environment Isolation', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'DCS',
    description: 'Network segmentation and compute isolation controls separating AI training environments, inference infrastructure, and production data from development and internet exposure.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['DCS-01', 'DCS-06'] },
    indicator: { name: 'Environment Segregation Compliance Rate', method: 'AI environments with documented and validated isolation / total environments', slo: '100%' },
    implementation: 'Deploy AI training workloads in isolated VPCs without internet egress. Enforce GPU node isolation. Apply network micro-segmentation between inference and data tiers.'
  },
  {
    id: 25, code: 'CTRL-IPY-001', concept: 'AI Model Portability & Interoperability', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'IPY',
    description: 'Open standards and export capabilities ensuring AI models and their associated data can be migrated across platforms without proprietary lock-in.',
    mappings: { 'NIST AI RMF': ['GOV 4.2'], 'ISO/IEC 42001': ['8.3'], 'EU AI Act': ['Art 84'] },
    indicator: { name: 'Standard Format Adoption Rate', method: 'Models exportable in open format (ONNX/PMML) / total production models', slo: '≥80% of new models' },
    implementation: 'Require ONNX or equivalent open format export for all new model deployments. Document API contracts using OpenAPI. Avoid proprietary inference formats for high-risk systems.'
  },
  {
    id: 26, code: 'CTRL-SEF-001', concept: 'AI Security Incident Response & Remediation', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'SEF',
    description: 'AI-specific incident response playbooks covering model manipulation, harmful output events, data poisoning, and regulatory breach notifications.',
    mappings: { 'NIST AI RMF': ['MANAGE 4.1', 'MANAGE 4.2'], 'ISO/IEC 42001': ['10.1'], 'EU AI Act': ['Art 73', 'Art 74'] },
    indicator: { name: 'AI Incident Response Time-to-Contain', method: 'Median time from detection to containment action for AI security incidents', slo: '<2 hours for critical AI incidents' },
    implementation: 'Develop AI-specific IR playbooks: prompt injection, model extraction, bias incident, regulatory breach. Tabletop exercise annually. EU AI Act serious incident notifications within 15 days.'
  },
  {
    id: 27, code: 'CTRL-UEM-001', concept: 'AI Agent Endpoint Registration & Control', riskTier: 'All Systems', priority: 'High', ccmDomain: 'UEM',
    description: 'Registration and behavioral controls for AI agents, bots, and autonomous systems accessing organizational resources or external APIs.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['UEM-01', 'UEM-06'] },
    indicator: { name: 'Registered AI Agent Coverage Rate', method: 'AI agents registered in endpoint inventory / total discovered agents', slo: '100%' },
    implementation: 'Maintain registry of all AI agents with owner, purpose, data access scope, and external API permissions. Enforce allow-list for external API calls. Audit agent activity monthly.'
  },
];

const maturityLevels = [
  { level: 0, label: 'None' },
  { level: 1, label: 'Initial' },
  { level: 2, label: 'Managed' },
  { level: 3, label: 'Defined' },
  { level: 4, label: 'Measured' },
  { level: 5, label: 'Optimized' },
];

const ALL_TIERS = ['All', 'High-Risk', 'All Systems'];

const priorityColor = (p: string) =>
  p === 'Critical' ? 'w-1 h-9 rounded flex-shrink-0 bg-red-500' :
  p === 'High' ? 'w-1 h-9 rounded flex-shrink-0 bg-amber-500' :
  'w-1 h-9 rounded flex-shrink-0 bg-primary';

const GovernanceMap = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [expandedRows, setExpandedRows] = useState(new Set<number>());
  const [controlState, setControlState] = useState<Record<number, { maturity?: number; remediation?: string }>>(() => {
    try {
      const s = localStorage.getItem('ai-gov-progress-v2');
      return s ? JSON.parse(s) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem('ai-gov-progress-v2', JSON.stringify(controlState)); } catch {}
  }, [controlState]);

  const getMaturity = (id: number) => controlState[id]?.maturity || 0;
  const getRemediation = (id: number) => controlState[id]?.remediation || '';
  const updateMaturity = (id: number, lvl: number) =>
    setControlState(p => ({ ...p, [id]: { ...p[id], maturity: lvl } }));
  const updateRemediation = (id: number, txt: string) =>
    setControlState(p => ({ ...p, [id]: { ...p[id], remediation: txt } }));

  const overallScore = useMemo(() => {
    const total = Object.values(controlState).reduce((a, c) => a + (c.maturity || 0), 0);
    return Math.round((total / (complianceData.length * 5)) * 100);
  }, [controlState]);

  const assessedCount = useMemo(
    () => Object.values(controlState).filter(c => (c.maturity || 0) > 0).length,
    [controlState]
  );

  const radarData = useMemo(() => {
    const buckets: Record<string, number[]> = {};
    CCM_DOMAINS.forEach(d => { buckets[d] = []; });
    complianceData.forEach(c => {
      if (buckets[c.ccmDomain] !== undefined)
        buckets[c.ccmDomain].push(controlState[c.id]?.maturity || 0);
    });
    return CCM_DOMAINS.map(domain => {
      const vals = buckets[domain];
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return { domain, maturity: Math.round(avg * 10) / 10, hasControls: vals.length > 0 };
    });
  }, [controlState]);

  const filteredData = useMemo(
    () => complianceData.filter(item => {
      const s = searchTerm.toLowerCase();
      const matchSearch = !s || item.concept.toLowerCase().includes(s) || item.description.toLowerCase().includes(s) || item.code.toLowerCase().includes(s);
      const matchTier = selectedTier === 'All' || item.riskTier === selectedTier;
      return matchSearch && matchTier;
    }),
    [searchTerm, selectedTier]
  );

  const toggleRow = (id: number) => {
    const s = new Set(expandedRows);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedRows(s);
  };

  const exportCSV = () => {
    const rows = [
      ['Code', 'Control', 'CCM Domain', 'Risk Tier', 'Priority', 'Maturity Level', 'Notes'].join(','),
      ...complianceData.map(item => {
        const mat = getMaturity(item.id);
        return [item.code, `"${item.concept}"`, item.ccmDomain, item.riskTier, item.priority, maturityLevels[mat].label, `"${getRemediation(item.id)}"`].join(',');
      })
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
    a.download = 'ai-governance-assessment.csv';
    a.click();
  };

  const saveProgress = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(controlState, null, 2)], { type: 'application/json' }));
    a.download = 'ai-governance-progress.json';
    a.click();
  };

  const clearAll = () => {
    if (confirm('Clear all scores and notes? This cannot be undone.')) {
      setControlState({});
      try { localStorage.removeItem('ai-gov-progress-v2'); } catch {}
    }
  };

  const criticalCount = complianceData.filter(d => d.priority === 'Critical').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16 gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="hidden sm:flex">
              <ArrowLeft size={16} className="mr-1.5" />Back
            </Button>
            <div className="flex items-baseline gap-2.5">
              <span className="text-lg font-bold text-foreground">AI Governance Map</span>
              <span className="hidden sm:inline font-mono text-[0.65rem] text-muted-foreground bg-secondary border border-border px-1.5 py-0.5 rounded">
                v2 · CCM v4.1.0
              </span>
            </div>
          </div>

          <nav className="flex border border-border rounded-lg overflow-hidden bg-secondary">
            {[
              { id: 'map', icon: Shield, label: 'Controls' },
              { id: 'radar', icon: Radio, label: 'Radar' },
              { id: 'matrix', icon: Network, label: 'Matrix' },
            ].map((tab, i) => (
              <button
                key={tab.id}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                  i < 2 ? 'border-r border-border' : ''
                } ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-card hover:text-foreground'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={13} />{tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md font-mono text-xs font-semibold text-primary">
              <Activity size={12} />
              <span>{overallScore}%</span>
              <div className="w-14 h-1 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${overallScore}%` }} />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={exportCSV} className="hidden md:flex">
              <Download size={13} className="mr-1" />CSV
            </Button>
            <Button variant="outline" size="sm" onClick={saveProgress} className="hidden md:flex">
              <Save size={13} className="mr-1" />Save
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <RotateCcw size={13} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Frameworks', value: '4+', sub: 'Global standards' },
            { label: 'Controls', value: complianceData.length.toString(), sub: 'CCM v4.1.0 mapped' },
            { label: 'Critical', value: criticalCount.toString(), sub: 'High-priority controls' },
            { label: 'Assessed', value: `${assessedCount} / ${complianceData.length}`, sub: `${overallScore}% maturity score` },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 to-cyan-400/40" />
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground leading-none font-mono">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Controls tab */}
        {activeTab === 'map' && (
          <div>
            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                className="w-full py-2.5 pl-10 pr-4 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="Search controls by name, code, or description..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest mr-1">
                <Filter size={11} />Tier
              </span>
              {ALL_TIERS.map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`font-mono text-xs px-2.5 py-1 rounded-full border transition-all ${
                    selectedTier === tier
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {tier}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground font-mono">
                {filteredData.length} of {complianceData.length}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {filteredData.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">No controls match your filters.</div>
              )}
              {filteredData.map(item => {
                const mat = getMaturity(item.id);
                const isOpen = expandedRows.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`bg-card border rounded-xl overflow-hidden transition-all ${
                      isOpen ? 'border-primary/40 shadow-md shadow-primary/5' : 'border-border hover:border-primary/25'
                    }`}
                  >
                    <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggleRow(item.id)}>
                      <div className={priorityColor(item.priority)} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-foreground mb-1 flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[0.65rem] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                            {item.code}
                          </span>
                          {item.concept}
                          {item.priority === 'Critical' && (
                            <Badge variant="destructive" className="text-[0.6rem] px-1.5 py-0 h-4">Critical</Badge>
                          )}
                          {item.priority === 'High' && (
                            <Badge className="text-[0.6rem] px-1.5 py-0 h-4 bg-amber-100 text-amber-800 border-amber-300">High</Badge>
                          )}
                          {mat > 0 && (
                            <Badge variant="outline" className="text-[0.6rem] px-1.5 py-0 h-4 text-primary border-primary/40">
                              L{mat}·{maturityLevels[mat].label}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="hidden sm:inline font-mono text-[0.6rem] text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                          {item.ccmDomain}
                        </span>
                        <ChevronDown size={15} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {isOpen && (
                      <div className="border-t border-border p-6 bg-background grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: maturity + indicator */}
                        <div>
                          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                            <TrendingUp size={11} />Maturity Level
                          </p>
                          <div className="grid grid-cols-6 gap-1.5 mb-5">
                            {maturityLevels.map(lvl => (
                              <button
                                key={lvl.level}
                                onClick={() => updateMaturity(item.id, lvl.level)}
                                className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                                  mat === lvl.level
                                    ? 'bg-primary border-primary'
                                    : 'bg-card border-border hover:border-primary/50'
                                }`}
                              >
                                <span className={`font-mono text-sm font-medium leading-none ${mat === lvl.level ? 'text-white' : 'text-muted-foreground'}`}>
                                  {lvl.level}
                                </span>
                                <span className={`text-[0.5rem] mt-0.5 text-center leading-tight ${mat === lvl.level ? 'text-white/70' : 'text-muted-foreground'}`}>
                                  {lvl.label}
                                </span>
                              </button>
                            ))}
                          </div>

                          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                            <Zap size={11} />Performance Indicator
                          </p>
                          <div className="bg-primary/5 border border-dashed border-primary/40 rounded-lg p-4 mb-4">
                            <p className="text-sm font-semibold text-primary mb-1.5">{item.indicator.name}</p>
                            <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5 mt-2">Method</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{item.indicator.method}</p>
                            <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5 mt-2">SLO Target</p>
                            <span className="inline-block mt-0.5 font-mono text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded">
                              {item.indicator.slo}
                            </span>
                          </div>

                          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                            <CheckCircle2 size={11} />Implementation Guidance
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.implementation}</p>
                        </div>

                        {/* Right: notes + frameworks */}
                        <div>
                          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                            <FileText size={11} />Assessment Notes
                          </p>
                          <textarea
                            className="w-full p-3 bg-card border border-border rounded-lg text-xs text-foreground resize-y min-h-[90px] focus:border-primary focus:outline-none transition-colors font-mono"
                            placeholder="Evidence, findings, remediation actions, owner, target date..."
                            value={getRemediation(item.id)}
                            onChange={e => updateRemediation(item.id, e.target.value)}
                          />

                          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 mt-5 flex items-center gap-1.5">
                            <Globe size={11} />Framework Mappings
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(item.mappings).map(([fw, codes]) => (
                              <span
                                key={fw}
                                className="text-[0.65rem] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-mono"
                              >
                                {fw}: {(codes as string[]).join(', ')}
                              </span>
                            ))}
                          </div>

                          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 mt-5 flex items-center gap-1.5">
                            <Network size={11} />CCM Domain
                          </p>
                          <div className="flex gap-2">
                            <span className="font-mono text-xs bg-secondary border border-border px-2 py-1 rounded text-muted-foreground">
                              {item.ccmDomain}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize px-2 py-1">
                              {item.riskTier} · {item.priority}
                            </span>
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

        {/* Radar tab */}
        {activeTab === 'radar' && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground mb-1">Maturity Posture Radar</h2>
              <p className="text-sm text-muted-foreground">Average maturity score per CCM v4.1.0 domain — score controls to populate</p>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
              <div style={{ height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData.filter(d => d.hasControls)}>
                    <PolarGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <PolarAngleAxis
                      dataKey="domain"
                      tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: 'var(--muted-foreground)' }}
                    />
                    <Radar
                      name="Maturity"
                      dataKey="maturity"
                      stroke="#0891B2"
                      fill="#0891B2"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(val: number) => [`${val} / 5`, 'Avg Maturity']}
                      contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Domain Scores</p>
                {radarData.filter(d => d.hasControls).map(d => (
                  <div key={d.domain} className="flex items-center justify-between px-3 py-2 bg-background border border-border rounded-lg">
                    <span className="font-mono text-xs font-medium text-muted-foreground">{d.domain}</span>
                    <span className="font-mono text-xs text-primary font-semibold">
                      {d.maturity > 0 ? `${d.maturity} / 5` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Matrix tab */}
        {activeTab === 'matrix' && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground mb-1">Framework Overlap Matrix</h2>
              <p className="text-sm text-muted-foreground">Controls satisfying multiple governance frameworks — {complianceData.length} controls across {CCM_DOMAINS.length} CCM v4.1.0 domains</p>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-6 font-semibold text-muted-foreground font-mono min-w-[200px]">Control</th>
                    {['NIST AI RMF','ISO/IEC 42001','EU AI Act','CCM v4.1.0'].map(fw => (
                      <th key={fw} className="text-center px-2 py-3 font-semibold text-muted-foreground font-mono whitespace-nowrap">{fw}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {complianceData.map(ctrl => {
                    const mapped: Record<string, boolean> = {
                      'NIST AI RMF': 'NIST AI RMF' in ctrl.mappings,
                      'ISO/IEC 42001': 'ISO/IEC 42001' in ctrl.mappings,
                      'EU AI Act': 'EU AI Act' in ctrl.mappings,
                      'CCM v4.1.0': !!ctrl.ccmDomain,
                    };
                    return (
                      <tr key={ctrl.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="py-2.5 pr-6">
                          <span className="font-mono text-[0.6rem] text-muted-foreground mr-1.5">{ctrl.code}</span>
                          <span className="text-foreground">{ctrl.concept}</span>
                        </td>
                        {['NIST AI RMF','ISO/IEC 42001','EU AI Act','CCM v4.1.0'].map(fw => (
                          <td key={fw} className="text-center px-2 py-2.5">
                            {mapped[fw]
                              ? <span className="inline-block w-5 h-5 rounded-full bg-primary/20 text-primary text-[0.6rem] font-bold leading-5">✓</span>
                              : <span className="text-border">—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GovernanceMap;
