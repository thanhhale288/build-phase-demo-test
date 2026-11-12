import denylist from '../data/denylist.json'
import type { InspectResult } from './types.ts'

type DenylistFile = {
  injection_patterns: string[]
  unsafe_release_patterns: string[]
}

const data = denylist as DenylistFile

const PATTERNS: { source: string; regex: RegExp }[] = [
  ...data.injection_patterns,
  ...data.unsafe_release_patterns,
].map((source) => ({ source, regex: new RegExp(source, 'i') }))

export function inspectQuery(text: string): InspectResult {
  const sample = text.trim()
  if (!sample) return { blocked: false }
  for (const item of PATTERNS) {
    if (item.regex.test(sample)) {
      return { blocked: true, matched: item.source }
    }
  }
  return { blocked: false }
}
