/**
 * MAPPA DIRECTORY → AGENTE.
 * Fonte di verità unica per agents:trace e evolution:proof.
 * L'ordine conta: il primo prefisso che combacia vince, quindi i percorsi
 * più specifici stanno in cima.
 *
 * Regola della decomposizione: un agente possiede una directory in
 * esclusiva. Se una directory non compare qui, l'agente che la possiede
 * non esiste ancora: si crea con /nuovo-agente.
 */

export const MAPPA_AGENTI = [
  { prefisso: 'app/src/core/', agente: '01-core-engine' },
  { prefisso: 'app/src/ingest/', agente: '02-data-ingest (NON ATTIVATO)' },
  { prefisso: 'app/src/ui/', agente: '03-ui-builder' },
  { prefisso: 'app/src/guardrails/', agente: '04-guardrail-officer' },
  { prefisso: 'app/src/assessment/', agente: '05-impact-analyst' },
  { prefisso: 'presentation/evidence/', agente: '06-evidence-collector' },
  { prefisso: 'presentation/screenshots/', agente: '06-evidence-collector' },
  { prefisso: 'presentation/demo-script.md', agente: '08-demo-director' },
  { prefisso: 'presentation/', agente: '07-deck-builder' },
  { prefisso: 'app/tests/e2e/', agente: '06-evidence-collector' },
  { prefisso: 'app/tests/', agente: '04-guardrail-officer' },
  { prefisso: 'app/fixtures/', agente: '00-architect' },
  { prefisso: 'app/types/', agente: '00-architect' },
  { prefisso: 'app/docs/', agente: '00-architect' },
  { prefisso: 'app/scripts/', agente: '00-architect' },
  { prefisso: 'agents/', agente: '00-architect' },
  { prefisso: '.claude/', agente: '00-architect' },
];

/** Elenco degli agenti nell'ordine in cui vanno mostrati. */
export const AGENTI = [
  '00-architect',
  '01-core-engine',
  '02-data-ingest (NON ATTIVATO)',
  '03-ui-builder',
  '04-guardrail-officer',
  '05-impact-analyst',
  '06-evidence-collector',
  '07-deck-builder',
  '08-demo-director',
];

/** Fasce orarie del piano, in minuti dal primo commit. */
export const FASCE = [
  { nome: '0:00-0:30 architect da solo', da: 0, a: 30 },
  { nome: '0:30-1:40 wave 1', da: 30, a: 100 },
  { nome: '1:40-1:50 checkpoint e congelamento contratti', da: 100, a: 110 },
  { nome: '1:50-2:45 wave 2', da: 110, a: 165 },
  { nome: '2:45-4:00 feature freeze e consegna', da: 165, a: 240 },
];

export function agentePerFile(percorso) {
  const p = percorso.replace(/\\/g, '/');
  for (const { prefisso, agente } of MAPPA_AGENTI) {
    if (p.startsWith(prefisso)) return agente;
  }
  return '00-architect'; // root: README.md, CLAUDE.md, config di progetto
}
