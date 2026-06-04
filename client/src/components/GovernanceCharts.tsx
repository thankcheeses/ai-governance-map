import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Design Philosophy: Enterprise Dashboard Modernism
 * - Clean, information-dense charts with teal accent colors
 * - Smooth animations and interactive tooltips
 * - Consistent color palette aligned with design system
 */

interface ChartProps {
  data?: any[];
  title?: string;
  description?: string;
}

const TEAL_COLORS = {
  primary: '#0891B2',
  secondary: '#06B6D4',
  accent: '#0E7490',
  light: '#F0F9FA',
};

const STATUS_COLORS = {
  compliant: '#10B981',
  inProgress: '#3B82F6',
  planning: '#F59E0B',
  nonCompliant: '#EF4444',
};

const TIER_COLORS = {
  critical: '#DC2626',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#10B981',
};

export function ComplianceStatusChart() {
  const data = [
    { name: 'Compliant', value: 14, fill: STATUS_COLORS.compliant },
    { name: 'In Progress', value: 5, fill: STATUS_COLORS.inProgress },
    { name: 'Planning', value: 2, fill: STATUS_COLORS.planning },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Compliance Status</CardTitle>
        <CardDescription>Distribution of control implementation status</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill={TEAL_COLORS.primary}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${TEAL_COLORS.light}`,
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MaturityLevelChart() {
  const data = [
    { level: 'Ad-hoc', count: 2 },
    { level: 'Repeatable', count: 4 },
    { level: 'Defined', count: 7 },
    { level: 'Managed', count: 5 },
    { level: 'Optimized', count: 3 },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Maturity Distribution</CardTitle>
        <CardDescription>Controls by maturity level across the organization</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="level" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${TEAL_COLORS.light}`,
                borderRadius: '8px',
              }}
              cursor={{ fill: 'rgba(8, 145, 178, 0.1)' }}
            />
            <Bar dataKey="count" fill={TEAL_COLORS.primary} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RiskTierChart() {
  const data = [
    { tier: 'Critical', count: 5, fill: TIER_COLORS.critical },
    { tier: 'High', count: 8, fill: TIER_COLORS.high },
    { tier: 'Medium', count: 6, fill: TIER_COLORS.medium },
    { tier: 'Low', count: 2, fill: TIER_COLORS.low },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Risk Tier Distribution</CardTitle>
        <CardDescription>Controls categorized by risk severity</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis type="number" stroke="#64748B" />
            <YAxis dataKey="tier" type="category" stroke="#64748B" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${TEAL_COLORS.light}`,
                borderRadius: '8px',
              }}
              cursor={{ fill: 'rgba(8, 145, 178, 0.1)' }}
            />
            <Bar dataKey="count" fill={TEAL_COLORS.primary} radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function FrameworkCoverageChart() {
  const data = [
    { name: 'ISO 42001', value: 95 },
    { name: 'EU AI Act', value: 88 },
    { name: 'NIST AI RMF', value: 82 },
    { name: 'GDPR', value: 91 },
    { name: 'SOC 2', value: 85 },
    { name: 'CCPA', value: 79 },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Framework Coverage</CardTitle>
        <CardDescription>Compliance percentage per framework</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#64748B" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#64748B" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${TEAL_COLORS.light}`,
                borderRadius: '8px',
              }}
              cursor={{ fill: 'rgba(8, 145, 178, 0.1)' }}
              formatter={(value) => `${value}%`}
            />
            <Bar dataKey="value" fill={TEAL_COLORS.secondary} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ComplianceTrendChart() {
  const data = [
    { month: 'Jan', compliance: 45 },
    { month: 'Feb', compliance: 52 },
    { month: 'Mar', compliance: 58 },
    { month: 'Apr', compliance: 65 },
    { month: 'May', compliance: 68 },
    { month: 'Jun', compliance: 72 },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Compliance Trend</CardTitle>
        <CardDescription>Overall compliance score progression over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="month" stroke="#64748B" />
            <YAxis stroke="#64748B" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${TEAL_COLORS.light}`,
                borderRadius: '8px',
              }}
              cursor={{ fill: 'rgba(8, 145, 178, 0.1)' }}
              formatter={(value) => `${value}%`}
            />
            <Line
              type="monotone"
              dataKey="compliance"
              stroke={TEAL_COLORS.primary}
              strokeWidth={3}
              dot={{ fill: TEAL_COLORS.primary, r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DomainRadarChart() {
  const data = [
    { domain: 'Data Privacy', maturity: 4 },
    { domain: 'Model Transparency', maturity: 3.5 },
    { domain: 'Bias Detection', maturity: 3 },
    { domain: 'Incident Response', maturity: 4 },
    { domain: 'Monitoring', maturity: 3 },
    { domain: 'Governance', maturity: 3.5 },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Governance Posture Radar</CardTitle>
        <CardDescription>Maturity levels across key governance domains</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="domain" stroke="#64748B" />
            <PolarRadiusAxis angle={90} domain={[0, 5]} stroke="#64748B" />
            <Radar
              name="Maturity"
              dataKey="maturity"
              stroke={TEAL_COLORS.primary}
              fill={TEAL_COLORS.primary}
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${TEAL_COLORS.light}`,
                borderRadius: '8px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
