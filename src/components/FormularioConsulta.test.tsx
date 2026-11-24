import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormularioConsulta } from "./FormularioConsulta";

describe("Formulario controlado", () => {
  it("acepta la consulta sin filtros", async () => {
    const consultar = vi.fn();
    render(<FormularioConsulta alConsultar={consultar} cargando={false} />);
    await userEvent.click(screen.getByRole("button", { name: /Consultar precios/ }));
    expect(consultar).toHaveBeenCalledWith({ texto: "", moneda: "todas" });
  });

  it("rechaza un carácter, muestra el error y permite corregirlo", async () => {
    const consultar = vi.fn();
    const usuario = userEvent.setup();
    render(<FormularioConsulta alConsultar={consultar} cargando={false} />);
    const campo = screen.getByRole("textbox", { name: /Buscar por nombre/ });
    await usuario.type(campo, "x");
    await usuario.click(screen.getByRole("button", { name: /Consultar precios/ }));
    expect(screen.getByRole("alert").textContent).toContain("al menos 2 caracteres");
    expect(consultar).not.toHaveBeenCalled();
    await usuario.clear(campo);
    await usuario.type(campo, "  btc  ");
    await usuario.selectOptions(screen.getByRole("combobox"), "bitcoin");
    await usuario.click(screen.getByRole("button", { name: /Consultar precios/ }));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(consultar).toHaveBeenCalledWith({ texto: "btc", moneda: "bitcoin" });
  });
});
