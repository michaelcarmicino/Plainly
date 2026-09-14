#!/usr/bin/env node
/**
 * promuovi — porta `develop` su `master`.
 * Usato da /promuovi.
 *
 *   node scripts/promuovi.mjs            controlla e unisce in locale
 *   node scripts/promuovi.mjs --push     unisce e pubblica
 *   node scripts/promuovi.mjs --dry-run  dice solo cosa farebbe
 *
 * `develop` è il branch di integrazione, `master` è ciò che si consegna.
 * La promozione è un atto esplicito: non deve succedere per inerzia, perché
 * è il momento in cui un difetto smette di essere un problema interno.
 *
 * Nessun reset, nessun force: si unisce con --no-ff, così il commit di merge
 * resta come punto a cui tornare.
 */

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const APP = join(ROOT, 'app');
const WIN = process.platform === 'win32';

const PUSH = process.argv.includes('--push');
const PROVA = process.argv.includes('--dry-run');

const git = (...a) =>
  spawnSync('git', a, { cwd: ROOT, encoding: 'utf8' });
const gitOut = (...a) => (git(...a).stdout ?? '').trim();

function stop(messaggio) {
  console.log(`PROMOZIONE ANNULLATA\n\n${messaggio}\n`);
  process.exit(1);
}

/* ---------------------------------------------- controlli preliminari */

const branchIniziale = gitOut('rev-parse', '--abbrev-ref', 'HEAD');

if (gitOut('status', '--porcelain') !== '') {
  stop(
    'Ci sono modifiche non committate.\n' +
      '  Committale sul branch della funzionalità, o mettile da parte con\n' +
      '  `git stash`. Promuovere con il working tree sporco significa\n' +
      "  consegnare qualcosa che nessuno ha visto.\n\n" +
      gitOut('status', '--short'),
  );
}

for (const b of ['develop', 'master']) {
  if (git('rev-parse', '--verify', `${b}^{commit}`).status !== 0) {
    stop(`Il branch \`${b}\` non esiste.`);
  }
}

const avanti = gitOut('log', '--oneline', 'master..develop');
if (avanti === '') {
  console.log('`master` è già allineato a `develop`: niente da promuovere.');
  process.exit(0);
}

const indietro = gitOut('log', '--oneline', 'develop..master');
if (indietro !== '') {
  stop(
    '`master` ha commit che `develop` non ha:\n\n' +
      `${indietro}\n\n` +
      '  Riporta prima master dentro develop:\n' +
      '    git switch develop && git merge master\n' +
      '  poi rilancia. Promuovere ora perderebbe quel lavoro o creerebbe un\n' +
      '  conflitto nel momento peggiore.',
  );
}

const daPromuovere = avanti.split('\n').filter(Boolean);

console.log(`Da promuovere su master: ${daPromuovere.length} commit\n`);
for (const r of daPromuovere) console.log(`  ${r}`);
console.log('');
console.log(gitOut('diff', '--stat', 'master...develop'));
console.log('');

/* -------------------------------------------------- cancello di qualità */

if (PROVA) {
  console.log('--dry-run: nessuna modifica. Controlli di qualità saltati.');
  process.exit(0);
}

console.log('Controlli su develop prima di promuovere…\n');

const passo = (nome, cmd, args) => {
  const r = spawnSync(WIN ? `${cmd}.cmd` : cmd, args, {
    cwd: APP,
    encoding: 'utf8',
    shell: WIN,
    timeout: 300_000,
  });
  const testo = `${r.stdout ?? ''}${r.stderr ?? ''}`.replace(/\x1b\[[0-9;]*m/g, '');
  if (r.status !== 0) {
    stop(
      `Il controllo "${nome}" non passa su develop.\n\n` +
        `${testo.split('\n').slice(-25).join('\n')}\n\n` +
        '  `master` è ciò che si consegna: non ci arriva niente di rosso.',
    );
  }
  const riga = testo.split('\n').find((x) => /Tests\s+\d/.test(x));
  console.log(`  ${nome}: ok${riga ? ` · ${riga.trim()}` : ''}`);
};

git('switch', 'develop');
passo('tipi', 'npx', ['tsc', '--noEmit']);
passo('test e lessico', 'npm', ['test']);
passo('build', 'npm', ['run', 'build']);

/* ------------------------------------------------------------- merge */

console.log('\nPromozione…\n');

const messaggio =
  `chore(architect): promuovi develop su master (${daPromuovere.length} commit)`;

git('switch', 'master');
const m = git('merge', '--no-ff', 'develop', '-m', messaggio);
if (m.status !== 0) {
  git('merge', '--abort');
  git('switch', branchIniziale);
  stop(
    `Il merge ha prodotto conflitti ed è stato annullato:\n\n${m.stdout}${m.stderr}\n\n` +
      '  Risolvili su develop, non su master.',
  );
}

console.log(`  master ← develop  (${gitOut('rev-parse', '--short', 'HEAD')})`);

// Il merge --no-ff lascia su master un commit che develop non ha. Senza
// questo riallineamento, la promozione SUCCESSIVA si bloccherebbe sempre
// sul controllo «master ha commit che develop non ha» — un attrito che si
// ripresenta ogni volta e che non dice niente di utile.
const ff = git('switch', 'develop').status === 0 && git('merge', '--ff-only', 'master').status === 0;
if (ff) {
  console.log('  develop ← master  (riallineato, il merge commit non resta scoperto)');
} else {
  console.log('  ATTENZIONE: develop non si è riallineato a master. Fallo a mano:');
  console.log('    git switch develop && git merge --ff-only master');
}
git('switch', 'master');

if (PUSH) {
  const p1 = git('push', 'origin', 'master');
  const p2 = git('push', 'origin', 'develop');
  if (p1.status !== 0 || p2.status !== 0) {
    console.log('\nMerge fatto in locale, ma il push è fallito:');
    console.log(`${p1.stderr ?? ''}${p2.stderr ?? ''}`);
    console.log('  Il lavoro è al sicuro: ripeti `git push origin master develop`.');
    git('switch', branchIniziale);
    process.exit(1);
  }
  console.log('  pubblicato: origin/master e origin/develop');
} else {
  console.log('\n  Non pubblicato. Per farlo:  git push origin master develop');
  console.log('  oppure rilancia con --push');
}

git('switch', branchIniziale);
console.log(`\nFatto. Torni su \`${branchIniziale}\`.`);
