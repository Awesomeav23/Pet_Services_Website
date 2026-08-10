import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated accessibility scan.
 *
 * axe catches a meaningful subset of WCAG failures — missing labels, bad
 * contrast, broken ARIA, heading order, landmark problems. It is not a
 * substitute for manual testing, but a clean run means none of the mechanical
 * mistakes are present.
 *
 * Both interactive states of the booking form are scanned too, since the error
 * summary and the confirmation panel only exist after user input and would
 * otherwise never be checked.
 */

const scan = (page) =>
  new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

const ROUTES = [
  ['home', '/'],
  ['services listing', '/services'],
  ['service detail', '/services/grooming'],
  ['booking', '/booking'],
  ['about', '/about'],
  ['contact', '/contact'],
  ['not found', '/no-such-page'],
];

test.describe('Accessibility', () => {
  for (const [name, route] of ROUTES) {
    test(`${name} has no detectable violations`, async ({ page }) => {
      await page.goto(route);
      const { violations } = await scan(page);

      expect(
        violations,
        violations.map((v) => `${v.id}: ${v.help}`).join('\n')
      ).toEqual([]);
    });
  }

  test('the booking form in its error state has no violations', async ({
    page,
  }) => {
    await page.goto('/booking');
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();

    const { violations } = await scan(page);
    expect(
      violations,
      violations.map((v) => `${v.id}: ${v.help}`).join('\n')
    ).toEqual([]);
  });

  test('the About page with answers expanded has no violations', async ({
    page,
  }) => {
    await page.goto('/about');
    const triggers = page.getByRole('button', { expanded: false });
    const count = await triggers.count();
    for (let i = 0; i < count; i += 1) {
      await triggers.nth(0).click();
    }

    const { violations } = await scan(page);
    expect(
      violations,
      violations.map((v) => `${v.id}: ${v.help}`).join('\n')
    ).toEqual([]);
  });
});
