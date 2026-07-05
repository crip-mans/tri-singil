import { useEffect, useState } from 'react'

const DISMISS_KEY = 'tri-singil-install-dismissed'

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === 'true'
  )

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    function handleAppInstalled() {
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  if (!deferredPrompt || dismissed) return null

  const handleInstall = async () => {
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true')
    setDismissed(true)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 bg-orange-600 px-4 py-3 text-white shadow-lg">
      <p className="text-sm">
        Add Tri-Singil to your home screen for quick, offline-ready fare lookups.
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={handleInstall}
          className="rounded bg-white px-3 py-1.5 text-sm font-semibold text-orange-600"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="rounded border border-white/60 px-3 py-1.5 text-sm"
        >
          Not now
        </button>
      </div>
    </div>
  )
}

export default InstallPrompt
