# Changelog — Endurance Team CR

Todos los cambios relevantes del proyecto se documentan aquí.

---

## [1.5.0] — 2026-05-29

### SEO
- Auditoría SEO completa del sitio
- `robots.txt` creado con referencia al sitemap
- Schema markup JSON-LD (`SportsOrganization`) agregado en `<head>`
- H1 reescrito con keywords: "Entrenamiento Running y Triatlón en Cartago, Costa Rica"
- Title tag optimizado a 58 caracteres con keywords y ubicación
- Sitemap actualizado: `lastmod`, `changefreq` y `priority` correctos
- 16 alt texts de galería reescritos con keywords geolocalizados
- Logo alt text actualizado con nombre de marca completo
- H2 de sección Stats convertidos a `<span>` (corrección semántica)
- Email bug corregido: `hola@enduranceteam.com` → `enduranceprogram@outlook.es`

### Rendimiento
- `loading="lazy"` agregado a 19 imágenes (galería, equipo, about)
- 9 imágenes convertidas de JPG/JPEG/PNG a WebP y referencias actualizadas
- `display: block` agregado a `.stat-number` en CSS tras cambio semántico

### Contenido
- Descripciones expandidas en los 4 planes de Running
- Descripciones expandidas en los 3 planes de Modalidades Mixtas
- Descripciones expandidas en los 5 programas especializados
- Copyright actualizado de 2025 → 2026

### Archivos nuevos
- `robots.txt` — directivas para crawlers con referencia al sitemap
- `privacidad.html` — política de privacidad (Ley 8968 Costa Rica)
- `.gitignore` — exclusiones para `.claude/`, `.gstack/`, OS y editores

### Limpieza
- 22 archivos eliminados: 9 imágenes reemplazadas por WebP + 13 huérfanas sin uso
- `sitemap.xml` actualizado con URL de privacidad

---

## [1.4.0] — 2026-05-18

### UX Mobile
- Mejora general de experiencia móvil: textos y touch targets
- Corrección de color del texto en botón "Contáctanos" del menú hamburguesa

---

## [1.3.0] — 2026-05-17

### UX & Rendimiento
- Mejoras generales de experiencia de usuario y rendimiento
- Mejora de consistencia visual y limpieza de CSS
- Corrección de bugs críticos de contenido, UX y accesibilidad

---

## [1.2.0] — 2026-04-28

### Galería & Planes
- Actualización de imágenes y videos de la página
- Nuevo elemento agregado a la galería (Gran Maratón Cartago 2026)
- Nuevo plan Pace Mastery agregado
- Actualización de link de contacto

---

## [1.1.0] — 2026-02-15

### Funcionalidad
- Modal promocional de bienvenida
- Mejoras en formulario de contacto en mobile
- Mejoras en dots de planes (scroll indicators)
- Modificación de precios

### Coaches
- Cambio de fotos de coaches en modales y sección equipo

### Técnico
- Favicon optimizado para todos los dispositivos
- Meta tags duplicados eliminados
- Etiqueta canonical agregada

---

## [1.0.0] — 2025-12-18

### Lanzamiento inicial
- Sitio publicado en producción (enduranceteamcr.com)
- Secciones: Hero, Stats, Sobre Nosotros, Beneficios, Equipo, Galería, Precios, Programas, Contacto, Footer
- 3 coaches con modales detallados (Carlos, Brenda, Anderson)
- Galería con filtros y GLightbox
- 8 planes de entrenamiento (Running + Modalidades Mixtas)
- Formulario de contacto con integración WhatsApp
- `sitemap.xml` y página `404.html`
- Hosting: Cloudflare Pages con dominio propio
