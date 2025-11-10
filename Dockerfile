# ============================================
# ETAPA 1: BUILDER - Compilar la aplicación Angular
# ============================================
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# OPTIMIZACIÓN 1: Copiar archivos de configuración primero (mejor aprovechamiento de caché)
COPY package*.json angular.json tsconfig*.json ./
COPY extra-webpack.config.js generate-sitemap.js ./

# OPTIMIZACIÓN 2: Instalar dependencias con flags de velocidad mejorados
# --no-audit: Omite auditoría de seguridad (ahorra ~30s)
# --no-fund: Omite mensajes de funding (ahorra ~5s)
# --legacy-peer-deps: Resuelve dependencias conflictivas
# --prefer-offline: Usa caché local cuando está disponible
RUN npm ci --legacy-peer-deps --prefer-offline --no-audit --no-fund

# OPTIMIZACIÓN 3: Copiar solo directorio src/ (evita copiar archivos innecesarios)
COPY src ./src

# OPTIMIZACIÓN 4: Build con máxima optimización de velocidad y tamaño
# --build-optimizer: Optimizaciones adicionales de Angular
# --aot: Compilación Ahead-of-Time (obligatorio en producción)
# --vendor-chunk=false: Evita chunk separado de vendors (bundle más optimizado)
# --common-chunk=false: Evita chunk común (reduce complejidad)
# --progress=false: No muestra barra de progreso (más rápido en CI/CD)
RUN npm run build -- \
    --output-path=./dist/out \
    --configuration=production \
    --source-map=false \
    --optimization=true \
    --build-optimizer=true \
    --aot=true \
    --vendor-chunk=false \
    --common-chunk=false \
    --progress=false

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