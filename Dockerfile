# ETAPA 1: BUILDER - Para compilar la aplicación
FROM node:20-slim as builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila la aplicación en modo producción
RUN npm run build -- --output-path=./dist/out --configuration=production

# ----------------------------------------------------------------------
# ETAPA 2: PRODUCTION - Para servir los archivos estáticos
# Usamos Nginx para servir la aplicación de forma eficiente
FROM nginx:alpine

# Copia los archivos estáticos (el resultado de la compilación) al directorio de Nginx
# El contenido de 'dist/out/browser' es lo que ng build genera por defecto en las versiones modernas de Angular
COPY --from=builder /app/dist/out/browser /usr/share/nginx/html

# Opcional: Copia una configuración de Nginx personalizada (si la necesitas)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# El puerto 80 es el puerto por defecto de Nginx
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]# ETAPA 1: BUILDER - Para compilar la aplicación
FROM node:20-slim as builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila la aplicación en modo producción
RUN npm run build -- --output-path=./dist/out --configuration=production

# ----------------------------------------------------------------------
# ETAPA 2: PRODUCTION - Para servir los archivos estáticos
# Usamos Nginx para servir la aplicación de forma eficiente
FROM nginx:alpine

# Copia los archivos estáticos (el resultado de la compilación) al directorio de Nginx
# El contenido de 'dist/out/browser' es lo que ng build genera por defecto en las versiones modernas de Angular
COPY --from=builder /app/dist/out/browser /usr/share/nginx/html

# Opcional: Copia una configuración de Nginx personalizada (si la necesitas)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# El puerto 80 es el puerto por defecto de Nginx
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]