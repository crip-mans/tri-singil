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
    <div className="fixed inset-x-4 top-20 z-[1100] flex items-center justify-between gap-3 rounded-2xl bg-gray-900/95 px-4 py-3 text-white shadow-xl">
      <p className="text-sm">Add Tri-Singil to your home screen.</p>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={handleInstall}
          className="rounded-full bg-orange-600 px-3 py-1.5 text-sm font-semibold"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="rounded-full border border-white/30 px-3 py-1.5 text-sm"
        >
          Not now
        </button>
      </div>
    </div>
  )
}

export default InstallPrompt
