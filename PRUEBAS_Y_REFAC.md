# Registro de preparación de la Actividad 4

Se recuperó Pulso Abierto y se completaron los requisitos de favoritos persistentes y pruebas automatizadas exigidos por la Actividad 4. Se mantuvieron el formulario, las tres criptomonedas, la API de CoinGecko y las rutas del proyecto.

Zustand conserva únicamente los identificadores de favoritos mediante `persist`. Vitest y Testing Library verifican el servicio, el formulario, la persistencia y los recorridos principales.

La única mejora de mantenibilidad fue extraer la función privada `esRegistro` en el servicio HTTP. Las mismas 19 pruebas y el build pasaron antes y después de esa refactorización. También se comprobaron instalación, pruebas y build en una copia descargada de GitHub.

El 24 de noviembre de 2026 se publicó el repositorio `Ezzejoa/pulso-abierto` y se realizó el despliegue de producción en Vercel. La aplicación pública se verificó con la API real, navegación, recarga de detalle, favoritos persistentes, validación del formulario y dos anchos de viewport. Los resultados y los enlaces de entrega se encuentran en el README.

La asistencia de IA se utilizó para revisar la consigna, adaptar el código, preparar las pruebas, publicar el proyecto y documentar las verificaciones realizadas.
