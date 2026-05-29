/**
 * Archivo: subscription.entity.ts
 * Responsabilidad: Representar la entidad de dominio Subscription sin dependencias de framework.
 * Tipo: lógica
 */

export type SubscriptionStatus = "active" | "trialing" | "canceled" | "past_due" | "incomplete";
export type SubscriptionPlanId = "basic" | "pro";

export interface SubscriptionPrimitives {
  id: string;
  restaurantId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: SubscriptionStatus;
  planId: SubscriptionPlanId;
  priceId: string | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEndsAt: Date | null;
  cancelAtPeriodEnd: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionProps {
  id: string;
  restaurantId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  status: SubscriptionStatus;
  planId: SubscriptionPlanId;
  priceId?: string | null;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  trialEndsAt?: Date | null;
  cancelAtPeriodEnd?: boolean;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateSubscriptionProps {
  status?: SubscriptionStatus;
  stripeSubscriptionId?: string | null;
  priceId?: string | null;
  planId?: SubscriptionPlanId;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  trialEndsAt?: Date | null;
  cancelAtPeriodEnd?: boolean;
}

export class Subscription {
  private constructor(private readonly props: SubscriptionPrimitives) {}

  //-aqui empieza funcion create y es para construir una entidad Subscription valida-//
  /**
   * Crea una nueva entidad de dominio Subscription aplicando validaciones de negocio.
   * @pure
   */
  static create(props: CreateSubscriptionProps): Subscription {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("El ID de la suscripción es obligatorio.");
    }
    if (!props.restaurantId || props.restaurantId.trim().length === 0) {
      throw new Error("El restaurantId es obligatorio.");
    }

    const now = new Date();
    const periodStart = props.currentPeriodStart ?? now;
    // Si no se define el fin del periodo, por defecto sumamos 30 días
    const periodEnd =
      props.currentPeriodEnd ?? new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

    return new Subscription({
      id: props.id.trim(),
      restaurantId: props.restaurantId.trim(),
      stripeCustomerId: props.stripeCustomerId?.trim() ?? null,
      stripeSubscriptionId: props.stripeSubscriptionId?.trim() ?? null,
      status: props.status,
      planId: props.planId,
      priceId: props.priceId?.trim() ?? null,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      trialEndsAt: props.trialEndsAt ?? null,
      cancelAtPeriodEnd: props.cancelAtPeriodEnd ?? false,
      version: props.version ?? 1,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }
  //-aqui termina funcion create-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar la entidad desde DB-//
  /**
   * Rehidrata la entidad desde un objeto de datos persistidos.
   * @pure
   */
  static fromPrimitives(props: SubscriptionPrimitives): Subscription {
    return new Subscription(props);
  }
  //-aqui termina funcion fromPrimitives-//

  get id(): string {
    return this.props.id;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get stripeCustomerId(): string | null {
    return this.props.stripeCustomerId;
  }

  get stripeSubscriptionId(): string | null {
    return this.props.stripeSubscriptionId;
  }

  get status(): SubscriptionStatus {
    return this.props.status;
  }

  get planId(): SubscriptionPlanId {
    return this.props.planId;
  }

  get priceId(): string | null {
    return this.props.priceId;
  }

  get currentPeriodStart(): Date {
    return this.props.currentPeriodStart;
  }

  get currentPeriodEnd(): Date {
    return this.props.currentPeriodEnd;
  }

  get trialEndsAt(): Date | null {
    return this.props.trialEndsAt;
  }

  get cancelAtPeriodEnd(): boolean {
    return this.props.cancelAtPeriodEnd;
  }

  get version(): number {
    return this.props.version;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  //-aqui empieza funcion isActive y es para comprobar si la suscripcion o el trial estan activos-//
  /**
   * Devuelve true si la suscripción está en un estado operativo válido ("active" o "trialing")
   * o si se encuentra dentro del periodo de prueba local gratuito (trialEndsAt).
   * @pure
   */
  isActive(): boolean {
    if (this.props.status === "active" || this.props.status === "trialing") {
      return true;
    }

    if (this.props.trialEndsAt !== null && new Date() < this.props.trialEndsAt) {
      return true;
    }

    return false;
  }
  //-aqui termina funcion isActive-//

  //-aqui empieza funcion isTrialActive y es para verificar si se está dentro de la prueba gratuita-//
  /**
   * Indica si la suscripción está operando bajo su periodo de prueba gratuito.
   * @pure
   */
  isTrialActive(): boolean {
    if (this.props.trialEndsAt === null) {
      return false;
    }

    return new Date() < this.props.trialEndsAt;
  }
  //-aqui termina funcion isTrialActive-//

  //-aqui empieza funcion getRemainingTrialDays y es para calcular cuántos días de prueba quedan-//
  /**
   * Calcula el número de días restantes en el periodo de prueba gratuito.
   * Si no está en trial o ha expirado, devuelve 0.
   * @pure
   */
  getRemainingTrialDays(): number {
    if (!this.isTrialActive() || this.props.trialEndsAt === null) {
      return 0;
    }

    const diffMs = this.props.trialEndsAt.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }
  //-aqui termina funcion getRemainingTrialDays-//

  //-aqui empieza funcion updateDetails y es para realizar modificaciones inmutables del estado-//
  /**
   * Devuelve una nueva instancia de la suscripción con datos actualizados.
   * Incrementa la versión automáticamente.
   * @pure
   */
  updateDetails(props: UpdateSubscriptionProps): Subscription {
    return new Subscription({
      ...this.props,
      status: props.status ?? this.props.status,
      stripeSubscriptionId:
        props.stripeSubscriptionId !== undefined
          ? props.stripeSubscriptionId
          : this.props.stripeSubscriptionId,
      priceId: props.priceId !== undefined ? props.priceId : this.props.priceId,
      planId: props.planId !== undefined ? props.planId : this.props.planId,
      currentPeriodStart: props.currentPeriodStart ?? this.props.currentPeriodStart,
      currentPeriodEnd: props.currentPeriodEnd ?? this.props.currentPeriodEnd,
      trialEndsAt: props.trialEndsAt !== undefined ? props.trialEndsAt : this.props.trialEndsAt,
      cancelAtPeriodEnd: props.cancelAtPeriodEnd ?? this.props.cancelAtPeriodEnd,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion updateDetails-//

  //-aqui empieza funcion toPrimitives y es para serializar los datos de la suscripcion-//
  /**
   * Convierte la suscripción en tipos primitivos serializables para base de datos o API.
   * @pure
   */
  toPrimitives(): SubscriptionPrimitives {
    return {
      id: this.props.id,
      restaurantId: this.props.restaurantId,
      stripeCustomerId: this.props.stripeCustomerId,
      stripeSubscriptionId: this.props.stripeSubscriptionId,
      status: this.props.status,
      planId: this.props.planId,
      priceId: this.props.priceId,
      currentPeriodStart: this.props.currentPeriodStart,
      currentPeriodEnd: this.props.currentPeriodEnd,
      trialEndsAt: this.props.trialEndsAt,
      cancelAtPeriodEnd: this.props.cancelAtPeriodEnd,
      version: this.props.version,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
  //-aqui termina funcion toPrimitives-//
}
