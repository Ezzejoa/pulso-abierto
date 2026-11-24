import { Link } from "react-router";

export function NoEncontradoPage() {
  return (
    <section className="pagina-estatica" role="status">
      <p className="codigo-404">404</p>
      <p className="sobretitulo">Página no encontrada</p>
      <h1>La dirección que buscás no existe.</h1>
      <p>Verificá la dirección o regresá al inicio para consultar los precios.</p>
      <Link to="/" className="boton boton--principal">Volver al inicio</Link>
    </section>
  );
}
