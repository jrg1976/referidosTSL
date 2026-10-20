# referidostesla.com

Web estática de una sola página (HTML + CSS + JS en línea) para Cloudflare Pages. No hay paso de compilación: el directorio raíz es el que se publica.

## Publicar en Cloudflare Pages
- Framework preset: *None*. Build command: vacío. Output directory: `/`.
- Dominio personalizado `referidostesla.com`. Redirigir `www.referidostesla.com` → `https://referidostesla.com/` con una regla de redirección 301 (Bulk Redirects o Redirect Rules) y activar *Always Use HTTPS*.
- `_headers` define cabeceras de seguridad y caché.
- `README.md` y `fonts/LICENSE.txt` se publican también; no afectan al SEO.

## Al revisar las condiciones (todo a la vez)
1. `index.html`: buscar `20/10/2026` (5 apariciones visibles, dentro de `<time datetime="2026-10-20">`) y el texto de la meta description.
2. `index.html` JSON-LD: `dateModified` y la fecha de la `description` del WebPage.
3. `sitemap.xml`: `<lastmod>`.
4. `llms.txt`: fecha de comprobación.
5. Si cambia el texto de una FAQ, cambiarlo igual en el `<details>` y en el JSON-LD (deben ser idénticos).
6. Si se llega a 10 recomendaciones en el año, añadir un aviso visible en el hero.

## Pendiente
- Foto del propietario: guardar `img/propietario-480.webp`, `-800.webp` y `-1200.webp` (proporción 4:5) y sustituir el `<figure>` de la sección «Quién recomienda» por el `<img>` que está comentado justo encima.
- Validar en https://validator.schema.org y en la prueba de resultados enriquecidos de Google tras publicar.
- Alta en Google Search Console y Bing Webmaster Tools, y enviar `sitemap.xml`.
