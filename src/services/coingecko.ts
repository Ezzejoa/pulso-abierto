import { MONEDAS } from "../data/monedas";
import type { CryptoMoneda } from "../types/crypto";

// Mismo endpoint de la Actividad 1. Sin clave privada dentro del frontend.
const API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd";

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return valor !== null && typeof valor === "object" && !Array.isArray(valor);
}

/** Separa el acceso a la API de los componentes de presentación. */
export async function consultarPrecios(signal?: AbortSignal): Promise<CryptoMoneda[]> {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("CoinGecko recibió demasiadas solicitudes. Esperá un momento y reintentá.");
    }
    throw new Error(`No se pudo consultar CoinGecko (HTTP ${response.status}).`);
  }

  const body: unknown = await response.json();
  if (!esRegistro(body)) {
    throw new Error("La API devolvió una respuesta con un formato inesperado.");
  }

  return MONEDAS.flatMap((moneda): CryptoMoneda[] => {
    const cotizacion = body[moneda.id];
    if (!esRegistro(cotizacion)) {
      return [];
    }
    const precioUsd = cotizacion.usd;
    if (typeof precioUsd !== "number" || !Number.isFinite(precioUsd) || precioUsd < 0) {
      return [];
    }
    return [{ ...moneda, precioUsd }];
  });
}
