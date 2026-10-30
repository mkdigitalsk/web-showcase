import { expect, test, type Locator, type Page, type Request } from '@playwright/test'
import { CONSENT_COOKIES } from '../src/shared/analytics/consent'
import { TRACKER_SETTINGS_PATH } from '../src/shared/errorTracking/trackerSettings'

test.describe.configure({ mode: 'serial' })

/** A fresh account per run, at the reserved example domain — the run's id keeps each run's rows apart. */
const RUN_ID = process.env.E2E_RUN_ID ?? crypto.randomUUID().slice(0, 8)
const EMAIL = `dana+${RUN_ID}@example.com`
/** The server's policy: an upper, a lower, a digit and one of its special characters. */
const PASSWORD = `Dana${RUN_ID}1!`

const CONSENT = 'Consent to measurement and error recording'

let page: Page

/** Every request the journey's page sent to Vercel's measurement or toward the error tracker, in order. */
const measuring: string[] = []

/**
 * Whether [request] measures the visit or records an error:
 * - Vercel's measurement scripts
 * - their beacons
 * - the error tracker's settings
 * - the error tracker's ingest
 */
function measures(request: Request): boolean {
  const { hostname, pathname } = new URL(request.url())
  return pathname.startsWith('/_vercel/') || pathname === TRACKER_SETTINGS_PATH || hostname.endsWith('.sentry.io')
}

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  page.on('request', (request) => {
    if (measures(request)) measuring.push(request.url())
  })
})

test.afterAll(async () => {
  await page.close()
})

/** Where [shown] starts and ends down the window. */
async function spanOf(shown: Locator): Promise<{ top: number; bottom: number }> {
  const box = await shown.boundingBox()
  if (box === null) throw new Error(`${shown.toString()} is not shown`)
  return { top: box.y, bottom: box.y + box.height }
}

async function openFromSidebar(name: string, heading: string) {
  await page.getByRole('navigation').getByRole('link', { name, exact: true }).click()
  await expect(
    page.getByRole('heading', { level: 1, name: heading, exact: true }),
    `${name} did not open`,
  ).toBeAttached()
}

test('a stranger is asked before anything is measured, and an answer is kept', async () => {
  await page.goto('/sign-up')
  const asking = page.getByRole('region', { name: CONSENT })
  await expect(asking).toBeVisible()
  await page.waitForLoadState('networkidle')
  expect(measuring, 'measured before the visitor answered').toEqual([])

  await asking.getByRole('button', { name: 'Reject all' }).click()
  await expect(asking, 'the answer did not take the bar away').toBeHidden()

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
  await expect(asking, 'the answer was not kept').toBeHidden()
  await page.waitForLoadState('networkidle')
  expect(measuring, 'measured after the visitor refused').toEqual([])
})

test('a stranger signs up and lands on the first screen', async () => {
  await page.goto('/sign-up')
  await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
  await expect(page.getByRole('main').getByRole('link', { name: 'terms of use' })).toHaveAttribute('href', '/terms')
  await expect(page.getByRole('main').getByRole('link', { name: 'full notice' })).toHaveAttribute('href', '/privacy')

  await page.getByLabel('Email').fill(EMAIL)
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
  await page.getByRole('button', { name: 'Sign Up' }).click()

  await expect(page).toHaveURL(/\/ui-components$/)
  await expect(page.getByRole('heading', { level: 1, name: 'UI Components', exact: true })).toBeAttached()
})

test('a signed-in page asked again keeps to the window, the footer clear of the bar', async () => {
  for (const name of Object.values(CONSENT_COOKIES)) await page.context().clearCookies({ name })
  await page.reload()
  const asking = page.getByRole('region', { name: CONSENT })
  await expect(asking).toBeVisible()

  const [pageHeight, windowHeight] = await page.evaluate<[number, number]>(
    '[document.documentElement.scrollHeight, window.innerHeight]',
  )
  expect(pageHeight, 'the bar grew the page past the window').toBe(windowHeight)
  const choice = page.getByRole('contentinfo').getByRole('button', { name: 'Measurement and error recording' })
  await expect(choice).toBeInViewport({ ratio: 1 })
  expect((await spanOf(choice)).bottom, 'the bar covers the footer').toBeLessThanOrEqual((await spanOf(asking)).top)

  await asking.getByRole('button', { name: 'Reject all' }).click()
  await expect(asking, 'the answer did not take the bar away').toBeHidden()
})

