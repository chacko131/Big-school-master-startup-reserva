/**
 * Archivo: OnboardingShell.tsx
 * Responsabilidad: Proveer el shell reutilizable del onboarding protegido del restaurante.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { T } from "@/components/T";
import type { OnboardingActionDefinition, OnboardingStepDefinition } from "@/types/onboarding";
import { OnboardingIcon } from "./OnboardingIcon";

interface OnboardingShellProps {
  title: string;
  currentStepNumber: number;
  totalSteps: number;
  steps: OnboardingStepDefinition[];
  mobilePrimaryAction: OnboardingActionDefinition;
  mobileSecondaryAction?: OnboardingActionDefinition;
  children: ReactNode;
}

const shellActionBaseClassName = "flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold uppercase tracking-[0.18em] transition-all duration-150";
const onboardingShellAvatarSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuDMqlPZVNQuPAmsHCYOlGvvdiyboRu-eEeCS_S-rPyzgtA1idn4u0ZDVUBMDRf7WJM5DjnZ0eET6lVQpUEqphh9vEnRGEzL2CvNx6tMXEHJ8FkMbU6jBjnXK73bhetNqMYtPpdy0jhnz3kxWWvS3mQxjSmykbtHAfyB9CLDJky7BreBnwYmbEyydTfF1r0PtaZSRQMBn47tqd7Gnxyz9Kamk5K5m2eSKC8dsrGRZa8smhH2NxZDb6vW3X_TZACxkE5GPqXLbSPyrEM";

//-aqui empieza funcion renderShellAction y es para resolver acciones reutilizables del shell-//
function renderShellAction(action: OnboardingActionDefinition, variant: "primary" | "secondary") {
  const variantClassName =
    variant === "primary"
      ? "bg-primary text-on-primary hover:opacity-90"
      : "text-on-surface-variant hover:text-on-surface";

  const content = (
    <>
      <OnboardingIcon name={action.icon} className="h-4 w-4" />
      <span className="text-[11px]">
        <T>{action.label}</T>
      </span>
    </>
  );

  if (action.href) {
    return (
      <Link className={`${shellActionBaseClassName} ${variantClassName}`} href={action.href}>
        {content}
      </Link>
    );
  }

  return (
    <button className={`${shellActionBaseClassName} ${variantClassName}`} type="button">
      {content}
    </button>
  );
}
//-aqui termina funcion renderShellAction-//

//-aqui empieza componente OnboardingShell y es para reutilizar el marco del flujo de onboarding-//
/**
 * Renderiza la estructura compartida del onboarding con sidebar, headers y acciones móviles.
 */
export function OnboardingShell({
  title,
  currentStepNumber,
  totalSteps,
  steps,
  mobilePrimaryAction,
  mobileSecondaryAction,
  children,
}: OnboardingShellProps) {
  const progressWidth = `${(currentStepNumber / totalSteps) * 100}%`;

  return (
    <div className="min-h-screen bg-surface text-on-surface md:flex md:overflow-hidden">
      <header className="sticky top-0 z-40 border-b border-outline-variant/30 bg-surface md:hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-on-surface transition-colors hover:bg-surface-container" type="button">
              <OnboardingIcon name="close" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-primary">
              <T>Onboarding</T>
            </h1>
          </div>
          <span className="text-sm font-semibold text-on-surface-variant">
            <T>{`Paso ${currentStepNumber} de ${totalSteps}`}</T>
          </span>
        </div>
        <div className="h-1 w-full bg-surface-container">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: progressWidth }} />
        </div>
      </header>

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-transparent bg-surface-container-lowest p-6 md:flex">
          <div className="mb-10">
            <span className="whitespace-nowrap text-lg font-bold tracking-tight text-primary">Reserva Latina</span>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-on-primary-container">
              <T>Guía de configuración</T>
            </h3>
            <div className="mb-2 flex items-center gap-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: progressWidth }} />
              </div>
              <span className="text-[10px] font-bold text-primary">{currentStepNumber}/{totalSteps}</span>
            </div>
            <p className="text-[11px] font-medium leading-tight text-on-surface-variant">
              <T>Progreso del onboarding</T>
            </p>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {steps.map((step) => {
              const iconName = step.status === "completed" ? "checkCircle" : step.icon;
              const itemClassName =
                step.status === "current"
                  ? "bg-primary text-on-primary"
                  : step.status === "completed"
                    ? "text-on-surface-variant opacity-70"
                    : "text-on-surface-variant hover:bg-surface-container-low";
              const itemContent = (
                <>
                  <OnboardingIcon name={iconName} className="h-5 w-5" />
                  <span>
                    <T>{step.label}</T>
                  </span>
                </>
              );

              if (step.status === "current") {
                return (
                  <div
                    key={step.key}
                    aria-current="step"
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${itemClassName}`}
                  >
                    {itemContent}
                  </div>
                );
              }

              return (
                <Link
                  key={step.key}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${itemClassName}`}
                  href={step.href}
                >
                  {itemContent}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex items-center gap-3 pt-6">
            <Image
              alt="Avatar del propietario del restaurante"
              className="h-8 w-8 rounded-full object-cover"
              height={32}
              src={onboardingShellAvatarSrc}
              width={32}
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-on-surface">Julian Rossi</p>
              <p className="truncate text-[10px] text-on-surface-variant">
                <T>Owner</T>
              </p>
            </div>
          </div>
      </aside>

      <main className="flex min-h-screen min-w-0 flex-1 flex-col overflow-y-auto bg-surface-container-low">
        <header className="sticky top-0 z-30 hidden items-center justify-between bg-surface-container-lowest px-8 py-4 md:flex">
            <h2 className="whitespace-nowrap text-lg font-black uppercase tracking-[0.14em] text-primary">
              <T>{title}</T>
            </h2>
            <div className="flex items-center gap-5 text-on-surface-variant">
              <button className="transition-colors hover:text-on-surface" type="button">
                <OnboardingIcon name="help" />
              </button>
              <button className="transition-colors hover:text-on-surface" type="button">
                <OnboardingIcon name="accountCircle" />
              </button>
            </div>
          </header>

          <div className="flex flex-1 items-start justify-center p-6 pb-32 md:p-8 lg:p-16 lg:pb-16">
            {children}
          </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-outline-variant/20 bg-surface-container-lowest/90 px-4 py-4 backdrop-blur-md md:hidden">
        {mobileSecondaryAction ? renderShellAction(mobileSecondaryAction, "secondary") : <div />}
        <div className="flex-1">{renderShellAction(mobilePrimaryAction, "primary")}</div>
      </nav>
    </div>
  );
}
//-aqui termina componente OnboardingShell-//
