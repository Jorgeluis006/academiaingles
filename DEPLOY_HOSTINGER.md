# Despliegue en Hostinger (carpeta pública)

Instrucciones rápidas para subir la versión React junto al backend PHP en Hostinger.

1. Compila tu frontend (local):

```bash
cd frontend
npm install
npm run build
```

2. Conéctate al panel de Hostinger (Administrador de archivos o FTP) y sube los contenidos de `frontend/dist/` a la carpeta `public_html` (raíz) del sitio.

3. Copia la carpeta `php/` al servidor (en `public_html/php`).

4. Asegura permisos de escritura en `uploads/` (755/775) para el servidor.

5. Sube el archivo `.htaccess` (ya incluido) para habilitar el ruteo del SPA.

6. Verifica que `php/db.php` contiene las credenciales correctas para tu base de datos en Hostinger.

8. Tema: la paleta y estilos están en `frontend/src/theme.css`. Cambia las variables CSS en `:root` y recompila si quieres otro esquema.

7. (Opcional) Crea una tarea cron o limpieza manual para limpiar `uploads/trash/` si deseas auto-eliminación.

Eso es todo: la app React debería cargarse desde `https://tu-dominio.com` y las llamadas a `/php/*` seguirán funcionando.
