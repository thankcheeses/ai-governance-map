import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

const frameworkDetails: Record<string, {
  title: string;
  description: string;
  region: string;
  year: number;
  status: string;
  requirements: string[];
}> = {
  'iso-42001': {
    title: 'ISO 42001',
    description: 'Information technology — Artificial intelligence — Management system for AI',
    region: 'International',
    year: 2023,
    status: 'Active',
    requirements: [
      'AI governance and organizational context',
      'Risk management for AI systems',
      'Data management and quality',
      'AI model development and validation',
      'Human oversight and control',
      'Performance monitoring and maintenance',
      'Incident management and reporting',
    ],
  },
  'eu-ai-act': {
    title: 'EU AI Act',
    description: 'Regulation laying down harmonised rules on artificial intelligence',
    region: 'European Union',
    year: 2024,
    status: 'Enforcing',
    requirements: [
      'Risk classification of AI systems',
      'Transparency and disclosure requirements',
      'Documentation and record-keeping',
      'Human oversight mechanisms',
      'Data governance and quality',
      'Model testing and validation',
      'Incident reporting and management',
      'Compliance monitoring and auditing',
    ],
  },
  'gdpr': {
    title: 'GDPR',
    description: 'General Data Protection Regulation',
    region: 'European Union',
    year: 2018,
    status: 'Active',
    requirements: [
      'Data subject rights (access, rectification, erasure)',
      'Lawful basis for processing',
      'Data minimization and purpose limitation',
      'Consent management',
      'Data protection impact assessments',
      'Privacy by design',
      'Breach notification procedures',
      'Data processing agreements',
    ],
  },
  'ccpa': {
    title: 'CCPA',
    description: 'California Consumer Privacy Act',
    region: 'United States (California)',
    year: 2020,
    status: 'Active',
    requirements: [
      'Consumer right to know',
      'Consumer right to delete',
      'Consumer right to opt-out',
      'Non-discrimination provisions',
      'Sensitive personal information protection',
      'Privacy policy requirements',
      'Data breach notification',
      'Opt-in for minors',
    ],
  },
  'nist-ai-rmf': {
    title: 'NIST AI RMF',
    description: 'NIST Artificial Intelligence Risk Management Framework',
    region: 'United States',
    year: 2023,
    status: 'Active',
    requirements: [
      'AI system mapping and scoping',
      'Risk identification and analysis',
      'Risk mitigation strategies',
      'Performance monitoring',
      'Incident response planning',
      'Stakeholder engagement',
      'Documentation and transparency',
      'Continuous improvement',
    ],
  },
  'soc-2': {
    title: 'SOC 2',
    description: 'Service Organization Control 2 Compliance',
    region: 'International',
    year: 2022,
    status: 'Active',
    requirements: [
      'Security controls and access management',
      'Availability and system performance',
      'Processing integrity',
      'Confidentiality of data',
      'Privacy of personal information',
      'Change management procedures',
      'Monitoring and logging',
      'Incident response procedures',
    ],
  },
  'iso-27035': {
    title: 'ISO 27035',
    description: 'Information security incident management',
    region: 'International',
    year: 2016,
    status: 'Active',
    requirements: [
      'Incident detection and reporting',
      'Incident assessment and decision',
      'Response and recovery procedures',
      'Post-incident activities',
      'Incident communication and information sharing',
      'Roles and responsibilities',
      'Training and awareness programs',
      'Incident response plan maintenance',
    ],
  },
  'nist-cybersecurity': {
    title: 'NIST Cybersecurity',
    description: 'NIST Cybersecurity Framework',
    region: 'United States',
    year: 2018,
    status: 'Active',
    requirements: [
      'Asset management and inventory',
      'Access control and authentication',
      'Data security and encryption',
      'Vulnerability management',
      'Incident detection and response',
      'Business continuity planning',
      'Supply chain risk management',
      'Security awareness and training',
    ],
  },
};

export default function FrameworkDetail() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/frameworks/:id');

  if (!match || !params?.id) {
    return null;
  }

  const frameworkId = params.id as string;
  const framework = frameworkDetails[frameworkId];

  if (!framework) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
          <div className="flex items-center gap-4 px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          </div>
        </header>
        <main className="p-6 lg:p-8">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-center text-foreground">Framework not found</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
            <h1 className="text-display-sm font-bold text-foreground">{framework.title}</h1>
            <p className="text-body-sm text-muted-foreground">{framework.region}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        {/* Overview */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-body-md text-foreground">{framework.description}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-body-sm text-muted-foreground">Region</p>
                <p className="mt-1 text-body-md font-medium text-foreground">{framework.region}</p>
              </div>
              <div>
                <p className="text-body-sm text-muted-foreground">Established</p>
                <p className="mt-1 text-body-md font-medium text-foreground">{framework.year}</p>
              </div>
              <div>
                <p className="text-body-sm text-muted-foreground">Status</p>
                <Badge className="mt-1 bg-green-100 text-green-800">{framework.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Key Requirements</CardTitle>
            <CardDescription>
              Core compliance requirements and control areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {framework.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 rounded-lg border border-border p-4 hover:bg-secondary/50"
                >
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  <p className="text-body-md text-foreground">{req}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card className="mt-8 border-border bg-card">
          <CardHeader>
            <CardTitle>Your Compliance Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-body-md font-medium text-foreground">Overall Coverage</span>
                <span className="text-heading-md font-bold text-primary">72%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-secondary">
                <div
                  className="h-3 rounded-full bg-primary transition-all"
                  style={{ width: '72%' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="border-border bg-secondary">
                <CardContent className="pt-6">
                  <p className="text-body-sm text-muted-foreground">Compliant Controls</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">8</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-secondary">
                <CardContent className="pt-6">
                  <p className="text-body-sm text-muted-foreground">In Progress</p>
                  <p className="mt-2 text-3xl font-bold text-amber-600">3</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-secondary">
                <CardContent className="pt-6">
                  <p className="text-body-sm text-muted-foreground">Not Started</p>
                  <p className="mt-2 text-3xl font-bold text-red-600">2</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
