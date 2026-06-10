import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertCircle, TrendingUp } from 'lucide-react';

export default function GapAnalysis() {
  const [, navigate] = useLocation();

  const gaps = [
    {
      id: 1,
      framework: 'EU AI Act',
      control: 'CTRL-STA-003 · AI System Disclosure & Transparency Notice',
      description: 'User-facing disclosure and AI labeling not deployed on all touchpoints. Art 50 requires disclosure at point of interaction.',
      currentMaturity: 1,
      targetMaturity: 4,
      effort: 'High',
      timeline: '3-4 months',
      priority: 'Critical',
    },
    {
      id: 2,
      framework: 'NIST AI RMF',
      control: 'CTRL-GRC-002 · AI Risk Management Program',
      description: 'AI Risk Register exists but lacks quarterly review cadence and formal escalation path to Governance Board.',
      currentMaturity: 2,
      targetMaturity: 4,
      effort: 'Medium',
      timeline: '2 months',
      priority: 'Critical',
    },
    {
      id: 3,
      framework: 'ISO/IEC 42001',
      control: 'CTRL-DSP-001 · AI Training Data Governance',
      description: 'Data cards not consistently maintained for all production training datasets. Consent basis undocumented for 40% of datasets.',
      currentMaturity: 1,
      targetMaturity: 4,
      effort: 'High',
      timeline: '4-5 months',
      priority: 'Critical',
    },
    {
      id: 4,
      framework: 'EU AI Act',
      control: 'CTRL-TVM-001 · AI Adversarial Testing & Red-Teaming',
      description: 'No structured red-team program for high-risk AI systems. Art 9 requires pre-deployment adversarial testing.',
      currentMaturity: 0,
      targetMaturity: 4,
      effort: 'High',
      timeline: '4-6 months',
      priority: 'Critical',
    },
    {
      id: 5,
      framework: 'NIST AI RMF',
      control: 'CTRL-LOG-002 · AI Performance & Drift Monitoring',
      description: 'Drift monitoring alerts configured but response SLAs undefined. No documented escalation when thresholds breach.',
      currentMaturity: 2,
      targetMaturity: 4,
      effort: 'Medium',
      timeline: '2-3 months',
      priority: 'High',
    },
    {
      id: 6,
      framework: 'ISO/IEC 42001',
      control: 'CTRL-IAM-002 · Non-Human Identity Governance for AI Agents',
      description: 'Machine identities for AI agents not inventoried. Orphaned service accounts exceed 5% threshold.',
      currentMaturity: 1,
      targetMaturity: 3,
      effort: 'Medium',
      timeline: '2 months',
      priority: 'High',
    },
    {
      id: 7,
      framework: 'EU AI Act',
      control: 'CTRL-AA-002 · AI Third-Party Audit & Attestation',
      description: 'No external attestation obtained for high-risk AI systems. Art 43 conformity assessment required before market placement.',
      currentMaturity: 0,
      targetMaturity: 4,
      effort: 'High',
      timeline: '6-9 months',
      priority: 'High',
    },
    {
      id: 8,
      framework: 'NIST AI RMF',
      control: 'CTRL-HRS-001 · Human Override & Escalation Protocols',
      description: 'Override procedures documented but not tested in 18+ months. GOV 2.2 requires periodic validation of intervention mechanisms.',
      currentMaturity: 2,
      targetMaturity: 4,
      effort: 'Low',
      timeline: '1 month',
      priority: 'High',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-amber-100 text-amber-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-amber-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Controls
          </Button>
          <div>
            <h1 className="text-display-sm font-bold text-foreground">Gap Analysis</h1>
            <p className="text-body-sm text-muted-foreground">Identify compliance gaps and improvement opportunities</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-border bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #0E7490, #38BDF8)' }} />
            <CardContent className="pt-6">
              <p className="text-body-sm text-muted-foreground">Gaps Identified</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{gaps.length}</p>
              <p className="text-body-sm text-muted-foreground mt-1">CCM v4.1.0 controls</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500" />
            <CardContent className="pt-6">
              <p className="text-body-sm text-muted-foreground">Critical Priority</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{gaps.filter(g => g.priority === 'Critical').length}</p>
              <p className="text-body-sm text-muted-foreground mt-1">Require immediate action</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500" />
            <CardContent className="pt-6">
              <p className="text-body-sm text-muted-foreground">Est. Max Timeline</p>
              <p className="mt-2 text-3xl font-bold text-foreground">9 months</p>
              <p className="text-body-sm text-muted-foreground mt-1">To full remediation</p>
            </CardContent>
          </Card>
        </div>

        {/* Gaps Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Compliance Gaps</CardTitle>
            <CardDescription>
              Maturity gaps between current state and target compliance level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gaps.map((gap) => (
                <div
                  key={gap.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-4 hover:bg-secondary/50"
                >
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          {gap.control}
                        </h3>
                        <Badge className={getPriorityColor(gap.priority)}>
                          {gap.priority}
                        </Badge>
                      </div>
                      <p className="text-body-sm text-muted-foreground mb-1">{gap.framework}</p>
                      {'description' in gap && <p className="text-xs text-muted-foreground/80">{(gap as any).description}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      <Badge variant="outline">Effort: <span className={getEffortColor(gap.effort)}>&nbsp;{gap.effort}</span></Badge>
                      <Badge variant="outline">Timeline: {gap.timeline}</Badge>
                    </div>
                  </div>

                  {/* Maturity Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm font-medium text-foreground">Maturity Progress</span>
                      <span className="text-body-sm text-muted-foreground">
                        {gap.currentMaturity} → {gap.targetMaturity}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-sm ${
                            level <= gap.currentMaturity
                              ? 'bg-primary'
                              : level <= gap.targetMaturity
                                ? 'bg-blue-300'
                                : 'bg-secondary'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mt-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 p-4">
              <AlertCircle className="mt-1 flex-shrink-0 text-blue-600" size={20} />
              <div>
                <h4 className="font-semibold text-blue-900">Prioritize EU AI Act Compliance</h4>
                <p className="mt-1 text-sm text-blue-800">
                  EU AI Act requirements are critical and have the longest implementation timeline. Begin with model transparency and risk assessment processes.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-4">
              <AlertCircle className="mt-1 flex-shrink-0 text-amber-600" size={20} />
              <div>
                <h4 className="font-semibold text-amber-900">Consolidate Data Privacy Efforts</h4>
                <p className="mt-1 text-sm text-amber-800">
                  GDPR and CCPA requirements overlap significantly. Implement unified data subject rights management to address both frameworks efficiently.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border-l-4 border-l-green-500 bg-green-50 p-4">
              <AlertCircle className="mt-1 flex-shrink-0 text-green-600" size={20} />
              <div>
                <h4 className="font-semibold text-green-900">Leverage Existing Infrastructure</h4>
                <p className="mt-1 text-sm text-green-800">
                  Your current bias detection tools can be extended to meet NIST AI RMF requirements with minimal additional effort.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
