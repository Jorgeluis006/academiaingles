# Atisbe Academy (React + PHP)

Este repositorio contiene la versión React del frontend en `frontend/` y el backend PHP en `php/`.

Para desplegar en Hostinger:
- Compila `frontend` y sube `frontend/dist` al `public_html`.
- Sube `php/` y `uploads/` con permisos de escritura.
- Asegúrate de que `.htaccess` esté en la raíz para ruteo del SPA.
- Revisa `php/db.php` con las credenciales de la base de datos.

Más detalles en `DEPLOY_HOSTINGER.md`.

Tema y personalización:
- El CSS principal se encuentra en `frontend/src/theme.css` (variables en :root).
- Cambia las variables `--color-*` para ajustar la paleta global.
