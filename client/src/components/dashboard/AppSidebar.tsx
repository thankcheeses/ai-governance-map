import { motion } from 'framer-motion';
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
  Map,
  Globe,
  BookOpenCheck,
} from 'lucide-react';
import { ShieldWaveformIcon } from './icons';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'heatmap', label: 'Risk Heatmap', icon: Flame },
  { id: 'nhid', label: 'Voice Agent & NHID', icon: ShieldWaveformIcon, isCustomIcon: true },
  { id: 'controls', label: 'Controls', icon: ListChecks },
  { id: 'maturity', label: 'Maturity & Trend', icon: Radar },
  { id: 'timeline', label: 'Obligations Timeline', icon: CalendarClock },
  { id: 'crosswalk', label: 'Crosswalk', icon: Network },
  { id: 'global-map', label: 'Global Compliance Map', icon: Globe },
  { id: 'usa-map', label: 'USA Compliance Map', icon: Map },
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
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <img src={`${import.meta.env.BASE_URL}nhid-logo.png`} alt="NHID-Clinical" className="w-8 h-8 object-contain" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-bold text-foreground leading-none truncate">AI Governance Map</p>
            <p className="text-[0.65rem] text-muted-foreground font-mono">v3 · 1 Oct 2026</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item, i) => {
                const isActive = activeId === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-pill"
                        className="absolute inset-0 rounded-md bg-sidebar-accent"
                        transition={{ duration: 0.35, ease: EASE }}
                      />
                    )}
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                      className="relative z-10"
                    >
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => scrollTo(item.id)}
                        tooltip={item.label}
                        className="data-[active=true]:bg-transparent"
                      >
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                );
              })}
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
