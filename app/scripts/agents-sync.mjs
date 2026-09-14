#!/usr/bin/env node
/**
 * agents:sync — allinea le DUE radici Claude Code a partire dalle fonti.
 *
 * Fonti di verità, uniche:
 *   agents/*.md                  le definizioni degli agenti (cartella valutata)
 *   .claude/skills/<nome>/       le skill
 *   app/.claude/rules/*.md       gli standard di codice
 *
 * Destinazioni derivate, mai modificate a mano:
 *   .claude/agents/              tutti e 9 gli agenti            (architetto)
 *   .claude/rules/               le stesse rules                 (architetto)
 *   app/.claude/agents/          i 4 agenti di costruzione       (developer)
 *   app/.claude/skills/          le 4 skill del developer        (developer)
 *
 * NON si collega `nuovo-agente` sotto app/: creare un perimetro è una
 * decisione dell'architetto e non deve comparire dalla radice del developer.
 * NON si collega l'intera cartella agents/: README.md e trace.md non hanno
 * frontmatter e Claude Code li scarterebbe con un errore ogni volta.
 *
 * Symlink dove il sistema lo consente, COPIA altrimenti (Windows senza
 * Developer Mode). La copia è dichiarata a video: due copie che divergono in
 * silenzio sono il guasto peggiore di questa configurazione.
 */

import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(join(dirname(fileURLToPath(import.meta.url)), '..', '..'));

/** Agenti visibili dalla radice del product developer. */
const AGENTI_COSTRUZIONE = [
  '01-core-engine.md',
  '03-ui-builder.md',
  '04-guardrail-officer.md',
  '05-impact-analyst.md',
  '09-doc-funzionale.md',
];

/** Skill visibili dalla radice del product developer. */
const SKILL_DEVELOPER = [
  'prepara',
  'spec',
  'implementa',
  'verifica',
  'evidenza',
  'avvia',
  'guarda',
  'diagnosi',
  'annulla',
];

let symlink = 0;
let copie = 0;

/** Prova il symlink relativo, ripiega sulla copia. */
function collega(sorgente, destinazione, tipo) {
  rmSync(destinazione, { force: true, recursive: true });
  const rel = relative(dirname(destinazione), sorgente);
  try {
    symlinkSync(rel, destinazione, tipo === 'dir' ? 'junction' : 'file');
    symlink += 1;
  } catch {
    if (tipo === 'dir') cpSync(sorgente, destinazione, { recursive: true });
    else copyFileSync(sorgente, destinazione);
    copie += 1;
  }
}

function pulisci(dir, attesi) {
  if (!existsSync(dir)) return;
  for (const nome of readdirSync(dir)) {
    if (!attesi.includes(nome)) rmSync(join(dir, nome), { force: true, recursive: true });
  }
}

// --- 1. .claude/agents/ : tutti e nove ----------------------------------
const definizioni = readdirSync(join(ROOT, 'agents'))
  .filter((f) => /^\d\d-.+\.md$/.test(f))
  .sort();

mkdirSync(join(ROOT, '.claude', 'agents'), { recursive: true });
for (const nome of definizioni) {
  collega(join(ROOT, 'agents', nome), join(ROOT, '.claude', 'agents', nome), 'file');
}
pulisci(join(ROOT, '.claude', 'agents'), definizioni);

// --- 2. app/.claude/agents/ : solo i quattro di costruzione -------------
mkdirSync(join(ROOT, 'app', '.claude', 'agents'), { recursive: true });
const costruzione = AGENTI_COSTRUZIONE.filter((n) => definizioni.includes(n));
for (const nome of costruzione) {
  collega(join(ROOT, 'agents', nome), join(ROOT, 'app', '.claude', 'agents', nome), 'file');
}
pulisci(join(ROOT, 'app', '.claude', 'agents'), costruzione);

// --- 3. app/.claude/skills/ : solo le quattro del developer -------------
mkdirSync(join(ROOT, 'app', '.claude', 'skills'), { recursive: true });
const skillPresenti = SKILL_DEVELOPER.filter((s) =>
  existsSync(join(ROOT, '.claude', 'skills', s, 'SKILL.md')),
);
for (const nome of skillPresenti) {
  collega(
    join(ROOT, '.claude', 'skills', nome),
    join(ROOT, 'app', '.claude', 'skills', nome),
    'dir',
  );
}
pulisci(join(ROOT, 'app', '.claude', 'skills'), skillPresenti);

// --- 4. .claude/rules/ : le stesse rules, fonte unica in app/ -----------
const sorgenteRules = join(ROOT, 'app', '.claude', 'rules');
let rules = [];
if (existsSync(sorgenteRules)) {
  rules = readdirSync(sorgenteRules).filter((f) => f.endsWith('.md'));
  mkdirSync(join(ROOT, '.claude', 'rules'), { recursive: true });
  for (const nome of rules) {
    collega(join(sorgenteRules, nome), join(ROOT, '.claude', 'rules', nome), 'file');
  }
  pulisci(join(ROOT, '.claude', 'rules'), rules);
}

// --- 5. il template della spec deve restare leggibile fuori da .claude/ --
const tplSkill = join(ROOT, '.claude', 'skills', 'spec', 'template.md');
const tplDocs = join(ROOT, 'app', 'docs', 'features', 'TEMPLATE.md');
let templateDisallineato = false;
if (existsSync(tplSkill) && existsSync(tplDocs)) {
  const a = readFileSync(tplSkill, 'utf8').replace(/\r\n/g, '\n');
  const b = readFileSync(tplDocs, 'utf8').replace(/\r\n/g, '\n');
  // TEMPLATE.md ha in testa un cappello in più: confrontiamo il corpo.
  const corpo = (s) => s.slice(s.indexOf('## Per chi'));
  templateDisallineato = corpo(a) !== corpo(b);
}

console.log(
  `agents:sync\n` +
    `  .claude/agents/        ${definizioni.length} agenti (tutti)\n` +
    `  .claude/rules/         ${rules.length} regole\n` +
    `  app/.claude/agents/    ${costruzione.length} agenti di costruzione\n` +
    `  app/.claude/skills/    ${skillPresenti.length} skill del developer (nuovo-agente escluso)\n` +
    `  modalità: ${symlink} symlink, ${copie} copie di fallback`,
);

const skillMancanti = SKILL_DEVELOPER.filter((s) => !skillPresenti.includes(s));
if (skillMancanti.length) {
  console.log(`  ATTENZIONE: skill mancanti in .claude/skills/: ${skillMancanti.join(', ')}`);
}
if (templateDisallineato) {
  console.log(
    '  ATTENZIONE: .claude/skills/spec/template.md e app/docs/features/TEMPLATE.md divergono.',
  );
}
if (copie > 0) {
  console.log(
    '\n  I symlink non sono disponibili su questa macchina (Windows senza Developer Mode).\n' +
      '  Le destinazioni sono COPIE: rilanciare `npm run agents:sync` dopo ogni modifica\n' +
      '  ad agents/, a .claude/skills/ o ad app/.claude/rules/.\n' +
      '  `npm run verify:roots` segnala se sono divergenti.',
  );
}
