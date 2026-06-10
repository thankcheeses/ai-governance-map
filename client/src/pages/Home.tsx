import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Shield, TrendingUp, Activity, Search, Download, Settings, Menu, X, Loader2, Map } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { NotificationBell } from '@/components/NotificationCenter';

/**
 * Design Philosophy: Enterprise Dashboard Modernism
 * - Clean, information-dense layouts with generous whitespace
 * - Hierarchical typography with Geist display font
 * - Teal accent (#0891B2) for interactive elements
 * - Subtle depth through layered surfaces and soft shadows
 */

function NavItem({ icon: Icon, label, active = false, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg px-4 py-2 text-left text-body-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-secondary'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        {label}
      </div>
    </button>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');

  // Fetch controls from database
  const { data: dbControls = [], isLoading: controlsLoading } = trpc.controls.list.useQuery();
  const { data: frameworks = [] } = trpc.frameworks.list.useQuery();

  // Transform database controls to match UI format
  const governanceControls = useMemo(() => {
    return dbControls.map((control: any) => ({
      id: control.id,
      name: control.name,
      tier: control.tier.charAt(0).toUpperCase() + control.tier.slice(1),
      status: control.status
        .split('_')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      maturity: control.maturityLevel || 1,
      frameworks: [], // Will be populated from control-framework mappings
    }));
  }, [dbControls]);

  const filteredControls = useMemo(() => {
    return governanceControls.filter(control => {
      const matchSearch = !searchTerm || control.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTier = selectedTier === 'All' || control.tier === selectedTier;
      return matchSearch && matchTier;
    });
  }, [searchTerm, selectedTier, governanceControls]);

  // Calculate stats from database
  const stats = useMemo(() => {
    const totalControls = governanceControls.length;
    const compliant = governanceControls.filter(c => c.status === 'Compliant').length;
    const avgMaturity = governanceControls.length > 0
      ? Math.round((governanceControls.reduce((sum, c) => sum + c.maturity, 0) / governanceControls.length / 5) * 100)
      : 0;

    return [
      { label: 'Total Controls', value: totalControls.toString(), icon: Shield },
      { label: 'Compliant', value: compliant.toString(), icon: Activity },
      { label: 'Frameworks', value: frameworks.length.toString(), icon: BarChart3 },
      { label: 'Maturity Score', value: `${avgMaturity}%`, icon: TrendingUp },
    ];
  }, [governanceControls, frameworks]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant':
        return 'text-green-600';
      case 'In Progress':
        return 'text-blue-600';
      case 'Planning':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Name', 'Tier', 'Status', 'Maturity Level', 'Frameworks'],
        ...governanceControls.map(c => [
          c.name,
          c.tier,
          c.status,
          c.maturity,
          c.frameworks.join('; ')
        ])
      ]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `governance-controls-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Controls exported successfully');
    } catch (error) {
      toast.error('Failed to export controls');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 hover:bg-secondary lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-display-sm font-bold text-foreground">AI Governance Map</h1>
              <p className="text-body-sm text-muted-foreground">v2.0 · Enterprise Edition</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download size={16} className="mr-2" />
              Export
            </Button>
            <NotificationBell />
            <Button variant="ghost" size="sm">
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="hidden w-64 border-r border-border bg-card lg:block">
            <nav className="space-y-1 p-4">
              <NavItem icon={Shield} label="Controls" active />
              <NavItem icon={Map} label="Governance Map" onClick={() => navigate('/governance-map')} />
              <NavItem icon={BarChart3} label="Analytics" onClick={() => navigate('/analytics')} />
              <NavItem icon={Activity} label="Gap Analysis" onClick={() => navigate('/gap-analysis')} />
              <NavItem icon={TrendingUp} label="Compliance Matrix" onClick={() => navigate('/compliance-matrix')} />
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Hero Section with Background */}
          <div
            className="mb-8 rounded-xl p-8 text-white shadow-lg relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0F172A 0%, #0E7490 50%, #0F172A 100%)' }}
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #38BDF8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0891B2 0%, transparent 40%)'
            }} />
            <div className="relative max-w-2xl">
              <p className="text-xs font-mono uppercase tracking-widest text-cyan-300/80 mb-2">AI Governance Map v2.5 · CCM v4.1.0</p>
              <h2 className="mb-2 text-4xl font-bold">Governance at Scale</h2>
              <p className="text-lg opacity-90">
                Assess, monitor, and improve your AI governance posture across all frameworks and
                jurisdictions — NIST AI RMF, EU AI Act, ISO/IEC 42001.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="border-border bg-card relative overflow-hidden hover:border-primary/30 transition-colors">
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #0E7490, #38BDF8)' }} />
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-body-sm text-muted-foreground">{stat.label}</p>
                        <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <Icon className="text-primary opacity-20" size={32} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="controls" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="space-y-6">
              {/* Search and Filters */}
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
                      <Input
                        placeholder="Search controls..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      {['All', 'Critical', 'High', 'Medium'].map((tier) => (
                        <Button
                          key={tier}
                          variant={selectedTier === tier ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedTier(tier)}
                        >
                          {tier}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Controls List */}
              {controlsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : filteredControls.length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="py-12 text-center">
                    <Shield className="mx-auto mb-4 text-muted-foreground opacity-50" size={48} />
                    <p className="text-body-sm text-muted-foreground">
                      {searchTerm || selectedTier !== 'All' ? 'No controls match your filters' : 'No controls found. Create your first control to get started.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredControls.map((control) => (
                    <Card
                      key={control.id}
                      className="border-l-4 border-l-primary border-r border-b border-t border-border bg-card transition-all hover:shadow-md"
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <h3 className="text-heading-md font-semibold text-foreground">
                                {control.name}
                              </h3>
                              <Badge className={getTierColor(control.tier)}>{control.tier}</Badge>
                              <Badge variant="outline" className={getStatusColor(control.status)}>
                                {control.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {control.frameworks.length > 0 ? (
                                control.frameworks.map((fw: string) => (
                                  <Badge key={fw} variant="secondary" className="text-body-sm">
                                    {fw}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-body-sm text-muted-foreground">No frameworks assigned</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-start gap-2 lg:items-end">
                            <div className="text-body-sm text-muted-foreground">Maturity Level</div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`h-2 w-6 rounded-sm ${
                                    level <= control.maturity ? 'bg-primary' : 'bg-secondary'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="frameworks" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Supported Frameworks</CardTitle>
                  <CardDescription>
                    Coverage across global compliance and governance standards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {frameworks.length > 0 ? (
                      frameworks.map((fw: any) => {
                        const slug = fw.name
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9-]/g, '');
                        const compliancePercentage = (fw as any).compliancePercentage || 0;
                        const progressColor = compliancePercentage >= 80 ? 'bg-green-500' :
                          compliancePercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';

                        return (
                          <button
                            key={fw.id}
                            onClick={() => navigate(`/frameworks/${slug}`)}
                            className="rounded-lg border border-border bg-secondary p-3 transition-all hover:bg-primary hover:text-primary-foreground"
                          >
                            <p className="text-body-sm font-medium">{fw.name}</p>
                            <div className="mt-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Compliance</span>
                                <span className="text-xs font-semibold text-primary">{compliancePercentage}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-secondary-foreground/20 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${progressColor}`}
                                  style={{ width: `${compliancePercentage}%` }}
                                />
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <p className="text-body-sm text-muted-foreground">No frameworks available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
