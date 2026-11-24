import { useState, type FormEvent } from "react";
import { z } from "zod";
import type { FiltrosConsulta, SeleccionMoneda } from "../types/crypto";

// Primer criterio: texto opcional, pero si se escribe debe tener al menos 2 letras.
// Segundo criterio: solo se admiten los valores de selección declarados.
const esquema = z.object({
  texto: z.string().trim().refine((texto) => texto.length === 0 || texto.length >= 2, {
    message: "Escribí al menos 2 caracteres o dejá el campo vacío.",
  }),
  moneda: z.enum(["todas", "bitcoin", "ethereum", "solana"], {
    error: "Elegí una criptomoneda válida.",
  }),
});

interface Props {
  alConsultar: (filtros: FiltrosConsulta) => void;
  cargando: boolean;
}

export function FormularioConsulta({ alConsultar, cargando }: Props) {
  const [texto, setTexto] = useState("");
  const [moneda, setMoneda] = useState<SeleccionMoneda>("todas");
  const [errores, setErrores] = useState<{ texto?: string; moneda?: string }>({});

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const resultado = esquema.safeParse({ texto, moneda });

    if (!resultado.success) {
      const campos = resultado.error.flatten().fieldErrors;
      setErrores({ texto: campos.texto?.[0], moneda: campos.moneda?.[0] });
      return;
    }

    setErrores({});
    alConsultar(resultado.data);
  }

  return (
    <form onSubmit={enviar} noValidate className="formulario" aria-label="Formulario de consulta de criptomonedas">
      <div className="formulario__campos">
        <div className="campo">
          <label htmlFor="texto-busqueda">Buscar por nombre o símbolo</label>
          <input
            id="texto-busqueda"
            type="text"
            placeholder="Ej.: Bitcoin o BTC (opcional)"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              if (errores.texto) setErrores((prev) => ({ ...prev, texto: undefined }));
            }}
            aria-invalid={Boolean(errores.texto)}
            aria-describedby={errores.texto ? "error-texto" : "ayuda-texto"}
          />
          {errores.texto ? (
            <p id="error-texto" className="error-campo" role="alert">{errores.texto}</p>
          ) : (
            <p id="ayuda-texto" className="ayuda-campo">Dejá vacío para ver las tres monedas.</p>
          )}
        </div>
        <div className="campo">
          <label htmlFor="moneda-seleccion">Criptomoneda</label>
          <select
            id="moneda-seleccion"
            value={moneda}
            onChange={(e) => {
              setMoneda(e.target.value as SeleccionMoneda);
              if (errores.moneda) setErrores((prev) => ({ ...prev, moneda: undefined }));
            }}
            aria-invalid={Boolean(errores.moneda)}
            aria-describedby={errores.moneda ? "error-moneda" : undefined}
          >
            <option value="todas">Todas las criptomonedas</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="solana">Solana</option>
          </select>
          {errores.moneda && <p id="error-moneda" className="error-campo" role="alert">{errores.moneda}</p>}
        </div>
      </div>
      <button className="boton boton--principal" type="submit">
        {cargando ? "Consultar nuevamente" : "Consultar precios"}
        <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
