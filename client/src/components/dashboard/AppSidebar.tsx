import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Flame,
  ShieldCheck,
  ListChecks,
  Radar,
  CalendarClock,
  Network,
  BookOpenCheck,
} from 'lucide-react';
import { ShieldWaveformIcon } from './icons';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'heatmap', label: 'Risk Heatmap', icon: Flame },
  { id: 'nhid', label: 'NHID-Clinical', icon: ShieldWaveformIcon, isCustomIcon: true },
  { id: 'controls', label: 'Controls', icon: ListChecks },
  { id: 'maturity', label: 'Maturity & Trend', icon: Radar },
  { id: 'timeline', label: 'Obligations Timeline', icon: CalendarClock },
  { id: 'crosswalk', label: 'Crosswalk', icon: Network },
  { id: 'frameworks', label: 'Frameworks', icon: BookOpenCheck },
];

export default function AppSidebar() {
  const activeId = useScrollSpy(NAV_ITEMS.map((n) => n.id));

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <ShieldWaveformIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-bold text-foreground leading-none truncate">AI Governance Map</p>
            <p className="text-[0.65rem] text-muted-foreground font-mono">v2 · CCM v4.1.0</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeId === item.id}
                    onClick={() => scrollTo(item.id)}
                    tooltip={item.label}
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 py-3 group-data-[collapsible=icon]:hidden">
        <p className="text-[0.65rem] text-muted-foreground leading-relaxed">
          Multi-framework AI governance reference. Local-only — no data leaves your browser.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
