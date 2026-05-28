/**
 * Archivo: billing.service.port.ts
 * Responsabilidad: Definir la interfaz del puerto para la integración con Stripe (Checkout, Customer Portal y firma de webhooks).
 * Tipo: lógica
 */

export interface CreateCheckoutSessionInput {
  restaurantId: string;
  planId: string;
  priceId: string;
  email: string;
}

export interface CreateCustomerPortalSessionInput {
  stripeCustomerId: string;
  returnUrl: string;
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

export interface InvoiceInfo {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: Date;
  pdfUrl: string | null;
}

export interface BillingService {
  /**
   * Genera una sesión de Stripe Checkout y devuelve la URL para redirigir al usuario.
   * @sideEffect — realiza llamadas de red a la API de Stripe.
   */
  createCheckoutSession(input: CreateCheckoutSessionInput): Promise<{ url: string }>;

  /**
   * Genera la URL del Customer Portal de Stripe para que el usuario gestione sus métodos de cobro y suscripción.
   * @sideEffect — llamadas de red externas.
   */
  createCustomerPortalSession(input: CreateCustomerPortalSessionInput): Promise<{ url: string }>;

  /**
   * Valida la firma de un webhook de Stripe y devuelve el evento correspondiente si es válido.
   * @pure — realiza operaciones criptográficas con el payload sin alterar estados globales de negocio directos.
   */
  constructEvent(
    body: string,
    signature: string,
    webhookSecret: string
  ): Promise<StripeWebhookEvent>;

  /**
   * Obtiene el listado de facturas históricas para un cliente de Stripe.
   * @sideEffect — llamadas de red externas.
   */
  listInvoices(stripeCustomerId: string): Promise<InvoiceInfo[]>;
}
