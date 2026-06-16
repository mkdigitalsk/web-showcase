import { ContentCopy, ContentPaste, Fullscreen, FullscreenExit, LocationOn, NotificationsActive, Print, RecordVoiceOver, Share, Vibration } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { type ReactNode, useState } from 'react'
import {
  AlertError,
  AlertInfo,
  AlertSuccess,
  Button,
  ElevatedCard,
  Input,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextH6Bold,
} from '../../shared/components'
import { useNotification, useTranslation } from '../../shared/hooks'

function detectBrowser(): string {
  const ua = navigator.userAgent
  if (ua.includes('Edg')) return 'Microsoft Edge'
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  return 'Unknown'
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Box sx={{ minWidth: 120 }}>
        <TextBody1Neutral60>{label}:</TextBody1Neutral60>
      </Box>
      <TextBody1Neutral80>{value}</TextBody1Neutral80>
    </Box>
  )
}

function CapabilityCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <ElevatedCard sx={{ p: 2 }}>
      <TextH6Bold sx={{ mb: 0.5 }}>{title}</TextH6Bold>
      <TextBody1Neutral60 sx={{ mb: 2 }}>{subtitle}</TextBody1Neutral60>
      {children}
    </ElevatedCard>
  )
}

export function CapabilitiesPage() {
  const { t } = useTranslation()

  const [clipboardText, setClipboardText] = useState('Hello from KMP Showcase!')
  const [clipboardResult, setClipboardResult] = useState<string | null>(null)
  const [clipboardError, setClipboardError] = useState<string | null>(null)

  const [geoResult, setGeoResult] = useState<string | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)

  const [speechText, setSpeechText] = useState('Hello! This is a text to speech demo.')
  const [isSpeaking, setIsSpeaking] = useState(false)

  const [isFullscreen, setIsFullscreen] = useState(false)

  const { isSupported: notificationsSupported, permission: notifPermission, notify } = useNotification()
  const [notifTitle, setNotifTitle] = useState(t('capabilities.notifications.defaultTitle'))
  const [notifBody, setNotifBody] = useState(t('capabilities.notifications.defaultBody'))
  const [notifResult, setNotifResult] = useState<string | null>(null)
  const [notifError, setNotifError] = useState<string | null>(null)

  const handleCopy = async () => {
    setClipboardResult(null)
    setClipboardError(null)
    if (!navigator.clipboard) {
      setClipboardError(t('capabilities.clipboard.notSupported'))
      return
    }
    try {
      await navigator.clipboard.writeText(clipboardText)
      setClipboardResult(t('capabilities.clipboard.copied'))
    } catch {
      setClipboardError(t('capabilities.clipboard.notSupported'))
    }
  }

  const handlePaste = async () => {
    setClipboardResult(null)
    setClipboardError(null)
    if (!navigator.clipboard) {
      setClipboardError(t('capabilities.clipboard.notSupported'))
      return
    }
    try {
      const text = await navigator.clipboard.readText()
      setClipboardResult(t('capabilities.clipboard.pasted', { text }))
    } catch {
      setClipboardError(t('capabilities.clipboard.notSupported'))
    }
  }

  const handleGeolocation = () => {
    setGeoResult(null)
    setGeoError(null)
    if (!navigator.geolocation) {
      setGeoError(t('capabilities.geolocation.notSupported'))
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoResult(t('capabilities.geolocation.result', {
          lat: pos.coords.latitude.toFixed(5),
          lng: pos.coords.longitude.toFixed(5),
        }))
        setGeoLoading(false)
      },
      () => {
        setGeoError(t('capabilities.geolocation.denied'))
        setGeoLoading(false)
      },
    )
  }

  const handleSpeak = () => {
    if (!window.speechSynthesis) return
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(speechText)
    utterance.onend = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleShare = async () => {
    if (!navigator.share) return
    try {
      await navigator.share({
        title: 'KMP Showcase',
        text: 'Check out this KMP Showcase app!',
        url: window.location.href,
      })
    } catch {
      // user cancelled — not an error
    }
  }

  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleVibrate = () => {
    if (!navigator.vibrate) return
    navigator.vibrate([100, 50, 100])
  }

  const handleNotify = async () => {
    setNotifResult(null)
    setNotifError(null)
    const outcome = await notify(notifTitle, notifBody)
    if (outcome === 'shown') {
      setNotifResult(t('capabilities.notifications.sent'))
    } else if (outcome === 'denied') {
      setNotifError(t('capabilities.notifications.denied'))
    } else {
      setNotifError(t('capabilities.notifications.notSupported'))
    }
  }

  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const shareSupported = typeof navigator !== 'undefined' && 'share' in navigator
  const vibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  const browser = detectBrowser()

  const notifStatusLabel =
    notifPermission === 'granted'
      ? t('capabilities.notifications.statusGranted')
      : notifPermission === 'denied'
        ? t('capabilities.notifications.statusDenied')
        : t('capabilities.notifications.statusDefault')

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>

        <CapabilityCard
          title={t('capabilities.browser.title')}
          subtitle={t('capabilities.browser.subtitle')}
        >
          <Stack spacing={0.5}>
            <InfoRow label={t('capabilities.browser.name')} value={browser} />
            <InfoRow label={t('capabilities.browser.platform')} value={navigator.platform} />
            <InfoRow label={t('capabilities.browser.language')} value={navigator.language} />
            <InfoRow label={t('capabilities.browser.online')} value={navigator.onLine ? 'Yes' : 'No'} />
            <InfoRow label={t('capabilities.browser.cookiesEnabled')} value={navigator.cookieEnabled ? 'Enabled' : 'Disabled'} />
          </Stack>
        </CapabilityCard>

        <CapabilityCard
          title={t('capabilities.clipboard.title')}
          subtitle={t('capabilities.clipboard.subtitle')}
        >
          <Stack spacing={1}>
            <Input
              value={clipboardText}
              onChange={(e) => setClipboardText(e.target.value)}
              size="small"
            />
            <Stack direction="row" spacing={1}>
              <Button variant="outline" onClick={() => void handleCopy()}>
                <ContentCopy sx={{ mr: 1, fontSize: 16 }} />
                {t('capabilities.clipboard.copy')}
              </Button>
              <Button variant="outline" onClick={() => void handlePaste()}>
                <ContentPaste sx={{ mr: 1, fontSize: 16 }} />
                {t('capabilities.clipboard.paste')}
              </Button>
            </Stack>
            {clipboardResult && <AlertSuccess>{clipboardResult}</AlertSuccess>}
            {clipboardError && <AlertError>{clipboardError}</AlertError>}
          </Stack>
        </CapabilityCard>

        <CapabilityCard
          title={t('capabilities.geolocation.title')}
          subtitle={t('capabilities.geolocation.subtitle')}
        >
          <Stack spacing={1}>
            <Box>
              <Button variant="outline" onClick={handleGeolocation} loading={geoLoading}>
                <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                {t('capabilities.geolocation.get')}
              </Button>
            </Box>
            {geoResult && <AlertSuccess>{geoResult}</AlertSuccess>}
            {geoError && <AlertError>{geoError}</AlertError>}
          </Stack>
        </CapabilityCard>

        <CapabilityCard
          title={t('capabilities.speech.title')}
          subtitle={t('capabilities.speech.subtitle')}
        >
          <Stack spacing={1}>
            <Input
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              size="small"
              multiline
              rows={2}
              placeholder={t('capabilities.speech.placeholder')}
            />
            <Box>
              {speechSupported ? (
                <Button variant="outline" onClick={handleSpeak}>
                  <RecordVoiceOver sx={{ mr: 1, fontSize: 16 }} />
                  {isSpeaking ? t('capabilities.speech.stop') : t('capabilities.speech.speak')}
                </Button>
              ) : (
                <AlertInfo>{t('capabilities.speech.notSupported')}</AlertInfo>
              )}
            </Box>
          </Stack>
        </CapabilityCard>

        <CapabilityCard
          title={t('capabilities.share.title')}
          subtitle={t('capabilities.share.subtitle')}
        >
          {shareSupported ? (
            <Button variant="outline" onClick={() => void handleShare()}>
              <Share sx={{ mr: 1, fontSize: 16 }} />
              {t('capabilities.share.button')}
            </Button>
          ) : (
            <AlertInfo>{t('capabilities.share.notSupported')}</AlertInfo>
          )}
        </CapabilityCard>

        <CapabilityCard
          title={t('capabilities.fullscreen.title')}
          subtitle={t('capabilities.fullscreen.subtitle')}
        >
          <Button variant="outline" onClick={() => void handleFullscreen()}>
            {isFullscreen
              ? <FullscreenExit sx={{ mr: 1, fontSize: 16 }} />
              : <Fullscreen sx={{ mr: 1, fontSize: 16 }} />
            }
            {isFullscreen ? t('capabilities.fullscreen.exit') : t('capabilities.fullscreen.enter')}
          </Button>
        </CapabilityCard>

        <CapabilityCard
          title={t('capabilities.print.title')}
          subtitle={t('capabilities.print.subtitle')}
        >
          <Button variant="outline" onClick={() => window.print()}>
            <Print sx={{ mr: 1, fontSize: 16 }} />
            {t('capabilities.print.button')}
          </Button>
        </CapabilityCard>

        <CapabilityCard
          title={t('capabilities.vibration.title')}
          subtitle={t('capabilities.vibration.subtitle')}
        >
          {vibrationSupported ? (
            <Button variant="outline" onClick={handleVibrate}>
              <Vibration sx={{ mr: 1, fontSize: 16 }} />
              {t('capabilities.vibration.button')}
            </Button>
          ) : (
            <AlertInfo>{t('capabilities.vibration.notSupported')}</AlertInfo>
          )}
        </CapabilityCard>

        <CapabilityCard
          title={t('capabilities.notifications.title')}
          subtitle={t('capabilities.notifications.subtitle')}
        >
          {notificationsSupported ? (
            <Stack spacing={1}>
              <InfoRow label={t('capabilities.notifications.status')} value={notifStatusLabel} />
              <Input
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                size="small"
                label={t('capabilities.notifications.titleLabel')}
              />
              <Input
                value={notifBody}
                onChange={(e) => setNotifBody(e.target.value)}
                size="small"
                label={t('capabilities.notifications.bodyLabel')}
              />
              <Box>
                <Button variant="outline" onClick={() => void handleNotify()}>
                  <NotificationsActive sx={{ mr: 1, fontSize: 16 }} />
                  {t('capabilities.notifications.send')}
                </Button>
              </Box>
              {notifResult && <AlertSuccess>{notifResult}</AlertSuccess>}
              {notifError && <AlertError>{notifError}</AlertError>}
            </Stack>
          ) : (
            <AlertInfo>{t('capabilities.notifications.notSupported')}</AlertInfo>
          )}
        </CapabilityCard>

      </Stack>
    </Box>
  )
}
