import { test, expect } from '@playwright/test'
const forms = {
  '1s': 'hablo',
  '2s': 'hablas',
  '3s': 'habla',
  '1p': 'hablamos',
  '2p': 'habláis',
  '3p': 'hablan'
}
const response = {
  verb: { root: 'habl' },
  conjugation: { 'present-tense': forms },
  availability: { 'present-tense': Object.keys(forms) }
}
test.beforeEach(async ({ page }) => {
  await page.route('**/conjugate/**', (route) => route.fulfill({ json: response }))
})
test('complete an exercise, show solutions and reset for the next verb', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Presente de indicativo')).toBeVisible()
  const subject = await page.locator('.answer-subject').textContent()
  const key = { yo: '1s', tú: '2s', él: '3s', nosotros: '1p', vosotros: '2p', ellos: '3p' }[
    subject.trim()
  ]
  await page.getByLabel('Presente de indicativo').fill(forms[key])
  await expect(page.getByText('¡Perfecto!', { exact: true })).toBeVisible()
  await expect(page.getByText('1 / 20 ejercicios completados')).toBeVisible()
  await page.getByRole('button', { name: 'Ver conjugaciones' }).click()
  await expect(page.getByRole('heading', { name: 'Presente de indicativo' })).toBeVisible()
  await page.getByRole('button', { name: 'Siguiente verbo' }).click()
  await expect(page.getByLabel('Presente de indicativo')).toHaveValue('')
  await expect(page.getByRole('heading', { name: 'Presente de indicativo' })).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  )
})
test('settings search, empty selection persistence and keyboard dismissal', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Elegir los verbos' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('searchbox').fill('recevoir')
  await expect(page.locator('.selection-row')).toHaveCount(1)
  await page.getByRole('searchbox').fill('')
  await page.getByRole('button', { name: 'Desmarcar todos', exact: true }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByRole('alert')).toContainText('Selecciona al menos un verbo')
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Selecciona al menos un verbo')
  await page.getByRole('button', { name: 'Elegir los verbos' }).click()
  await page.getByRole('button', { name: 'Seleccionar todos', exact: true }).click()
  await page.getByRole('button', { name: 'A practicar' }).click()
  await expect(page.getByLabel('Presente de indicativo')).toBeVisible()
})
test('failed requests can be retried', async ({ page }) => {
  await page.route('**/conjugate/**', (route) =>
    route.fulfill({ status: 503, json: { error: 'Service unavailable' } })
  )
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('No se pudo cargar el ejercicio')
  await page.unroute('**/conjugate/**')
  await page.route('**/conjugate/**', (route) => route.fulfill({ json: response }))
  await page.getByRole('button', { name: 'Reintentar' }).click()
  await expect(page.getByLabel('Presente de indicativo')).toBeVisible()
})
test('outdated requests do not overwrite the latest exercise', async ({ page }) => {
  let requestNumber = 0
  await page.route('**/conjugate/**', async (route) => {
    requestNumber++
    const first = requestNumber === 1
    if (first) await new Promise((resolve) => setTimeout(resolve, 700))
    await route
      .fulfill({
        json: {
          ...response,
          conjugation: {
            'present-tense': Object.fromEntries(
              Object.keys(forms).map((key) => [key, first ? 'old' : 'new'])
            )
          }
        }
      })
      .catch(() => {})
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir los ajustes' }).click()
  await page.getByRole('button', { name: 'A practicar' }).click()
  await expect(page.getByLabel('Presente de indicativo')).toBeVisible()
  await page.waitForTimeout(800)
  await page.getByLabel('Presente de indicativo').fill('new')
  await expect(page.getByText('¡Perfecto!', { exact: true })).toBeVisible()
})

test('flat verb list supports sorting and selection within search results', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Elegir los verbos' }).click()
  await expect(page.locator('.selection-row').first()).toContainText('ser')
  await page.getByLabel('Ordenar por', { exact: true }).selectOption('difficulty')
  await expect(page.locator('.selection-row').first()).toContainText('Fácil')
  await page.getByRole('searchbox').fill('recevoir')
  await expect(page.locator('.selection-row')).toHaveCount(1)
  await page.getByRole('button', { name: 'Desmarcar resultados', exact: true }).click()
  await expect(page.getByRole('checkbox')).not.toBeChecked()
  await page.getByRole('button', { name: 'Seleccionar resultados', exact: true }).click()
  await expect(page.getByRole('checkbox')).toBeChecked()
  await page.getByRole('button', { name: 'Cerrar los ajustes' }).click()
  await page.getByRole('button', { name: 'Elegir los verbos' }).click()
  await expect(page.getByLabel('Ordenar por', { exact: true })).toHaveValue('difficulty')
})

test('study language translates the interface and reverses bilingual labels', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await page.getByRole('button', { name: 'Abrir los ajustes' }).click()
  await page.getByRole('button', { name: 'Tiempos', exact: true }).click()
  await expect(
    page
      .locator('.selection-row')
      .filter({ hasText: 'Pretérito imperfecto' })
      .locator('span')
      .first()
  ).toHaveText('Pretérito imperfecto')
  await page.getByRole('button', { name: 'General', exact: true }).click()
  await page.locator('#languageSetting').selectOption('fr')
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(page.getByRole('heading', { name: 'Votre entraînement' })).toBeVisible()
  await page.getByRole('button', { name: 'Temps', exact: true }).click()
  await expect(
    page
      .locator('.selection-row')
      .filter({ hasText: 'Pretérito imperfecto' })
      .locator('span')
      .first()
  ).toHaveText('Imparfait')
  await page.getByRole('button', { name: 'Verbes', exact: true }).click()
  await expect(page.locator('.selection-row').first().locator('span').first()).toContainText('être')
  await expect(page.getByRole('status')).toContainText('199')
  await page.getByRole('button', { name: 'Général', exact: true }).click()
  await page.locator('#languageSetting').selectOption('es')
  await page.getByRole('button', { name: 'Verbos', exact: true }).click()
  await expect(page.locator('.selection-row').first().locator('span').first()).toHaveText('ser')
})
