# ============================================
# ETAPA 1: BUILDER - Compilar la aplicación Angular
# ============================================
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias necesarias para compilación
# (algunas librerías de Node pueden necesitar python y make)
RUN apk add --no-cache python3 make g++

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
# Nota: npm install funciona tanto con como sin package-lock.json
RUN npm install --legacy-peer-deps

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación en modo producción
RUN npm run build -- --output-path=./dist/out --configuration=production

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