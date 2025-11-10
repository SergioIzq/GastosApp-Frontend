# ============================================
# ETAPA 1: BUILDER - Compilar la aplicación Angular
# ============================================
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar SOLO package.json y package-lock.json primero
# Esto aprovecha la caché de Docker cuando solo cambia el código
COPY package*.json ./

# Instalar dependencias
# --omit=dev: No instala devDependencies innecesarias en producción
# --prefer-offline: Usa caché local si está disponible
RUN npm ci --legacy-peer-deps --omit=dev --prefer-offline

# Copiar el resto del código fuente DESPUÉS de instalar dependencias
COPY . .

# Compilar la aplicación en modo producción con optimizaciones
# --output-hashing=all: Hashing para caché del navegador
# --source-map=false: No genera source maps (más rápido y ligero)
RUN npm run build -- \
    --output-path=./dist/out \
    --configuration=production \
    --source-map=false \
    --optimization=true

# ============================================
# ETAPA 2: PRODUCTION - Servir con Nginx Alpine
# ============================================
FROM nginx:alpine AS final

# Metadatos de la imagen
LABEL maintainer="sergioizqdev"
LABEL description="AhorroLand Frontend - Angular Application"

# Copiar archivos estáticos compilados
COPY --from=builder /app/dist/out /usr/share/nginx/html

# Copiar configuración personalizada de Nginx para SPAs
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear usuario no-root para nginx (mejor seguridad)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html

# Cambiar permisos del directorio temporal de nginx
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Cambiar al usuario no-root
USER nginx

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]