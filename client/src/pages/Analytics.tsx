import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ComplianceStatusChart,
  MaturityLevelChart,
  RiskTierChart,
  FrameworkCoverageChart,
  ComplianceTrendChart,
  DomainRadarChart,
} from '@/components/GovernanceCharts';
import { Download, RefreshCw, Calendar } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Design Philosophy: Enterprise Dashboard Modernism
 * - Comprehensive analytics dashboard with multiple visualization types
 * - Teal accent colors for consistency across all charts
 * - Responsive grid layout that adapts to screen size
 */

export default function Analytics() {
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Analytics refreshed');
    }, 1000);
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Metric', 'Value', 'Date Range'],
        ['Overall Compliance', '72%', `${dateRange.start} to ${dateRange.end}`],
        ['Controls Assessed', '21', `${dateRange.start} to ${dateRange.end}`],
        ['Critical Issues', '3', `${dateRange.start} to ${dateRange.end}`],
        ['Avg Maturity', '3.4/5', `${dateRange.start} to ${dateRange.end}`],
      ]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `governance-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Analytics exported successfully');
    } catch (error) {
      toast.error('Failed to export analytics');
    }
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-display-sm font-bold text-foreground">Governance Analytics</h1>
            <p className="text-body-sm text-muted-foreground">
              Comprehensive metrics and visualizations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        {/* Date Range Filter */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-heading-md">Filter by Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-body-sm font-medium text-foreground">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => handleDateRangeChange('start', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-body-sm font-medium text-foreground">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => handleDateRangeChange('end', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRange(7)}
                  className="text-body-sm"
                >
                  Last 7 Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRange(30)}
                  className="text-body-sm"
                >
                  Last 30 Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRange(90)}
                  className="text-body-sm"
                >
                  Last 90 Days
                </Button>
              </div>
            </div>
            <p className="mt-4 text-body-sm text-muted-foreground">
              Showing data from {dateRange.start} to {dateRange.end}
            </p>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <SummaryStat label="Overall Compliance" value="72%" trend="+8%" positive />
          <SummaryStat label="Controls Assessed" value="21" trend="100%" positive />
          <SummaryStat label="Critical Issues" value="3" trend="-2" positive />
          <SummaryStat label="Avg Maturity" value="3.4/5" trend="+0.5" positive />
        </div>

        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Row 1: Status Overview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ComplianceStatusChart />
            <RiskTierChart />
          </div>

          {/* Row 2: Maturity & Trends */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MaturityLevelChart />
            <ComplianceTrendChart />
          </div>

          {/* Row 3: Framework Coverage */}
          <FrameworkCoverageChart />

          {/* Row 4: Domain Radar */}
          <DomainRadarChart />

          {/* Insights Section */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Actionable recommendations based on current metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InsightItem
                title="Critical Controls Require Attention"
                description="5 critical-tier controls are still in planning phase. Consider prioritizing these for immediate implementation."
                severity="high"
              />
              <InsightItem
                title="Strong Compliance Trajectory"
                description="Overall compliance has improved by 27% over the past 6 months. Maintain current pace to reach 85% by Q4."
                severity="positive"
              />
              <InsightItem
                title="Framework Coverage Gaps"
                description="CCPA compliance at 79% is below target. Review data privacy controls and update implementation roadmap."
                severity="medium"
              />
              <InsightItem
                title="Maturity Optimization Opportunity"
                description="Bias Detection domain at 3.0 maturity. Investing in automated detection tools could advance to 4.0."
                severity="medium"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

interface SummaryStatProps {
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
}

function SummaryStat({ label, value, trend, positive = false }: SummaryStatProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <p className="text-body-sm text-muted-foreground">{label}</p>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className={`text-body-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface InsightItemProps {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'positive';
}

function InsightItem({ title, description, severity }: InsightItemProps) {
  const severityStyles = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-amber-500 bg-amber-50',
    positive: 'border-l-green-500 bg-green-50',
  };

  const textStyles = {
    high: 'text-red-900',
    medium: 'text-amber-900',
    positive: 'text-green-900',
  };

  return (
    <div className={`border-l-4 p-4 ${severityStyles[severity]}`}>
      <h4 className={`font-semibold ${textStyles[severity]}`}>{title}</h4>
      <p className={`mt-1 text-sm ${textStyles[severity]} opacity-90`}>{description}</p>
    </div>
  );
}
