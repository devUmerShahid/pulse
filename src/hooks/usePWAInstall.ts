// src/hooks/usePWAInstall.ts
import { useState, useEffect, useCallback } from 'react';

/** Non-standard Chromium event fired when the app meets installability criteria. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * Exposes whether Pulse can be installed as a PWA and a function to trigger
 * the install prompt. `canInstall` becomes true once `beforeinstallprompt`
 * fires (Chrome/Edge/Android over HTTPS) and flips back to false after the
 * user installs or the prompt is dismissed.
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      // Prevent the browser's default (non-actionable) install banner so we can
      // surface our own "Install App" button and call prompt() on demand.
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null);
      setCanInstall(false);
    }
    return choice.outcome === 'accepted';
  }, [deferredPrompt]);

  return { canInstall, install };
}
