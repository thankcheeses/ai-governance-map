import { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import TopBar from '@/components/dashboard/TopBar';
import HeroKpis from '@/components/dashboard/HeroKpis';
import AttentionBoard from '@/components/dashboard/AttentionBoard';
import IntroBanner from '@/components/dashboard/IntroBanner';
import GovernanceHeatmap from '@/components/dashboard/GovernanceHeatmap';
import NhidTrustStack from '@/components/dashboard/NhidTrustStack';
import ControlsSection from '@/components/dashboard/ControlsSection';
import MaturityRadarSection from '@/components/dashboard/MaturityRadarSection';
import TimelineSection from '@/components/dashboard/TimelineSection';
import CrosswalkSection from '@/components/dashboard/CrosswalkSection';
import USAComplianceMapSection from '@/components/dashboard/USAComplianceMapSection';
import GlobalGlobeVisualization from '@/components/dashboard/GlobalGlobeVisualization';
import FrameworksSection from '@/components/dashboard/FrameworksSection';
import DemoModeOverlay from '@/components/dashboard/DemoModeOverlay';
import { useGovernanceState } from '@/hooks/useGovernanceState';
import { exportControlsCSV, exportProgressJSON, printPostureSnapshot } from '@/lib/exports';

type Lens = 'all' | 'executive' | 'grc' | 'risk';

const LENS_SECTIONS: Record<Lens, string[]> = {
  all: ['overview', 'heatmap', 'nhid', 'controls', 'maturity', 'timeline', 'crosswalk', 'global-map', 'usa-map', 'frameworks'],
  executive: ['overview', 'heatmap', 'timeline', 'maturity'],
  grc: ['overview', 'controls', 'crosswalk', 'timeline', 'frameworks'],
  risk: ['overview', 'heatmap', 'nhid', 'usa-map', 'global-map'],
};

export default function Dashboard() {
  const { controlState, overallScore, assessedCount } = useGovernanceState();
  const [frameworkFilter, setFrameworkFilter] = useState('all');
  const [demoActive, setDemoActive] = useState(false);
  const [lens, setLens] = useState<Lens>('all');
  const visible = new Set(LENS_SECTIONS[lens]);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopBar
          overallScore={overallScore}
          assessedCount={assessedCount}
          onExportCSV={() => exportControlsCSV(controlState)}
          onExportJSON={() => exportProgressJSON(controlState)}
          onPrintSnapshot={printPostureSnapshot}
          onStartDemo={() => setDemoActive(true)}
        />
        <main className="product-main flex flex-col gap-10 p-4 sm:p-6 lg:p-10 max-w-[1400px] w-full mx-auto">
          <div className="workspace-heading">
            <div>
              <p className="eyebrow mono">AI GOVERNANCE OPERATING SYSTEM <span>·</span> CONTROL ROOM</p>
              <h1>Map exposure. Prove coverage. Act before the clock.</h1>
              <p className="workspace-subtitle">A living register for AI obligations, internal controls, and risk decisions across the frameworks that matter to your organization.</p>
            </div>
            <div className="workspace-meta">
              <span className="status-dot" />
              <span>Local workspace</span>
              <span className="meta-divider" />
              <span className="mono">UPDATED {__BUILD_DATE__}</span>
            </div>
          </div>
          <div className="lens-bar">
            <div className="lens-copy"><span className="eyebrow mono">VIEW</span><span className="lens-description">Choose the lens for this review</span></div>
            <div className="lens-tabs" role="tablist" aria-label="Working view">
            {([['all', 'Full register'], ['executive', 'Executive'], ['grc', 'GRC'], ['risk', 'Risk']] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={lens === id}
                onClick={() => setLens(id)}
                className={`lens-tab text-xs font-medium px-2.5 py-1 rounded-md border ${lens === id ? 'is-active' : ''}`}
              >
                {label}
              </button>
            ))}
            </div>
          </div>
          {assessedCount === 0 && <IntroBanner onStartDemo={() => setDemoActive(true)} />}
          {visible.has('overview') && (
            <>
              <AttentionBoard controlState={controlState} assessedCount={assessedCount} onJump={jump} />
              <HeroKpis overallScore={overallScore} assessedCount={assessedCount} />
            </>
          )}
          {visible.has('heatmap') && <GovernanceHeatmap frameworkFilter={frameworkFilter} onFrameworkFilterChange={setFrameworkFilter} />}
          {visible.has('nhid') && <NhidTrustStack />}
          {visible.has('controls') && <ControlsSection />}
          {visible.has('maturity') && <MaturityRadarSection />}
          {visible.has('timeline') && <TimelineSection frameworkFilter={frameworkFilter} onFrameworkFilterChange={setFrameworkFilter} />}
          {visible.has('crosswalk') && <CrosswalkSection />}
          {visible.has('global-map') && <GlobalGlobeVisualization />}
          {visible.has('usa-map') && <USAComplianceMapSection />}
          {visible.has('frameworks') && <FrameworksSection frameworkFilter={frameworkFilter} onFrameworkFilterChange={setFrameworkFilter} />}
        </main>
        <footer className="gradient-border border-t border-border py-6 px-4 lg:px-8 text-center text-xs text-muted-foreground">
          <p>
            AI Governance Map · v3 · Local-only — your assessment data never leaves your browser. Globe basemap imagery © Esri.
          </p>
          <p className="mt-1 font-mono text-[0.65rem] opacity-80">
            Last updated {__BUILD_DATE__} · obligations verified 1 Oct 2026 · NHID-Clinical v2.0
          </p>
        </footer>
      </SidebarInset>
      <DemoModeOverlay active={demoActive} onClose={() => setDemoActive(false)} />
    </SidebarProvider>
  );
}