test('the components answer: a dialog, a notice, a deletable chip', async () => {
  await page.getByRole('button', { name: 'Alert Dialog' }).click()
  const alert = page.getByRole('alertdialog')
  await expect(alert).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(alert, 'Escape did not close the dialog').toBeHidden()
  await expect(page.getByRole('button', { name: 'Alert Dialog' }), 'focus did not return to its trigger').toBeFocused()

  await page.getByRole('button', { name: 'Show Snackbar' }).click()
  await expect(page.getByRole('region', { name: 'Notifications' }).getByText('Saved successfully!')).toBeVisible()

  await page.getByRole('button', { name: 'Remove Deletable', exact: true }).click()
  await expect(page.getByText('Deletable', { exact: true }), 'the chip did not leave').toBeHidden()
  await expect(page.getByRole('button', { name: 'Filter', exact: true })).toBeFocused()
})

test('a note on the server is added, edited and deleted', async () => {
  await openFromSidebar('Networking', 'Notes on the server')
  await expect(page.getByText('No notes yet — add one above')).toBeVisible()
  await page.getByRole('textbox', { name: 'Title' }).fill('Groceries')
  await page.getByRole('textbox', { name: 'Content' }).fill('Milk and bread')
  await page.getByRole('button', { name: 'Add note' }).click()
  await expect(page.getByText('Groceries', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Edit note' }).click()
  await expect(page.getByRole('button', { name: 'Save' }), 'the note did not open for editing').toBeVisible()
  await page.getByRole('textbox', { name: 'Title' }).nth(1).fill('Groceries for Friday')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Groceries for Friday', { exact: true })).toBeVisible()

  await page.reload()
  await expect(
    page.getByText('Groceries for Friday', { exact: true }),
    'the edit did not reach the server',
  ).toBeVisible()

  await page.getByRole('button', { name: 'Delete note' }).click()
  await expect(page.getByText('No notes yet — add one above')).toBeVisible()
})

test("a note in the browser's database is added, found and deleted", async () => {
  await openFromSidebar('Database', 'Database')

  for (const title of ['Groceries', 'Rent']) {
    await page.getByRole('textbox', { name: 'Title' }).fill(title)
    await page.getByRole('button', { name: 'Add Note' }).click()
    await expect(page.getByText(title, { exact: true })).toBeVisible()
  }

  await page.getByPlaceholder('Search notes...').fill('gro')
  await expect(page.getByText('Groceries', { exact: true })).toBeVisible()
  await expect(page.getByText('Rent', { exact: true }), 'the search did not filter').toBeHidden()

  await page.getByPlaceholder('Search notes...').clear()
  await page.getByRole('button', { name: 'Clear All Notes' }).click()
  await expect(page.getByText('No notes yet — add one above')).toBeVisible()
})

test('the device counter survives a reload, and the tab counter clears on its own button', async () => {
  await openFromSidebar('Storage', 'Storage')
  const tabCounter = page.getByText('This tab only').locator('..')
  const deviceCounter = page.getByText('Kept on this device').locator('..')

  await tabCounter.getByRole('button', { name: 'Increase' }).click()
  await deviceCounter.getByRole('button', { name: 'Increase' }).click()
  await deviceCounter.getByRole('button', { name: 'Increase' }).click()
  await page.reload()

  await expect(deviceCounter.getByText('2', { exact: true })).toBeVisible()
  await expect(tabCounter.getByText('1', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Clear this tab' }).click()
  await expect(tabCounter.getByText('0', { exact: true })).toBeVisible()
})

test('the browser capabilities, the privacy notice and the terms open', async () => {
  await openFromSidebar('Capabilities', 'Capabilities')
  await expect(page.getByText('Your Browser')).toBeVisible()

  await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' }).click()
  await expect(page.getByRole('heading', { name: 'Privacy', exact: true })).toBeVisible()

  await page.getByRole('contentinfo').getByRole('link', { name: 'Terms of use' }).click()
  await expect(page.getByRole('heading', { name: 'Terms of use of the showcase apps' })).toBeVisible()
})

test('the account signs out, signs back in, and is deleted', async () => {
  await page.goto('/account')
  await expect(page.getByText(EMAIL)).toBeVisible()

  await page.getByRole('button', { name: 'Sign Out' }).click()
  await expect(page).toHaveURL(/\/sign-in$/)

  await page.getByLabel('Email').fill(EMAIL)
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/\/ui-components$/)

  await openFromSidebar('Account', 'Account')
  await page.getByRole('button', { name: 'Delete account' }).click()
  const dialog = page.getByRole('dialog', { name: 'Delete your account?' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Delete' }).click()
  await expect(page).toHaveURL(/\/sign-in$/)

  await page.getByLabel('Email').fill(EMAIL)
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page.getByText('Invalid email or password'), 'the deleted account still signs in').toBeVisible()
})
