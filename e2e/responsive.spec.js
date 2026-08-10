import { test, expect } from '@playwright/test';

/**
 * Responsive behaviour at 375, 768 and 1280.
 *
 * Each width is a separate Playwright project, so every assertion here runs
 * from a cold load at that size rather than from a mid-test resize.
 */

const ROUTES = [
  '/',
  '/services',
  '/services/grooming',
  '/booking',
  '/about',
  '/contact',
];

/** Count grid columns by how many children share the topmost row position. */
const countColumns = async (page, selector) =>
  page.evaluate((sel) => {
    const grid = document.querySelector(sel);
    if (!grid) return 0;
    const children = [...grid.children];
    if (children.length === 0) return 0;
    const firstTop = children[0].getBoundingClientRect().top;
    return children.filter(
      (child) => Math.abs(child.getBoundingClientRect().top - firstTop) < 2
    ).length;
  }, selector);

test.describe('Responsive layout', () => {
  /**
   * The single most valuable responsive assertion.
   *
   * Horizontal overflow is the classic mobile bug — one over-wide element and
   * the whole page scrolls sideways.
   */
  for (const route of ROUTES) {
    test(`${route} never scrolls horizontally`, async ({ page }) => {
      await page.goto(route);

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(overflow.scrollWidth).toBeLessThanOrEqual(
        overflow.clientWidth + 1 // allow a sub-pixel rounding margin
      );
    });
  }

  test('the services grid reflows to the expected column count', async ({
    page,
    viewport,
  }) => {
    await page.goto('/services');
    // The route is a lazily loaded chunk, so the grid does not exist at load
    // time — evaluating before it renders would measure nothing.
    await expect(
      page.getByRole('list', { name: 'Available services' })
    ).toBeVisible();

    const columns = await countColumns(page, 'ul[aria-label="Available services"]');

    // 1 column below 40rem, 2 up to 64rem, 3 above.
    const expected = viewport.width >= 1024 ? 3 : viewport.width >= 640 ? 2 : 1;
    expect(columns).toBe(expected);
  });

  test('the navigation collapses below the 56rem breakpoint', async ({
    page,
    viewport,
  }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: /menu/i });
    // Scoped to the primary nav: "Services" also appears in the footer and in
    // several call-to-action buttons.
    const navLink = page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Services' });

    if (viewport.width >= 896) {
      await expect(toggle).toBeHidden();
      await expect(navLink).toBeVisible();
    } else {
      await expect(toggle).toBeVisible();
      // Links are behind the toggle until it is opened.
      await expect(navLink).toBeHidden();
      await toggle.click();
      await expect(navLink).toBeVisible();
    }
  });

  test('interactive controls meet the 44px minimum touch target', async ({
    page,
  }) => {
    await page.goto('/booking');

    const controls = page.getByRole('button');
    const count = await controls.count();

    for (let i = 0; i < count; i += 1) {
      const box = await controls.nth(i).boundingBox();
      if (box) expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
});
