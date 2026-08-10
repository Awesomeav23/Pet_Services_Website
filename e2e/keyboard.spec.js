import { test, expect } from '@playwright/test';

/**
 * Keyboard-only navigation.
 *
 * This is the pass that cannot be done in jsdom: real Tab order, real focus
 * movement to a fragment target, and the browser's own arrow-key handling
 * inside a radio group.
 */

test.describe('Keyboard navigation', () => {
  test('the skip link is the first stop and jumps to the main content', async ({
    page,
  }) => {
    await page.goto('/');
    // Pressing Tab through page.keyboard requires focus to already be inside
    // the document; pressing it on <body> guarantees the sequence starts at
    // the top of the page.
    await page.locator('body').press('Tab');

    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');

    // Focus must land on <main>, not merely scroll to it, or a keyboard user
    // carries on from the navigation they just tried to skip.
    await expect(page.locator('#main-content')).toBeFocused();
  });

  /**
   * The counterpart to the test above.
   *
   * Focus must not be moved on first load, or the skip link is unreachable —
   * but it must still move on a real navigation, or a screen-reader user is
   * given no signal that the page changed.
   */
  test('navigating to another page moves focus to the new content', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /browse services/i }).click();

    await expect(page).toHaveURL(/\/services$/);
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('the filter group takes one tab stop and moves with arrow keys', async ({
    page,
  }) => {
    await page.goto('/services');

    await page.getByRole('radio', { name: 'All pets' }).focus();
    await page.keyboard.press('ArrowRight');

    // Arrow-key movement is browser behaviour that comes from using real
    // radios; it is not implemented anywhere in the codebase.
    await expect(page.getByRole('radio', { name: 'Dogs' })).toBeChecked();
    await expect(page.getByRole('status')).toContainText(/for dogs/i);

    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('radio', { name: 'Cats' })).toBeChecked();
  });

  test('tabbing out of the filter group reaches the first service card', async ({
    page,
  }) => {
    await page.goto('/services');

    await page.getByRole('radio', { name: 'All pets' }).focus();
    await page.keyboard.press('Tab');

    // One stop per card: the whole card is covered by a single stretched link.
    await expect(
      page.getByRole('link', { name: /grooming & spa/i })
    ).toBeFocused();
  });

  test('accordion questions open with both Enter and Space', async ({ page }) => {
    await page.goto('/about');

    const first = page.getByRole('button', {
      name: /what vaccinations does my pet need/i,
    });
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Enter');
    await expect(first).toHaveAttribute('aria-expanded', 'false');

    await page.keyboard.press('Space');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
  });

  test('every interactive element on a page can be reached by tabbing', async ({
    page,
  }) => {
    await page.goto('/contact');

    const reachable = new Set();
    // Bounded so a focus trap fails the test instead of hanging it.
    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press('Tab');
      const id = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return el.id || el.getAttribute('name') || el.textContent?.trim().slice(0, 30);
      });
      if (id) reachable.add(id);
    }

    // The contact form's controls must all be in the tab order.
    expect([...reachable].join('|')).toMatch(/name/i);
    expect([...reachable].join('|')).toMatch(/email/i);
    expect([...reachable].join('|')).toMatch(/message/i);
  });
});

test.describe('Mobile menu keyboard behaviour', () => {
  // The toggle only exists below the 56rem breakpoint.
  test.skip(
    ({ viewport }) => viewport.width >= 896,
    'The menu button is not rendered at desktop widths'
  );

  test('Escape closes the menu and returns focus to the trigger', async ({
    page,
  }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: /menu/i });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // Without the focus restore, dismissing the menu strands the user at the
    // top of the document.
    await expect(toggle).toBeFocused();
  });
});
