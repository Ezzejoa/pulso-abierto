# Registro de preparación de la Actividad 4

La entrega anterior de Pulso Abierto correspondía a la Actividad 2. En esta etapa se recuperó ese proyecto y se completaron los requisitos de favoritos persistentes y pruebas automatizadas que exige el contexto de la Actividad 4.

Se conservan el formulario, las tres criptomonedas, la API de CoinGecko y las rutas del proyecto. Zustand reemplaza el estado local de destacadas y conserva únicamente sus identificadores. Las pruebas utilizan Vitest y Testing Library.

La única mejora de mantenibilidad es la extracción de `esRegistro` en el servicio HTTP. Las 19 pruebas y el build pasaron antes y después de esa refactorización.

La asistencia de IA se utilizó para revisar la consigna, adaptar el código, preparar las pruebas y documentar el cierre. Las verificaciones efectivamente realizadas y los pasos pendientes de GitHub, preview visual y Vercel se detallan en el README. No se atribuyen publicaciones ni revisiones de navegador que todavía no se realizaron.
