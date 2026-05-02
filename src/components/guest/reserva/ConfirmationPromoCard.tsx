/**
 * Archivo: ConfirmationPromoCard.tsx
 * Responsabilidad: Mostrar una sección de promoción o upsell en la confirmación.
 * Tipo: UI
 */

import { T } from "@/components/T";

interface ConfirmationPromoCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  imageUrl?: string;
}

//-aqui empieza funcion ConfirmationPromoCard y es para mostrar banners promocionales-//
/**
 * @pure
 */
export function ConfirmationPromoCard({
  title = "Hazlo especial",
  description = "¿Celebras algo especial? Permítenos preparar una experiencia personalizada para tu llegada.",
  buttonText = "Ver menú de experiencias",
  imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuC5gjfCBt3hs1XQwkvNLJL5AdJHx6vC1UfAi6VFBZh1FPytxBA0HGqFHfEB6oyJ1xnLzBcp09evlju69ctHkik5e3Gy8ENj7LSD3QWVtxn4AdD2oS1l0rTziICnB94hvB5Oc2liqy7Fqkf2TD8LYu5SCjevMl6Ctj_Xj1nqOTtS92JKGiq67NNaDiH6f2f8v33RTobM8aWoWNOtRoJYBtmZUsmOMd0QwoEg2eyuRmudJ2ds57KfTwdrnkP6t1N0pGNOLe4wQUHLZPo",
}: ConfirmationPromoCardProps) {
  return (
    <section className="mx-auto mt-12 max-w-5xl px-6">
      <div className="relative flex h-64 items-center overflow-hidden rounded-2xl bg-black p-12">
        <img
          alt="Luxury background"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          src={imageUrl}
        />
        <div className="relative z-10 max-w-lg">
          <h2 className="mb-2 text-3xl font-bold italic text-white">
            <T>{title}</T>
          </h2>
          <p className="mb-6 text-zinc-300">
            <T>{description}</T>
          </p>
          <button
            className="rounded-lg bg-white px-8 py-3 font-bold text-black transition-colors hover:bg-zinc-200"
            type="button"
          >
            <T>{buttonText}</T>
          </button>
        </div>
      </div>
    </section>
  );
}
//-aqui termina funcion ConfirmationPromoCard-//
