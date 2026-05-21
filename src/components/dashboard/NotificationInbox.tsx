'use client';

import { Inbox } from '@novu/nextjs';
import { useUser } from '@clerk/nextjs';

export default function NotificationInbox() {
  const { user, isLoaded } = useUser();
  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER;

  if (!isLoaded || !user || !applicationIdentifier) {
    return null;
  }

  return (
    <Inbox
      applicationIdentifier={applicationIdentifier}
      subscriberId={user.id}
      backendUrl="https://novu.belenquantum.online/api"
      socketUrl="wss://novu.belenquantum.online/ws"
      appearance={{
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
          notificationList: {
            borderRadius: '12px',
          },
        },
      }}
    />
  );
}
