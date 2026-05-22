/**
 * Archivo: src/hooks/useNotificationSound.ts
 * Responsabilidad: Escuchar eventos en tiempo real de Novu y reproducir el sonido bell.mp3, controlando autoplay y evitando sonido duplicado en múltiples pestañas.
 * Tipo: hook
 */

import { useEffect, useRef } from 'react';
import { useNovu } from '@novu/nextjs';

interface NotificationResult {
  id: string;
  subject?: string;
  body?: string;
}

interface NotificationReceivedPayload {
  result: NotificationResult;
}

//-aqui empieza hook useNotificationSound y es para gestionar el sonido de notificaciones entrantes-//
/**
 * Custom hook que se suscribe a los eventos websocket de Novu.
 * Cuando recibe una notificación, reproduce bell.mp3.
 * Evita la duplicación del sonido si hay varias pestañas del navegador abiertas usando localStorage.
 * 
 * @sideEffect - Interactúa con localStorage y la API Audio del navegador.
 */
export function useNotificationSound(): void {
  const novu = useNovu();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notification/bell.mp3');
    }
  }, []);

  useEffect(() => {
    if (!novu) return;

    //-aqui empieza funcion playSound y es para reproducir el audio de alerta-//
    // descripción clara de lo que hace:
    // Reproduce el sonido de la campana si no ha sido reproducido por otra pestaña recientemente para la misma notificación.
    const playSound = (notificationId: string) => {
      if (typeof window === 'undefined') return;

      const storageKey = `last_played_notification_${notificationId}`;
      const now = Date.now();

      // Verificar si ya se reprodujo este sonido recientemente (dentro de los últimos 2 segundos)
      const lastPlayed = localStorage.getItem(storageKey);
      if (lastPlayed && now - parseInt(lastPlayed, 10) < 2000) {
        return;
      }

      // Registrar que esta pestaña va a reproducir el sonido
      localStorage.setItem(storageKey, now.toString());

      // Limpiar registros antiguos del localStorage de forma asíncrona para no llenar el almacenamiento
      setTimeout(() => {
        try {
          localStorage.removeItem(storageKey);
        } catch (e) {
          // Ignorar errores de almacenamiento
        }
      }, 5000);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error: unknown) => {
          console.warn('[useNotificationSound] La reproducción del sonido fue bloqueada por el navegador o falló:', error);
        });
      }
    };
    //-aqui termina funcion playSound-//

    //-aqui empieza el registro del listener en Novu websocket-//
    // descripción clara de lo que hace:
    // Se suscribe al evento de recibir notificaciones y dispara la reproducción del sonido.
    const unsubscribe = novu.on('notifications.notification_received', (data: unknown) => {
      const payload = data as NotificationReceivedPayload;
      if (payload?.result?.id) {
        playSound(payload.result.id);
      }
    });
    //-aqui termina el registro-//

    return () => {
      unsubscribe();
    };
  }, [novu]);
}
//-aqui termina hook useNotificationSound-//
