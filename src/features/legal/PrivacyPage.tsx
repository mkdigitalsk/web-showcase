import { LegalTextPage } from './LegalTextPage'

const SECTIONS = [
  'controller',
  'data',
  'purpose',
  'obligation',
  'recipients',
  'transfers',
  'retention',
  'rights',
  'complaint',
  'automated',
  'changes',
] as const

export default function PrivacyPage() {
  return <LegalTextPage text="privacy" sections={SECTIONS} />
}
