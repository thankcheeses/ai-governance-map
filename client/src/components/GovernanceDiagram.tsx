import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function GovernanceDiagram() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Governance Framework Architecture</CardTitle>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 800 400" className="w-full" style={{ maxHeight: '400px' }}>
          {/* Background */}
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#0891B2', stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 0.05 }} />
            </linearGradient>
          </defs>
          <rect width="800" height="400" fill="url(#grad1)" />

          {/* Top Level - Governance Standards */}
          <g id="standards">
            <rect x="50" y="20" width="140" height="60" rx="8" fill="#0891B2" stroke="#0891B2" strokeWidth="2" />
            <text x="120" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              ISO 42001
            </text>

            <rect x="220" y="20" width="140" height="60" rx="8" fill="#0891B2" stroke="#0891B2" strokeWidth="2" />
            <text x="290" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              EU AI Act
            </text>

            <rect x="390" y="20" width="140" height="60" rx="8" fill="#0891B2" stroke="#0891B2" strokeWidth="2" />
            <text x="460" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              GDPR/CCPA
            </text>

            <rect x="560" y="20" width="190" height="60" rx="8" fill="#0891B2" stroke="#0891B2" strokeWidth="2" />
            <text x="655" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              NIST AI RMF
            </text>
          </g>

          {/* Connecting Lines */}
          <line x1="120" y1="80" x2="120" y2="120" stroke="#0891B2" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="290" y1="80" x2="290" y2="120" stroke="#0891B2" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="460" y1="80" x2="460" y2="120" stroke="#0891B2" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="655" y1="80" x2="655" y2="120" stroke="#0891B2" strokeWidth="2" strokeDasharray="5,5" />

          {/* Middle Level - Control Categories */}
          <g id="controls">
            <rect x="30" y="120" width="160" height="70" rx="8" fill="#E0F2FE" stroke="#0891B2" strokeWidth="2" />
            <text x="110" y="145" textAnchor="middle" fill="#0C4A6E" fontSize="12" fontWeight="bold">
              Risk Management
            </text>
            <text x="110" y="165" textAnchor="middle" fill="#0C4A6E" fontSize="11">
              • Assessment
            </text>
            <text x="110" y="180" textAnchor="middle" fill="#0C4A6E" fontSize="11">
              • Mitigation
            </text>

            <rect x="210" y="120" width="160" height="70" rx="8" fill="#E0F2FE" stroke="#0891B2" strokeWidth="2" />
            <text x="290" y="145" textAnchor="middle" fill="#0C4A6E" fontSize="12" fontWeight="bold">
              Data Governance
            </text>
            <text x="290" y="165" textAnchor="middle" fill="#0C4A6E" fontSize="11">
              • Quality
            </text>
            <text x="290" y="180" textAnchor="middle" fill="#0C4A6E" fontSize="11">
              • Privacy
            </text>

            <rect x="390" y="120" width="160" height="70" rx="8" fill="#E0F2FE" stroke="#0891B2" strokeWidth="2" />
            <text x="470" y="145" textAnchor="middle" fill="#0C4A6E" fontSize="12" fontWeight="bold">
              Human Oversight
            </text>
            <text x="470" y="165" textAnchor="middle" fill="#0C4A6E" fontSize="11">
              • Review
            </text>
            <text x="470" y="180" textAnchor="middle" fill="#0C4A6E" fontSize="11">
              • Approval
            </text>

            <rect x="570" y="120" width="160" height="70" rx="8" fill="#E0F2FE" stroke="#0891B2" strokeWidth="2" />
            <text x="650" y="145" textAnchor="middle" fill="#0C4A6E" fontSize="12" fontWeight="bold">
              Monitoring
            </text>
            <text x="650" y="165" textAnchor="middle" fill="#0C4A6E" fontSize="11">
              • Performance
            </text>
            <text x="650" y="180" textAnchor="middle" fill="#0C4A6E" fontSize="11">
              • Incidents
            </text>
          </g>

          {/* Connecting Lines to Bottom */}
          <line x1="110" y1="190" x2="110" y2="230" stroke="#0891B2" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="290" y1="190" x2="290" y2="230" stroke="#0891B2" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="470" y1="190" x2="470" y2="230" stroke="#0891B2" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="650" y1="190" x2="650" y2="230" stroke="#0891B2" strokeWidth="2" strokeDasharray="5,5" />

          {/* Bottom Level - Implementation */}
          <g id="implementation">
            <rect x="50" y="230" width="520" height="80" rx="8" fill="#F0F9FF" stroke="#0891B2" strokeWidth="2" />
            <text x="310" y="255" textAnchor="middle" fill="#0C4A6E" fontSize="13" fontWeight="bold">
              Implementation & Compliance Controls
            </text>
            <text x="310" y="280" textAnchor="middle" fill="#0C4A6E" fontSize="11">
              Documentation • Policies • Procedures • Training • Auditing • Reporting
            </text>
            <text x="310" y="300" textAnchor="middle" fill="#0891B2" fontSize="11" fontWeight="bold">
              Continuous Improvement Cycle
            </text>
          </g>

          {/* Legend */}
          <g id="legend">
            <rect x="600" y="240" width="180" height="70" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="1" />
            <text x="690" y="260" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">
              Maturity Levels
            </text>
            <circle cx="615" cy="280" r="4" fill="#EF4444" />
            <text x="630" y="283" fill="#1F2937" fontSize="10">Initial</text>

            <circle cx="615" cy="300" r="4" fill="#F97316" />
            <text x="630" y="303" fill="#1F2937" fontSize="10">Developing</text>

            <circle cx="615" cy="320" r="4" fill="#22C55E" />
            <text x="630" y="323" fill="#1F2937" fontSize="10">Optimized</text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}
