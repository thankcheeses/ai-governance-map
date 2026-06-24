import { Moon, Sun, Download, FileJson, Printer, PlayCircle } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

interface TopBarProps {
  overallScore: number;
  assessedCount: number;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onPrintSnapshot: () => void;
  onStartDemo: () => void;
}

export default function TopBar({ overallScore, assessedCount, onExportCSV, onExportJSON, onPrintSnapshot, onStartDemo }: TopBarProps) {
  const { theme, toggleTheme, switchable } = useTheme();
  const isUnassessed = assessedCount === 0;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 h-16 px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="hidden sm:inline text-sm font-semibold text-foreground">Dashboard</span>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md font-mono text-xs font-semibold text-primary">
          <span>Posture {isUnassessed ? '—' : `${overallScore}%`}</span>
          <div className="w-16 h-1.5 bg-primary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: isUnassessed ? '0%' : `${overallScore}%`, opacity: isUnassessed ? 0.3 : 1 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={onStartDemo} className="hidden md:flex">
            <PlayCircle size={13} className="mr-1" />Demo
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Download size={13} className="mr-1" />Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExportCSV}>
                <Download size={13} className="mr-2" />Controls CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportJSON}>
                <FileJson size={13} className="mr-2" />Progress JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onPrintSnapshot}>
                <Printer size={13} className="mr-2" />Posture Snapshot (PDF)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {switchable && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
