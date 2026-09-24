/* =====================================================
   script.js — JavaScript base
   Portafolio: Jeshua Useche
   Commit 1: Solo utilidades mínimas (sin lógica aún)
   ===================================================== */

// ─── Footer: año dinámico ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/*
 * TODO — Commit 2:
 *   - Toggle menú hamburger (mobile)
 *   - Highlight nav-link activo al hacer scroll
 *
 * TODO — Commit 3+:
 *   - Animaciones de entrada (Intersection Observer)
 *   - Formulario de contacto
 */
