/**
 * Cattura gli screenshot che finiscono in presentation/screenshots/
 * e da lì nelle slide 4 e 6. Agente: evidence-collector.
 */

import { test } from '@playwright/test';

const DEST = '../presentation/screenshots';

test('schermata principale', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${DEST}/01-schermata-principale.png`, fullPage: true });
});

// TODO(scenario): una volta congelato lo scenario, catturare
//   02-before.png  (il documento così com'è)
//   03-after.png   (la lettura calcolata)
// che alimentano la slide 4 "before / after affiancati".
test.skip('before / after', async ({ page }) => {
  await page.goto('/');
});
