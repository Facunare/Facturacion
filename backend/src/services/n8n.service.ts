import { env } from "../config/env";

export type FacturacionWebhookPayload = {
  facturacionId: number;
  numeroFactura: string;
  fechaFactura: string;
  importeFacturado: number;
  cliente: {
    id: number;
    nombre: string;
    apellido: string;
    nombreCompleto: string;
    dni: string;
    email: string | null;
    telefono: string | null;
    obraSocial: string | null;
  };
  atencion: {
    id: number;
    fecha: string;
    profesional: string;
    prestacion: string;
    importeOriginal: number;
  };
};

async function notificarFacturacion(
  payload: FacturacionWebhookPayload
): Promise<void> {
  if (!env.n8nWebhookUrl) {
    console.warn(
      "N8N_WEBHOOK_URL no está configurada. No se envió la notificación."
    );
    return;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (env.n8nWebhookSecret) {
    headers["X-Webhook-Secret"] = env.n8nWebhookSecret;
  }

  try {
    const response = await fetch(env.n8nWebhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const responseBody = await response.text();

      throw new Error(
        `n8n respondió con ${response.status}: ${responseBody}`
      );
    }

    console.log(
      `Notificación de factura ${payload.numeroFactura} enviada a n8n.`
    );
  } catch (error) {
    /*
     * No volvemos a lanzar el error.
     * La factura ya fue guardada y no queremos que el frontend
     * crea que la facturación falló solo porque n8n no respondió.
     */
    console.error(
      `La factura ${payload.numeroFactura} fue guardada, pero no pudo notificarse a n8n:`,
      error
    );
  }
}

export const n8nService = {
  notificarFacturacion,
};