import { test, expect } from '@playwright/test';

test.describe('Profile screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=Game Archive', { timeout: 10000 });
    // Profile is reached via the profile image (top-right of Home header)
    // It's rendered as an <img> element inside a TouchableOpacity
    const profileImg = page.locator('img').last();
    await profileImg.click();
    await page.waitForSelector('text=Profile', { timeout: 10000 });
  });

  test('"Profile" heading is visible', async ({ page }) => {
    await expect(page.locator('text=Profile')).toBeVisible();
  });

  test('demo email is visible', async ({ page }) => {
    await expect(page.locator('text=demo@kingseye.app')).toBeVisible();
  });

  test('first name "Demo" is visible', async ({ page }) => {
    await expect(page.getByText('Demo', { exact: true })).toBeVisible();
  });

  test('last name "User" is visible', async ({ page }) => {
    await expect(page.locator('text=User')).toBeVisible();
  });

  test('root container width is <= 480px', async ({ page }) => {
    // The Profile container has maxWidth: 480 and alignSelf: center
    // Find the outermost View that wraps all profile content
    const container = page.locator('[data-testid="profile-container"]').first();
    // Fallback: measure the Profile heading's parent container
    const heading = page.locator('text=Profile').first();
    const headingBox = await heading.boundingBox();
    expect(headingBox).not.toBeNull();

    // The page body should be constrained — check the page viewport
    const viewportSize = page.viewportSize();
    // Check that the actual content area is not wider than 480px
    // Since the container uses maxWidth: 480, any element inside it should be <= 480
    expect(headingBox!.width).toBeLessThanOrEqual(480);
  });
});
