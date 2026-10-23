import { LegalTextPage } from './LegalTextPage'

const SECTIONS = [
  'provider',
  'service',
  'contract',
  'account',
  'notes',
  'duration',
  'data',
  'changes',
  'disputes',
] as const

export default function TermsPage() {
  return <LegalTextPage text="terms" sections={SECTIONS} />
}
