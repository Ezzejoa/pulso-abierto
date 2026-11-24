import { afterEach, describe, expect, it, vi } from "vitest";
import { consultarPrecios } from "./coingecko";

afterEach(() => vi.unstubAllGlobals());

describe("Servicio de precios de CoinGecko", () => {
  it("consulta las tres monedas con la misma API y propaga la cancelación", async () => {
    const signal = new AbortController().signal;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ bitcoin: { usd: 91000 }, ethereum: { usd: 3100 }, solana: { usd: 175 } }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const monedas = await consultarPrecios(signal);
    expect(monedas.map(({ id, precioUsd }) => ({ id, precioUsd }))).toEqual([
      { id: "bitcoin", precioUsd: 91000 },
      { id: "ethereum", precioUsd: 3100 },
      { id: "solana", precioUsd: 175 },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd",
      { signal },
    );
  });

  it.each([null, [], "incorrecto"])("rechaza una respuesta de formato incorrecto %j", async (body) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => body }));
    await expect(consultarPrecios()).rejects.toThrow("formato inesperado");
  });

  it("descarta registros inválidos y conserva las cotizaciones válidas", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ bitcoin: { usd: 10 }, ethereum: { usd: -1 }, solana: { usd: "12" } }),
    }));
    expect((await consultarPrecios()).map((moneda) => moneda.id)).toEqual(["bitcoin"]);
  });

  it.each([null, [], 7])("descarta un registro de moneda incorrecto %j", async (bitcoin) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ bitcoin }) }));
    expect(await consultarPrecios()).toEqual([]);
  });

  it.each([429, 503])("comunica el error HTTP %i", async (status) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status }));
    await expect(consultarPrecios()).rejects.toThrow(status === 429 ? "demasiadas solicitudes" : "503");
  });

  it("propaga un fallo de red", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Sin conexión")));
    await expect(consultarPrecios()).rejects.toThrow("Sin conexión");
  });
});
