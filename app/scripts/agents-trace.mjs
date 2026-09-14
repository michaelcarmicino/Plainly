#!/usr/bin/env node
/**
 * agents:trace — EVIDENZA PRIMARIA DEL PROGETTO.
 * La giuria valuta l'uso di Claude Code: questa traccia è la prova che la
 * decomposizione in agenti non è un disegno su carta ma qualcosa che ha
 * effettivamente prodotto commit.
 *
 * Genera DUE output dalla cronologia git:
 *   agents/trace.md                        tabella leggibile
 *   presentation/evidence/process.json     stessi dati, forma strutturata
 *                                          (consumati da slide 3 e 7)
 *
 * Non fallisce mai: su repo vuoto o senza git scrive comunque i due file
 * con i totali a zero e una nota esplicita, perché la build della demo non
 * deve dipendere dallo stato del repository.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AGENTI, FASCE, MAPPA_AGENTI, agentePerFile } from './mappa-agenti.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SEP = '<<<C>>>';

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function leggiCommit() {
  try {
    const out = git([
      'log',
      '--reverse',
      `--pretty=format:${SEP}%H|%aI|%s`,
      '--name-only',
    ]);
    return out
      .split(SEP)
      .filter((b) => b.trim().length > 0)
      .map((blocco) => {
        const [intestazione, ...righe] = blocco.trim().split('\n');
        const [hash, data, ...oggetto] = intestazione.split('|');
        return {
          hash: hash.slice(0, 8),
          data,
          oggetto: oggetto.join('|'),
          file: righe.map((r) => r.trim()).filter(Boolean),
        };
      });
  } catch {
    return null; // niente git, o nessun commit
  }
}

const commit = leggiCommit();
const nessunaStoria = commit === null || commit.length === 0;

const perAgente = new Map(
  AGENTI.map((a) => [
    a,
    { agente: a, directoryPosseduta: '', fileToccati: new Set(), commit: 0, primoCommit: null, ultimoCommit: null },
  ]),
);

if (!nessunaStoria) {
  for (const c of commit) {
    const agentiDelCommit = new Set();
    for (const f of c.file) {
      const a = agentePerFile(f);
      if (!perAgente.has(a)) perAgente.set(a, { agente: a, directoryPosseduta: '', fileToccati: new Set(), commit: 0, primoCommit: null, ultimoCommit: null });
      perAgente.get(a).fileToccati.add(f);
      agentiDelCommit.add(a);
    }
    for (const a of agentiDelCommit) {
      const v = perAgente.get(a);
      v.commit += 1;
      v.primoCommit ??= `${c.hash} ${c.data}`;
      v.ultimoCommit = `${c.hash} ${c.data}`;
    }
  }
}

// Directory posseduta: dedotta dalla mappa, non dai commit.
for (const { prefisso, agente } of MAPPA_AGENTI) {
  const v = perAgente.get(agente);
  if (v && !v.directoryPosseduta) v.directoryPosseduta = prefisso;
}

function durataPerFascia() {
  const out = {};
  for (const f of FASCE) out[f.nome] = 0;
  if (nessunaStoria) return out;
  const t0 = new Date(commit[0].data).getTime();
  for (const f of FASCE) {
    const dentro = commit.filter((c) => {
      const m = (new Date(c.data).getTime() - t0) / 60000;
      return m >= f.da && m < f.a;
    });
    if (dentro.length === 0) continue;
    const primo = new Date(dentro[0].data).getTime();
    const ultimo = new Date(dentro[dentro.length - 1].data).getTime();
    out[f.nome] = Math.max(1, Math.round((ultimo - primo) / 60000));
  }
  return out;
}

function scrivi() {
  const agenti = [...perAgente.values()].map((v) => ({
    agente: v.agente,
    directoryPosseduta: v.directoryPosseduta || '(nessuna)',
    fileToccati: [...v.fileToccati].sort(),
    commit: v.commit,
    primoCommit: v.primoCommit,
    ultimoCommit: v.ultimoCommit,
  }));

  const processo = {
    generatoIl: new Date().toISOString(),
    agenti,
    agentiAttivi: agenti.filter((a) => a.commit > 0).length,
    commitTotali: nessunaStoria ? 0 : commit.length,
    durataPerFascia: durataPerFascia(),
    nota: nessunaStoria
      ? 'Nessun commit in cronologia: traccia generata vuota, di proposito. Rieseguire `npm run agents:trace` dopo i primi commit.'
      : '',
  };

  mkdirSync(join(ROOT, 'presentation', 'evidence'), { recursive: true });
  writeFileSync(
    join(ROOT, 'presentation', 'evidence', 'process.json'),
    `${JSON.stringify(processo, null, 2)}\n`,
    'utf8',
  );

  const righe = agenti.map((a) => {
    const file = a.fileToccati.length === 0 ? '—' : `${a.fileToccati.length} file`;
    return `| \`${a.agente}\` | \`${a.directoryPosseduta}\` | ${file} | ${a.commit} | ${a.primoCommit ?? '—'} | ${a.ultimoCommit ?? '—'} |`;
  });

  const dettaglio = agenti
    .filter((a) => a.fileToccati.length > 0)
    .map((a) => `### ${a.agente}\n\n${a.fileToccati.map((f) => `- \`${f}\``).join('\n')}`)
    .join('\n\n');

  const md = `# agents/trace.md — traccia di esecuzione reale

> Generato da \`npm run agents:trace\`. **Non modificare a mano**: è l'evidenza,
> non il racconto. Rigenerato a ogni checkpoint e prima della consegna.
>
> Ultima generazione: ${processo.generatoIl}

${nessunaStoria ? `**${processo.nota}**\n` : ''}
## Chi ha fatto che cosa

| Agente | Directory posseduta | File toccati | Commit | Primo commit | Ultimo commit |
| --- | --- | --- | --- | --- | --- |
${righe.join('\n')}

**Totali** — agenti attivi: ${processo.agentiAttivi} / ${AGENTI.length} · commit complessivi: ${processo.commitTotali}

## Durata osservata per fascia oraria

| Fascia | Minuti di attività osservata |
| --- | --- |
${Object.entries(processo.durataPerFascia).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

${dettaglio ? `## Dettaglio dei file per agente\n\n${dettaglio}\n` : ''}
## Momenti di correzione

Da tenere aggiornato a mano durante la giornata (è l'unica parte non
generata): vedi la sezione "Cosa abbiamo corretto" in \`agents/README.md\`.
`;

  writeFileSync(join(ROOT, 'agents', 'trace.md'), md, 'utf8');

  console.log(
    `agents:trace → agents/trace.md + presentation/evidence/process.json ` +
      `(${processo.agentiAttivi} agenti attivi, ${processo.commitTotali} commit)`,
  );
}

scrivi();
