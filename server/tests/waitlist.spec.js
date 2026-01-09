const { test, expect } = require('@playwright/test');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://implementer:implementer@localhost:5434/implementer_io'
});

async function getSignupByEmail(email) {
  const result = await pool.query('SELECT * FROM signups WHERE email = $1', [email]);
  return result.rows[0];
}

async function deleteSignupByEmail(email) {
  await pool.query('DELETE FROM signups WHERE email = $1', [email]);
}

test.describe('Waitlist Signup', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('submits email from modal and creates database record', async ({ page }) => {
    const testEmail = `modal-test-${Date.now()}@example.com`;

    // Clean up any existing record
    await deleteSignupByEmail(testEmail);

    // Click "Get Early Access" button in nav to open modal
    await page.click('.header-btn .open-modal');
    await expect(page.locator('#early-access-modal')).toBeVisible();

    // Fill in email and submit
    await page.fill('#modal-email', testEmail);
    await page.click('#early-access-form button[type="submit"]');

    // Wait for success message
    await expect(page.locator('#form-success')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#form-success')).toContainText("You're on the list!");

    // Verify database record was created
    const signup = await getSignupByEmail(testEmail);
    expect(signup).toBeTruthy();
    expect(signup.email).toBe(testEmail);
    expect(signup.source).toBe('website');
    expect(signup.created_at).toBeTruthy();

    // Clean up
    await deleteSignupByEmail(testEmail);
  });

  test('submits email from footer and creates database record', async ({ page }) => {
    const testEmail = `footer-test-${Date.now()}@example.com`;

    // Clean up any existing record
    await deleteSignupByEmail(testEmail);

    // Scroll to footer and fill form
    await page.locator('#footer-signup-form').scrollIntoViewIfNeeded();
    await page.fill('#footer-signup-form input[name="email"]', testEmail);
    await page.click('#footer-signup-form button[type="submit"]');

    // Wait for success message
    await expect(page.locator('#footer-success')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#footer-success')).toContainText("You're on the list!");

    // Verify database record was created
    const signup = await getSignupByEmail(testEmail);
    expect(signup).toBeTruthy();
    expect(signup.email).toBe(testEmail);
    expect(signup.source).toBe('website');
    expect(signup.created_at).toBeTruthy();

    // Clean up
    await deleteSignupByEmail(testEmail);
  });

  test('does not create duplicate records for same email', async ({ page }) => {
    const testEmail = `dupe-test-${Date.now()}@example.com`;

    // Clean up any existing record
    await deleteSignupByEmail(testEmail);

    // First submission via modal
    await page.click('.header-btn .open-modal');
    await expect(page.locator('#early-access-modal')).toBeVisible();
    await page.fill('#modal-email', testEmail);
    await page.click('#early-access-form button[type="submit"]');
    await expect(page.locator('#form-success')).toBeVisible({ timeout: 5000 });

    // Close modal
    await page.keyboard.press('Escape');
    await expect(page.locator('#early-access-modal')).not.toBeVisible();

    // Second submission via footer (same email)
    await page.locator('#footer-signup-form').scrollIntoViewIfNeeded();
    await page.fill('#footer-signup-form input[name="email"]', testEmail);
    await page.click('#footer-signup-form button[type="submit"]');
    await expect(page.locator('#footer-success')).toBeVisible({ timeout: 5000 });

    // Verify only one record exists
    const result = await pool.query('SELECT COUNT(*) FROM signups WHERE email = $1', [testEmail]);
    expect(parseInt(result.rows[0].count)).toBe(1);

    // Clean up
    await deleteSignupByEmail(testEmail);
  });

  test('shows error for invalid email in modal', async ({ page }) => {
    await page.click('.header-btn .open-modal');
    await expect(page.locator('#early-access-modal')).toBeVisible();

    // Try to submit with invalid email
    await page.fill('#modal-email', 'invalid-email');
    await page.click('#early-access-form button[type="submit"]');

    // Browser validation should prevent submission
    await expect(page.locator('#form-success')).not.toBeVisible();
  });

  test('closes modal when clicking X button', async ({ page }) => {
    await page.click('.header-btn .open-modal');
    await expect(page.locator('#early-access-modal')).toBeVisible();
    await page.click('#modal-close');
    await expect(page.locator('#early-access-modal')).not.toBeVisible();
  });

  test('closes modal when pressing Escape', async ({ page }) => {
    await page.click('.header-btn .open-modal');
    await expect(page.locator('#early-access-modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#early-access-modal')).not.toBeVisible();
  });

  test('closes modal when clicking overlay', async ({ page }) => {
    await page.click('.header-btn .open-modal');
    await expect(page.locator('#early-access-modal')).toBeVisible();
    await page.locator('#early-access-modal').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#early-access-modal')).not.toBeVisible();
  });

});

test.afterAll(async () => {
  await pool.end();
});
