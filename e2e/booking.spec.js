import { test, expect } from '@playwright/test';

/**
 * The appointment request journey, driven through a real browser.
 *
 * The jsdom tests already cover this logic; what these add is the parts jsdom
 * cannot see — real navigation between route chunks, the date picker as the
 * browser implements it, and focus behaviour as it actually resolves.
 */

/** A date a week out, formatted for a native date input. */
const futureDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().split('T')[0];
};

/**
 * Choose a radio by clicking its label.
 *
 * The radio inputs are visually hidden and replaced by styled labels, so
 * Playwright will not act on the input itself. Clicking the label is what a
 * real user does anyway, and it keeps the test honest about the native input
 * still being what receives the selection.
 */
const chooseRadio = (page, inputId) => page.locator(`label[for="${inputId}"]`).click();

test.describe('Booking journey', () => {
  test('a visitor can go from the home page to a confirmed request', async ({
    page,
  }) => {
    await page.goto('/');

    // Home -> services, following the same path a visitor would.
    await page.getByRole('link', { name: /browse services/i }).click();
    await expect(page).toHaveURL(/\/services$/);

    // Services -> a specific service.
    await page.getByRole('link', { name: /grooming & spa/i }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: /grooming & spa/i })
    ).toBeVisible();

    // The CTA deep links into the form with the service already chosen.
    await page.getByRole('link', { name: /book grooming & spa/i }).click();
    await expect(page).toHaveURL(/\/booking\?service=grooming$/);
    await expect(page.getByRole('radio', { name: /grooming/i })).toBeChecked();

    await page.getByRole('button', { name: /continue/i }).click();

    await page.getByLabel(/pet name/i).fill('Bramble');
    await page.getByLabel(/your name/i).fill('Elena Marsh');
    await page.getByLabel(/email address/i).fill('elena@example.com');
    await page.getByLabel(/phone number/i).fill('(555) 018-7742');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.getByLabel(/preferred date/i).fill(futureDate());
    await chooseRadio(page, 'time-afternoon');
    await expect(page.getByRole('radio', { name: /afternoon/i })).toBeChecked();
    await page.getByLabel(/you can contact me/i).check();
    await page.getByRole('button', { name: /send request/i }).click();

    await expect(
      page.getByRole('heading', { name: /request received/i })
    ).toBeVisible();
    await expect(page.getByText(/PAW-[A-Z0-9]{6}/)).toBeVisible();
    await expect(page.getByText('elena@example.com')).toBeVisible();
  });

  test('an incomplete step reports the problem and takes focus', async ({
    page,
  }) => {
    await page.goto('/booking');
    await page.getByRole('button', { name: /continue/i }).click();

    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toBeFocused();

    // Still on step 1 — the gate held.
    await expect(page.getByText(/step 1 of 3/i)).toBeVisible();
  });

  test('a draft survives a full page reload', async ({ page }) => {
    await page.goto('/booking');
    await chooseRadio(page, 'service-boarding');
    await page.getByRole('button', { name: /continue/i }).click();
    await page.getByLabel(/pet name/i).fill('Nutmeg');

    await page.reload();

    // A real reload, not a remount — this is what an accidental refresh does.
    await expect(page.getByRole('radio', { name: /overnight boarding/i })).toBeChecked();
    await expect(page.getByText('Nutmeg')).toBeVisible();
  });

  test('an unknown service URL shows the 404 page rather than an error', async ({
    page,
  }) => {
    await page.goto('/services/does-not-exist');

    await expect(
      page.getByRole('heading', { level: 1, name: /could not find that page/i })
    ).toBeVisible();
  });
});
