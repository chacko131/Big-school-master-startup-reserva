/**
 * Archivo: NotificationBanner.tsx
 * Responsabilidad: Renderizar mensajes de estado reutilizables para formularios y acciones UI.
 * Tipo: UI
 */

"use client";

import { useEffect, useState } from "react";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

export type NotificationBannerTone = "success" | "error" | "info";

interface NotificationBannerProps {
  tone: NotificationBannerTone;
  title: string;
  description?: string;
  autoDismissMs?: number;
}

interface NotificationBannerToneDefinition {
  containerClassName: string;
  titleClassName: string;
  descriptionClassName: string;
  iconClassName: string;
  iconName: "checkCircle" | "close" | "help";
  role: "status" | "alert";
}

const notificationBannerToneDefinitions: Record<NotificationBannerTone, NotificationBannerToneDefinition> = {
  success: {
    containerClassName: "border-secondary/20 bg-secondary/10",
    titleClassName: "text-secondary",
    descriptionClassName: "text-secondary/80",
    iconClassName: "bg-secondary-container text-secondary",
    iconName: "checkCircle",
    role: "status",
  },
  error: {
    containerClassName: "border-error/20 bg-error/5",
    titleClassName: "text-error",
    descriptionClassName: "text-error/80",
    iconClassName: "bg-error/10 text-error",
    iconName: "close",
    role: "alert",
  },
  info: {
    containerClassName: "border-primary/20 bg-primary/5",
    titleClassName: "text-primary",
    descriptionClassName: "text-primary/80",
    iconClassName: "bg-primary/10 text-primary",
    iconName: "help",
    role: "status",
  },
};

//-aqui empieza componente NotificationBanner y es para mostrar feedback visual reutilizable-//
/**
 * Muestra una notificación flotante con icono, título y texto opcional.
 *
 * @sideEffect
 */
export function NotificationBanner(props: NotificationBannerProps) {
  const bannerKey = `${props.tone}-${props.title}-${props.description ?? ""}-${props.autoDismissMs ?? 5000}`;

  return <NotificationBannerSurface key={bannerKey} {...props} />;
}

type NotificationBannerSurfaceProps = NotificationBannerProps;

//-aqui empieza componente NotificationBannerSurface y es para controlar el auto-dismiss del banner-//
/**
 * Mantiene visible el banner y lo oculta automáticamente después de un tiempo.
 *
 * @sideEffect
 */
function NotificationBannerSurface({ tone, title, description, autoDismissMs = 5000 }: NotificationBannerSurfaceProps) {
  const toneDefinition = notificationBannerToneDefinitions[tone];
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismissMs <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, autoDismissMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [autoDismissMs, description, title, tone]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-md gap-3 rounded-2xl border px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.18)] sm:right-6 sm:top-6 sm:w-full sm:px-5 sm:py-4 ${toneDefinition.containerClassName}`} role={toneDefinition.role} aria-live={toneDefinition.role === "alert" ? "assertive" : "polite"}>
      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneDefinition.iconClassName}`}>
        <OnboardingIcon name={toneDefinition.iconName} className="h-4 w-4" />
      </div>

      <div className="min-w-0 space-y-1">
        <p className={`text-sm font-black tracking-tight ${toneDefinition.titleClassName}`}>
          <T>{title}</T>
        </p>
        {description ? (
          <p className={`text-sm leading-6 ${toneDefinition.descriptionClassName}`}>
            <T>{description}</T>
          </p>
        ) : null}
      </div>
    </div>
  );
}
//-aqui termina componente NotificationBannerSurface-//
//-aqui termina componente NotificationBanner-//
