import { useState } from 'react';
import { Network } from 'lucide-react';
import { ProvenanceChainIcon } from './icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CONTROLS, CCM_DOMAINS, CROSSWALK_ACTORS, CROSSWALK_TOPICS } from '@/data/governance';

const CORE_FRAMEWORKS = ['NIST AI RMF', 'ISO/IEC 42001', 'EU AI Act', 'CCM v4.1.0'];

export default function CrosswalkSection() {
  const [tab, setTab] = useState('coverage');

  return (
    <section id="crosswalk" className="scroll-mt-24">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Network size={18} />
        </div>
        <div>
          <h2 className="text-heading-lg text-foreground">Crosswalk</h2>
          <p className="text-body-sm text-muted-foreground">How obligations, topics, and actor duties line up across frameworks</p>
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="p-4 border-b border-border">
            <TabsList>
              <TabsTrigger value="coverage">Control Coverage</TabsTrigger>
              <TabsTrigger value="topics">Topic Matrix</TabsTrigger>
              <TabsTrigger value="actors">Actor Obligations</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="coverage" className="p-6 overflow-x-auto">
            <p className="text-sm text-muted-foreground mb-4">
              {CONTROLS.length} controls across {CCM_DOMAINS.length} CCM v4.1.0 domains
            </p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-6 font-semibold text-muted-foreground font-mono min-w-[200px]">Control</th>
                  {CORE_FRAMEWORKS.map((fw) => (
                    <th key={fw} className="text-center px-2 py-3 font-semibold text-muted-foreground font-mono whitespace-nowrap">{fw}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONTROLS.map((ctrl) => {
                  const mapped: Record<string, boolean> = {
                    'NIST AI RMF': 'NIST AI RMF' in ctrl.mappings,
                    'ISO/IEC 42001': 'ISO/IEC 42001' in ctrl.mappings,
                    'EU AI Act': 'EU AI Act' in ctrl.mappings,
                    'CCM v4.1.0': !!ctrl.ccmDomain,
                  };
                  return (
                    <tr key={ctrl.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="py-2.5 pr-6">
                        <span className="font-mono text-[0.6rem] text-muted-foreground mr-1.5">{ctrl.code}</span>
                        <span className="text-foreground">{ctrl.title}</span>
                      </td>
                      {CORE_FRAMEWORKS.map((fw) => (
                        <td key={fw} className="text-center px-2 py-2.5">
                          {mapped[fw]
                            ? <span className="inline-block w-5 h-5 rounded-full bg-primary/20 text-primary text-[0.6rem] font-bold leading-5">✓</span>
                            : <span className="text-border">—</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="topics" className="p-6 overflow-x-auto">
            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
              <ProvenanceChainIcon className="w-4 h-4 text-primary" />{CROSSWALK_TOPICS.title}
            </p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {CROSSWALK_TOPICS.headers.map((h) => (
                    <th key={h} className="text-left px-3 py-3 font-semibold text-muted-foreground font-mono whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CROSSWALK_TOPICS.rows.map((row) => (
                  <tr key={row[0]} className="border-b border-border hover:bg-secondary/50">
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-3 py-2.5 whitespace-nowrap ${ci === 0 ? 'font-semibold text-foreground' : cell === '—' ? 'text-border' : 'text-muted-foreground'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="actors" className="p-6 overflow-x-auto">
            <p className="text-sm text-muted-foreground mb-4">{CROSSWALK_ACTORS.title}</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {CROSSWALK_ACTORS.headers.map((h) => (
                    <th key={h} className="text-left px-3 py-3 font-semibold text-muted-foreground font-mono whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CROSSWALK_ACTORS.rows.map((row) => (
                  <tr key={row[0]} className="border-b border-border hover:bg-secondary/50">
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-3 py-2.5 whitespace-nowrap ${ci === 0 ? 'font-semibold text-foreground' : cell === '—' ? 'text-border' : 'text-muted-foreground'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
