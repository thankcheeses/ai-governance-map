import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download } from 'lucide-react';

export default function ComplianceMatrix() {
  const [, navigate] = useLocation();

  const frameworks = [
    'ISO/IEC 42001',
    'EU AI Act',
    'NIST AI RMF',
    'GDPR',
    'CCM v4.1.0',
  ];

  const controls = [
    { code: 'CTRL-GRC-001', name: 'AI Governance Board & Charter', domain: 'GRC' },
    { code: 'CTRL-GRC-002', name: 'AI Risk Management Program', domain: 'GRC' },
    { code: 'CTRL-GRC-003', name: 'AI Policy & Standards Framework', domain: 'GRC' },
    { code: 'CTRL-GRC-004', name: 'AI Compliance Obligations Tracker', domain: 'GRC' },
    { code: 'CTRL-DSP-001', name: 'AI Training Data Governance', domain: 'DSP' },
    { code: 'CTRL-DSP-002', name: 'Personal Data Minimization for AI', domain: 'DSP' },
    { code: 'CTRL-IAM-001', name: 'AI System Access Controls', domain: 'IAM' },
    { code: 'CTRL-IAM-002', name: 'Non-Human Identity Governance', domain: 'IAM' },
    { code: 'CTRL-LOG-001', name: 'AI Activity Logging & Traceability', domain: 'LOG' },
    { code: 'CTRL-LOG-002', name: 'AI Performance & Drift Monitoring', domain: 'LOG' },
    { code: 'CTRL-STA-001', name: 'AI Third-Party & Supplier Oversight', domain: 'STA' },
    { code: 'CTRL-STA-002', name: 'AI Model Provenance & Documentation', domain: 'STA' },
    { code: 'CTRL-STA-003', name: 'AI Disclosure & Transparency Notice', domain: 'STA' },
    { code: 'CTRL-TVM-001', name: 'AI Adversarial Testing & Red-Teaming', domain: 'TVM' },
    { code: 'CTRL-TVM-002', name: 'AI Model Vulnerability Assessment', domain: 'TVM' },
    { code: 'CTRL-AA-001',  name: 'AI Internal Audit Program', domain: 'A&A' },
    { code: 'CTRL-AA-002',  name: 'AI Third-Party Audit & Attestation', domain: 'A&A' },
    { code: 'CTRL-HRS-001', name: 'Human Override & Escalation Protocols', domain: 'HRS' },
    { code: 'CTRL-HRS-002', name: 'AI Workforce Competency & Ethics Training', domain: 'HRS' },
    { code: 'CTRL-AIS-001', name: 'AI API Security & Input Validation', domain: 'AIS' },
    { code: 'CTRL-BCR-001', name: 'AI System Continuity & Recovery', domain: 'BCR' },
    { code: 'CTRL-CCC-001', name: 'AI Model Change Management', domain: 'CCC' },
    { code: 'CTRL-CEK-001', name: 'AI Data Encryption & Key Management', domain: 'CEK' },
    { code: 'CTRL-DCS-001', name: 'AI Compute Environment Isolation', domain: 'DCS' },
    { code: 'CTRL-IPY-001', name: 'AI Model Portability & Interoperability', domain: 'IPY' },
    { code: 'CTRL-SEF-001', name: 'AI Security Incident Response', domain: 'SEF' },
    { code: 'CTRL-UEM-001', name: 'AI Agent Endpoint Registration', domain: 'UEM' },
  ];

  type CoverageStatus = 'full' | 'partial' | 'none';
  const complianceMatrix: Record<string, Record<string, CoverageStatus>> = {
    'CTRL-GRC-001': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'full',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-GRC-002': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'full',    'GDPR': 'partial', 'CCM v4.1.0': 'full' },
    'CTRL-GRC-003': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'partial', 'NIST AI RMF': 'full',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-GRC-004': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'partial', 'GDPR': 'partial', 'CCM v4.1.0': 'full' },
    'CTRL-DSP-001': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'full',    'GDPR': 'full',    'CCM v4.1.0': 'full' },
    'CTRL-DSP-002': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'partial', 'NIST AI RMF': 'partial', 'GDPR': 'full',    'CCM v4.1.0': 'full' },
    'CTRL-IAM-001': { 'ISO/IEC 42001': 'partial', 'EU AI Act': 'partial', 'NIST AI RMF': 'full',    'GDPR': 'partial', 'CCM v4.1.0': 'full' },
    'CTRL-IAM-002': { 'ISO/IEC 42001': 'partial', 'EU AI Act': 'partial', 'NIST AI RMF': 'full',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-LOG-001': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'full',    'GDPR': 'partial', 'CCM v4.1.0': 'full' },
    'CTRL-LOG-002': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'full',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-STA-001': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'full',    'GDPR': 'partial', 'CCM v4.1.0': 'full' },
    'CTRL-STA-002': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'full',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-STA-003': { 'ISO/IEC 42001': 'partial', 'EU AI Act': 'full',    'NIST AI RMF': 'partial', 'GDPR': 'full',    'CCM v4.1.0': 'full' },
    'CTRL-TVM-001': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'full',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-TVM-002': { 'ISO/IEC 42001': 'partial', 'EU AI Act': 'partial', 'NIST AI RMF': 'full',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-AA-001':  { 'ISO/IEC 42001': 'full',    'EU AI Act': 'partial', 'NIST AI RMF': 'partial', 'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-AA-002':  { 'ISO/IEC 42001': 'partial', 'EU AI Act': 'full',    'NIST AI RMF': 'partial', 'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-HRS-001': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'full',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-HRS-002': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'partial', 'NIST AI RMF': 'full',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-AIS-001': { 'ISO/IEC 42001': 'partial', 'EU AI Act': 'partial', 'NIST AI RMF': 'full',    'GDPR': 'partial', 'CCM v4.1.0': 'full' },
    'CTRL-BCR-001': { 'ISO/IEC 42001': 'partial', 'EU AI Act': 'none',    'NIST AI RMF': 'partial', 'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-CCC-001': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'partial', 'NIST AI RMF': 'full',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-CEK-001': { 'ISO/IEC 42001': 'partial', 'EU AI Act': 'none',    'NIST AI RMF': 'partial', 'GDPR': 'partial', 'CCM v4.1.0': 'full' },
    'CTRL-DCS-001': { 'ISO/IEC 42001': 'none',    'EU AI Act': 'none',    'NIST AI RMF': 'partial', 'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-IPY-001': { 'ISO/IEC 42001': 'partial', 'EU AI Act': 'partial', 'NIST AI RMF': 'none',    'GDPR': 'none',    'CCM v4.1.0': 'full' },
    'CTRL-SEF-001': { 'ISO/IEC 42001': 'full',    'EU AI Act': 'full',    'NIST AI RMF': 'full',    'GDPR': 'full',    'CCM v4.1.0': 'full' },
    'CTRL-UEM-001': { 'ISO/IEC 42001': 'none',    'EU AI Act': 'none',    'NIST AI RMF': 'partial', 'GDPR': 'none',    'CCM v4.1.0': 'full' },
  };

  const getComplianceColor = (status: 'full' | 'partial' | 'none') => {
    switch (status) {
      case 'full':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'partial':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'none':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceLabel = (status: 'full' | 'partial' | 'none') => {
    switch (status) {
      case 'full':
        return 'Full';
      case 'partial':
        return 'Partial';
      case 'none':
        return 'None';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Controls
            </Button>
            <div>
              <h1 className="text-display-sm font-bold text-foreground">Compliance Matrix</h1>
              <p className="text-body-sm text-muted-foreground">Control-to-framework mapping</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        {/* Legend */}
        <Card className="mb-8 border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-green-100" />
                <span className="text-body-sm">Full Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-amber-100" />
                <span className="text-body-sm">Partial Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-100" />
                <span className="text-body-sm">No Compliance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Matrix */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Control-Framework Mapping</CardTitle>
            <CardDescription>
              Shows which controls address requirements for each compliance framework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-body-sm font-semibold text-foreground">
                      Control
                    </th>
                    {frameworks.map((fw) => (
                      <th
                        key={fw}
                        className="px-4 py-3 text-center text-body-sm font-semibold text-foreground"
                      >
                        <div className="max-w-[100px]">{fw}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {controls.map((control) => (
                    <tr key={control.code} className="border-b border-border hover:bg-secondary/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-[0.6rem] font-mono text-muted-foreground mb-0.5">{control.code}</p>
                          <p className="text-xs font-medium text-foreground">{control.name}</p>
                          <p className="text-[0.6rem] text-muted-foreground font-mono">{(control as any).domain}</p>
                        </div>
                      </td>
                      {frameworks.map((fw) => {
                        const status = complianceMatrix[control.code]?.[fw] || 'none';
                        return (
                          <td key={`${control.code}-${fw}`} className="px-4 py-3 text-center">
                            <Badge className={getComplianceColor(status)}>
                              {getComplianceLabel(status)}
                            </Badge>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Framework Summary */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {frameworks.map((fw) => {
            const fullCount = controls.filter(
              (c) => complianceMatrix[c.code]?.[fw] === 'full'
            ).length;
            const partialCount = controls.filter(
              (c) => complianceMatrix[c.code]?.[fw] === 'partial'
            ).length;
            const coverage = Math.round(
              ((fullCount + partialCount / 2) / controls.length) * 100
            );

            return (
              <Card key={fw} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-heading-md">{fw}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-body-sm font-medium text-foreground">Coverage</span>
                      <span className="text-body-sm font-bold text-primary">{coverage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${coverage}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-body-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Coverage:</span>
                      <span className="font-medium text-green-600">{fullCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Partial Coverage:</span>
                      <span className="font-medium text-amber-600">{partialCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
