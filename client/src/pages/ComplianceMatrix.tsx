import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download } from 'lucide-react';

export default function ComplianceMatrix() {
  const [, navigate] = useLocation();

  const frameworks = [
    'ISO 42001',
    'EU AI Act',
    'GDPR',
    'CCPA',
    'NIST AI RMF',
    'SOC 2',
  ];

  const controls = [
    { name: 'AI Model Transparency', category: 'Transparency' },
    { name: 'Data Privacy Controls', category: 'Privacy' },
    { name: 'Bias Detection & Mitigation', category: 'Fairness' },
    { name: 'Model Monitoring & Auditing', category: 'Monitoring' },
    { name: 'Incident Response Plan', category: 'Security' },
    { name: 'Governance Structure', category: 'Governance' },
    { name: 'Risk Assessment', category: 'Risk Management' },
    { name: 'Data Subject Rights', category: 'Privacy' },
  ];

  // Sample compliance matrix data
  const complianceMatrix: Record<string, Record<string, 'full' | 'partial' | 'none'>> = {
    'AI Model Transparency': {
      'ISO 42001': 'full',
      'EU AI Act': 'full',
      'GDPR': 'partial',
      'CCPA': 'none',
      'NIST AI RMF': 'full',
      'SOC 2': 'partial',
    },
    'Data Privacy Controls': {
      'ISO 42001': 'partial',
      'EU AI Act': 'partial',
      'GDPR': 'full',
      'CCPA': 'full',
      'NIST AI RMF': 'partial',
      'SOC 2': 'full',
    },
    'Bias Detection & Mitigation': {
      'ISO 42001': 'full',
      'EU AI Act': 'full',
      'GDPR': 'partial',
      'CCPA': 'partial',
      'NIST AI RMF': 'full',
      'SOC 2': 'none',
    },
    'Model Monitoring & Auditing': {
      'ISO 42001': 'full',
      'EU AI Act': 'full',
      'GDPR': 'full',
      'CCPA': 'partial',
      'NIST AI RMF': 'full',
      'SOC 2': 'full',
    },
    'Incident Response Plan': {
      'ISO 42001': 'partial',
      'EU AI Act': 'partial',
      'GDPR': 'full',
      'CCPA': 'full',
      'NIST AI RMF': 'full',
      'SOC 2': 'full',
    },
    'Governance Structure': {
      'ISO 42001': 'full',
      'EU AI Act': 'full',
      'GDPR': 'partial',
      'CCPA': 'partial',
      'NIST AI RMF': 'full',
      'SOC 2': 'partial',
    },
    'Risk Assessment': {
      'ISO 42001': 'full',
      'EU AI Act': 'full',
      'GDPR': 'full',
      'CCPA': 'partial',
      'NIST AI RMF': 'full',
      'SOC 2': 'partial',
    },
    'Data Subject Rights': {
      'ISO 42001': 'partial',
      'EU AI Act': 'partial',
      'GDPR': 'full',
      'CCPA': 'full',
      'NIST AI RMF': 'none',
      'SOC 2': 'none',
    },
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
                    <tr key={control.name} className="border-b border-border hover:bg-secondary/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-body-sm font-medium text-foreground">
                            {control.name}
                          </p>
                          <p className="text-body-xs text-muted-foreground">{control.category}</p>
                        </div>
                      </td>
                      {frameworks.map((fw) => {
                        const status = complianceMatrix[control.name]?.[fw] || 'none';
                        return (
                          <td key={`${control.name}-${fw}`} className="px-4 py-3 text-center">
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
              (c) => complianceMatrix[c.name]?.[fw] === 'full'
            ).length;
            const partialCount = controls.filter(
              (c) => complianceMatrix[c.name]?.[fw] === 'partial'
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
