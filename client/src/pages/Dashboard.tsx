import { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import TopBar from '@/components/dashboard/TopBar';
import HeroKpis from '@/components/dashboard/HeroKpis';
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

export default function Dashboard() {
  const { controlState, overallScore, assessedCount } = useGovernanceState();
  const [frameworkFilter, setFrameworkFilter] = useState('all');
  const [demoActive, setDemoActive] = useState(false);

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
        <main className="flex flex-col gap-12 p-4 sm:p-6 lg:p-10 max-w-[1400px] w-full mx-auto">
          {assessedCount === 0 && <IntroBanner onStartDemo={() => setDemoActive(true)} />}
          <HeroKpis overallScore={overallScore} assessedCount={assessedCount} />
          <GovernanceHeatmap frameworkFilter={frameworkFilter} onFrameworkFilterChange={setFrameworkFilter} />
          <NhidTrustStack />
          <ControlsSection />
          <MaturityRadarSection />
          <TimelineSection frameworkFilter={frameworkFilter} onFrameworkFilterChange={setFrameworkFilter} />
          <CrosswalkSection />
          <GlobalGlobeVisualization />
          <USAComplianceMapSection />
          <FrameworksSection frameworkFilter={frameworkFilter} onFrameworkFilterChange={setFrameworkFilter} />
        </main>
        <footer className="gradient-border border-t border-border py-6 px-4 lg:px-8 text-center text-xs text-muted-foreground">
          AI Governance Map · v2 · Local-only reference — no data leaves your browser.
        </footer>
      </SidebarInset>
      <DemoModeOverlay active={demoActive} onClose={() => setDemoActive(false)} />
    </SidebarProvider>
  );
}
