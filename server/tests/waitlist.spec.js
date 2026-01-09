const { test, expect } = require('@playwright/test');

test.describe('Waitlist Signup', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('submits email from modal (top nav button)', async ({ page }) => {
    const testEmail = `modal-test-${Date.now()}@example.com`;

    // Click "Get Early Access" button in nav to open modal
    await page.click('.header-btn .open-modal');

    // Wait for modal to be visible
    await expect(page.locator('#early-access-modal')).toBeVisible();

    // Fill in email
    await page.fill('#modal-email', testEmail);

    // Submit form
    await page.click('#early-access-form button[type="submit"]');

    // Wait for success message
    await expect(page.locator('#form-success')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#form-success')).toContainText("You're on the list!");
  });

  test('submits email from footer form', async ({ page }) => {
    const testEmail = `footer-test-${Date.now()}@example.com`;

    // Scroll to footer
    await page.locator('#footer-signup-form').scrollIntoViewIfNeeded();

    // Fill in email
    await page.fill('#footer-signup-form input[name="email"]', testEmail);

    // Submit form
    await page.click('#footer-signup-form button[type="submit"]');

    // Wait for success message
    await expect(page.locator('#footer-success')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#footer-success')).toContainText("You're on the list!");
  });

  test('shows error for invalid email in modal', async ({ page }) => {
    // Open modal
    await page.click('.header-btn .open-modal');
    await expect(page.locator('#early-access-modal')).toBeVisible();

    // Try to submit with invalid email
    await page.fill('#modal-email', 'invalid-email');
    await page.click('#early-access-form button[type="submit"]');

    // Browser validation should prevent submission (required + type=email)
    // Check that success message is NOT shown
    await expect(page.locator('#form-success')).not.toBeVisible();
  });

  test('closes modal when clicking X button', async ({ page }) => {
    // Open modal
    await page.click('.header-btn .open-modal');
    await expect(page.locator('#early-access-modal')).toBeVisible();

    // Click close button
    await page.click('#modal-close');

    // Modal should be hidden
    await expect(page.locator('#early-access-modal')).not.toBeVisible();
  });

  test('closes modal when pressing Escape', async ({ page }) => {
    // Open modal
    await page.click('.header-btn .open-modal');
    await expect(page.locator('#early-access-modal')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Modal should be hidden
    await expect(page.locator('#early-access-modal')).not.toBeVisible();
  });

  test('closes modal when clicking overlay', async ({ page }) => {
    // Open modal
    await page.click('.header-btn .open-modal');
    await expect(page.locator('#early-access-modal')).toBeVisible();

    // Click on overlay (outside modal content)
    await page.locator('#early-access-modal').click({ position: { x: 10, y: 10 } });

    // Modal should be hidden
    await expect(page.locator('#early-access-modal')).not.toBeVisible();
  });

});
