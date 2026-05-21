'use client';

import { Inbox } from '@novu/nextjs';
import { useUser } from '@clerk/nextjs';

const BACKEND_URL = process.env.NEXT_PUBLIC_NOVU_BACKEND_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_NOVU_SOCKET_URL;

const INBOX_APPEARANCE = {
  variables: {
    colorPrimary: '#000000',
    colorPrimaryForeground: '#ffffff',
    colorSecondary: '#436653',
    colorSecondaryForeground: '#ffffff',
    colorCounter: '#436653',
    colorCounterForeground: '#ffffff',
    colorBackground: '#ffffff',
    colorForeground: '#1a1c1c',
    colorNeutral: '#cfc4c5',
    colorShadow: 'rgba(26,28,28,0.06)',
  },
  elements: {
    bellIcon: { color: '#4c4546' },
    popoverContent: {
      boxShadow: '0 20px 40px rgba(26,28,28,0.08)',
      border: '1px solid rgba(207,196,197,0.2)',
      borderRadius: '20px',
      backgroundColor: '#ffffff',
    },
    notificationList: { borderRadius: '12px' },
  },
} as const;

//-aqui empieza componente NotificationInbox y es para mostrar el inbox de Novu en el dashboard-//
export default function NotificationInbox() {
  const { user, isLoaded } = useUser();
  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER;

  if (!isLoaded || !user || !applicationIdentifier || !BACKEND_URL || !SOCKET_URL) {
    if (isLoaded && user && (!applicationIdentifier || !BACKEND_URL || !SOCKET_URL)) {
      console.error('[NotificationInbox] Missing Novu configuration', {
        applicationIdentifier,
        backendUrl: BACKEND_URL,
        socketUrl: SOCKET_URL,
      });
    }

    return null;
  }

  return (
    <Inbox
      applicationIdentifier={applicationIdentifier}
      subscriberId={user.id}
      backendUrl={BACKEND_URL}
      socketUrl={SOCKET_URL}
      appearance={INBOX_APPEARANCE}
    />
  );
}
//-aqui termina componente NotificationInbox-//
