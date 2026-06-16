#!/usr/bin/env node
// Locale consistency check. en.json is the reference; every other src/locales/*.json
// must have EXACTLY the same keys, no empty values, and the same ICU placeholders
// ({name}) per value. Exits non-zero on any mismatch — wired into pre-commit.
//
// Run: npm run check-locales   (from web/)
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const localesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'locales')
const REFERENCE = 'en.json'

const load = (file) => JSON.parse(readFileSync(join(localesDir, file), 'utf8'))
const placeholders = (value) => new Set([...String(value).matchAll(/\{(\w+)\}/g)].map((m) => m[1]))

const ref = load(REFERENCE)
const refKeys = Object.keys(ref)
const refKeySet = new Set(refKeys)
const others = readdirSync(localesDir)
  .filter((f) => f.endsWith('.json') && f !== REFERENCE)
  .sort()

let failed = false

console.log(`Reference: ${REFERENCE} — ${refKeys.length} keys`)
console.log(`Checking ${others.length} locale(s): ${others.join(', ')}\n`)

for (const file of others) {
  const data = load(file)
  const keys = new Set(Object.keys(data))
  console.log(`${file} — ${keys.size} keys`)

  const problems = []
  const flag = (msg) => problems.push(msg)

  for (const key of refKeys) {
    if (!keys.has(key)) flag(`missing key: ${key}`)
  }
  for (const key of keys) {
    if (!refKeySet.has(key)) flag(`extra key (not in ${REFERENCE}): ${key}`)
  }

  for (const key of refKeys) {
    if (!keys.has(key)) continue
    const value = data[key]
    if (typeof value !== 'string' || value.trim() === '') {
      flag(`empty value: ${key}`)
      continue
    }
    const expected = placeholders(ref[key])
    const actual = placeholders(value)
    const missingPh = [...expected].filter((p) => !actual.has(p))
    const extraPh = [...actual].filter((p) => !expected.has(p))
    if (missingPh.length || extraPh.length) {
      flag(`placeholder mismatch "${key}": expected {${[...expected].join(', ')}} got {${[...actual].join(', ')}}`)
    }
  }

  if (problems.length) {
    failed = true
    problems.forEach((p) => console.error(`  ✗ ${p}`))
  } else {
    console.log('  ✓ keys, values and placeholders match')
  }
  console.log('')
}

if (failed) {
  console.error('Locale check FAILED — fix the issues above before committing.')
  process.exit(1)
}
console.log('✓ All locales are consistent with the reference.')
