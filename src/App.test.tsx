import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "./App";
import { useFavoritosStore } from "./stores/favoritos";

beforeEach(() => {
  localStorage.clear();
  useFavoritosStore.setState({ favoritos: [] });
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ bitcoin: { usd: 91000 }, ethereum: { usd: 3100 }, solana: { usd: 175 } }),
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe("Recorridos principales", () => {
  it("consulta, marca un favorito, abre el detalle y vuelve conservando la selección", async () => {
    const usuario = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    await usuario.click(screen.getByRole("button", { name: /Consultar precios/ }));
    expect(await screen.findAllByRole("article")).toHaveLength(3);
    const tarjeta = screen.getAllByRole("article")[0];
    await usuario.click(within(tarjeta).getByRole("button", { name: "Agregar a destacados: Bitcoin" }));
    await usuario.click(within(tarjeta).getByRole("link", { name: /Ver detalle/ }));
    expect(await screen.findByText("Cotización de Bitcoin en dólares")).toBeTruthy();
    expect(screen.getByText("★ 1 favorita")).toBeTruthy();
    await usuario.click(screen.getByRole("link", { name: /Volver a los resultados/ }));
    await usuario.click(screen.getByRole("button", { name: /Consultar precios/ }));
    expect((await screen.findByRole("button", { name: "Quitar de destacados: Bitcoin" })).getAttribute("aria-pressed")).toBe("true");
  });

  it("reconstruye un detalle al entrar directamente por su ruta", async () => {
    render(<MemoryRouter initialEntries={["/criptomonedas/solana"]}><App /></MemoryRouter>);
    expect(await screen.findByText("Cotización de Solana en dólares")).toBeTruthy();
  });

  it("informa un identificador inválido sin consultar la API", () => {
    render(<MemoryRouter initialEntries={["/criptomonedas/inventada"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /Esta criptomoneda no existe/ })).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });
});
