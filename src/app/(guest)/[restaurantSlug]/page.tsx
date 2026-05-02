/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el perfil público del restaurante dentro de la experiencia guest.
 * Tipo: UI
 */

import { getRestaurantProfile } from "@/lib/public/siteContent";
import { PublicNavbar } from "@/components/guest/PublicNavbar";
import { PublicFooter } from "@/components/guest/PublicFooter";
import { ProfileHero } from "@/components/guest/profile/ProfileHero";
import { RestaurantMetrics } from "@/components/guest/profile/RestaurantMetrics";
import { RestaurantGallery } from "@/components/guest/profile/RestaurantGallery";
import { LocationAndHours } from "@/components/guest/profile/LocationAndHours";
import { QuickReservationCard } from "@/components/guest/profile/QuickReservationCard";
import { PrivateEventsCard } from "@/components/guest/profile/PrivateEventsCard";
import { MobileReservationButton } from "@/components/guest/profile/MobileReservationButton";

interface RestaurantProfilePageProps {
  params:
    | {
        restaurantSlug: string;
      }
    | Promise<{
        restaurantSlug: string;
      }>;
}

const heroImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0CJ71HNFb73k8Pz8kZkTS1qpFZYBC-dIjXhLbcW6cTJ7mF0Wy3AhKO4FvhhOK5Gu78s33Jg6XPgLj3EVNQP2mWLRNKFkUBneRlwlN6_GTuXemman3qzP7qguBs-8Bu0C8MIoeeZEhTQ1F8c0EKhN3OVHL8YJG1EpwnHgk3xxQedNcEpjjq-Y7eZRbdVKKglhVT2Z3FhS6ZlEv5AqSJNXHAz71FjuPyWkrjycU_AXXKerMegHx54w07NqWIw-gRkEWkct0z9jnFYs";

const galleryImageDefinitions = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKIay_FKECfTftkODgADEkF7Tx6TDdKbucO2Q4kVp7VYhFbyztz4273CiyDfnDtRFBNOiKvRvs9jI86D03Xn3kwEl5xsTtr42fjcMujJuqQTCeKWVwePfCEFZeXY4FZ1gjP-UDWhrlwqejnLEcxUPrIwHdiApOw5m4H4k6jyrntZMYDGRNIHuweQq3-UAo9bWoiwOfvrKAE5i6B67pSE-JkJI_iTu2UGvsNYVQU1DScaH0v3q-tkUjFy8d0U9lEQiaehJ7Uc9seGU",
    alt: "Close up of a gourmet taco with vibrant salsa and microgreens on a handmade ceramic plate",
    className: "col-span-2 row-span-2 overflow-hidden rounded-2xl aspect-square lg:aspect-auto",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2n7svfl-FqzxQcayPUbTnf3QBNrhkX37iNMUtJQH4K0CYnTWK4OrKb62CWc9ZQYNNcOgn0xqCs14aD9E4Q1ZsD4iu_EEsSCwFy5v7U0XUfvwrFUI1lwXvP7ayh__qA1DMefkIKSR7DkBZOveDJVcaHViYlnc2VYPhzw7B8UouEHQXHlx4vZ7-Uf35P30r7BGpEqCthvy0cLM0ATRU8YsQhVYRIailtsFkaCwC7XuCKFAgOJn3BYsA7NZkRmTmCAXbvPwtpQXHF8Q",
    alt: "Elegant bar area with backlit shelves of mezcal and tequila bottles in a modern rustic style",
    className: "overflow-hidden rounded-2xl aspect-square",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD64OpvoNsW2CgWiPqBcqZArE0uTaHclKwf9kFWmR--7wiGyO4Xgbq-qdjSwEl_xkehxqBommvJcw-fZ7-iGK8zxM8jK4-xKTZQ4Ukk0anVlSDYLxcxcqMAc6MkaS6IcXuWpQaW4KAG1zeinBGGtrNmYDBiV0eDOmisRkMfbGxIJsW6D66Y7wyjFilrtygNp5inbNJQkgTm6rz-2CDdmr8W89aEH4-qZQAltUhAN4hz_mPF-nCVgXLFW-l3lALKHl4UZo2cw-UlVNs",
    alt: "Traditional Mexican mole dish served with rice and colorful garnishes in a sunlit patio setting",
    className: "overflow-hidden rounded-2xl aspect-square",
  },
] as const;

const locationDetailDefinitions = [
  {
    icon: "locationOn",
    title: "Calle Aristóteles 124",
    lines: ["Polanco IV Secc, 11550 Ciudad de México, CDMX"],
  },
  {
    icon: "schedule",
    title: "Horarios de Servicio",
    lines: ["Lun - Jue: 13:00 - 23:00", "Vie - Sáb: 13:00 - 01:00", "Dom: 12:00 - 18:00"],
  },
  {
    icon: "contactMail",
    title: "Contacto",
    lines: ["+52 55 1234 5678", "hola@lahacienda.mx"],
  },
] as const;

//-aqui empieza funcion getRestaurantMetricDefinitions y es para convertir datos del perfil en cards visuales-//
/**
 * @pure
 */
function getRestaurantMetricDefinitions() {
  return [
    {
      label: "Reseñas",
      value: "4.9",
      hint: "Valoración alta para reforzar confianza.",
      icon: "star",
    },
    {
      label: "Precio",
      value: "$$$",
      hint: "Posicionamiento premium para el cliente final.",
      icon: "payments",
    },
    {
      label: "Especialidad",
      value: "Cava",
      hint: "El restaurante se presenta con identidad clara.",
      icon: "restaurant",
    },
    {
      label: "Ubicación",
      value: "Polanco",
      hint: "Referencia geográfica inmediata para el usuario.",
      icon: "distance",
    },
  ] as const;
}
//-aqui termina funcion getRestaurantMetricDefinitions-//

//-aqui empieza funcion RestaurantProfilePage y es para renderizar el perfil publico del restaurante-//
/**
 * Renderiza el perfil público de un restaurante concreto.
 * @pure
 */
export default async function RestaurantProfilePage({ params }: RestaurantProfilePageProps) {
  const { restaurantSlug } = await params;
  const restaurantProfile = getRestaurantProfile(restaurantSlug);
  const restaurantMetricDefinitions = getRestaurantMetricDefinitions();

  return (
    <main className="bg-surface text-on-surface selection:bg-secondary-container">
      <PublicNavbar restaurantSlug={restaurantSlug} buttonText="Reservar Mesa" />

      <div className="relative">
        <ProfileHero 
          displayName={restaurantProfile.displayName}
          subtitle={restaurantProfile.subtitle}
          heroImageUrl={heroImageUrl}
        />

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-16 lg:col-span-8">
              <RestaurantMetrics 
                description={restaurantProfile.description}
                metrics={restaurantMetricDefinitions}
              />

              <RestaurantGallery images={galleryImageDefinitions} />

              <LocationAndHours details={locationDetailDefinitions} />
            </div>

            <aside className="lg:col-span-4">
              <div className="space-y-8 lg:sticky lg:top-32">
                <QuickReservationCard />
                <PrivateEventsCard />
              </div>
            </aside>
          </div>
        </section>
      </div>

      <MobileReservationButton />

      <PublicFooter />
    </main>
  );
}
//-aqui termina pagina RestaurantProfilePage-//
