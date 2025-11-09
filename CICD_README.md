# 🚀 CI/CD Pipeline - AhorroLand Frontend

Este repositorio incluye un pipeline de CI/CD con GitHub Actions que automáticamente construye y publica imágenes Docker del frontend Angular en Docker Hub.

## 📋 Requisitos Previos

1. **Cuenta de Docker Hub**: Necesitas tener una cuenta en [Docker Hub](https://hub.docker.com/)
2. **Repositorio Docker Hub**: El repositorio `sergioizqdev/ahorroland-frontend` debe existir en Docker Hub

## 🔧 Configuración en GitHub

### Paso 1: Agregar Secrets

Ve a tu repositorio en GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Agrega los siguientes secrets:

| Secret Name | Descripción | Ejemplo |
|-------------|-------------|---------|
| `DOCKER_USERNAME` | Tu usuario de Docker Hub | `sergioizqdev` |
| `DOCKER_PASSWORD` | Tu token de acceso o contraseña de Docker Hub | `dckr_pat_...` |

#### ¿Cómo obtener un token de Docker Hub?
1. Ve a [Docker Hub](https://hub.docker.com/)
2. Inicia sesión
3. Ve a **Account Settings** → **Security** → **New Access Token**
4. Dale un nombre descriptivo (ej: "GitHub Actions Frontend")
5. Copia el token generado y úsalo como `DOCKER_PASSWORD`

### Paso 2: Verificar el Workflow

El archivo de workflow está ubicado en `.github/workflows/ci-cd.yml`

## 🎯 ¿Cómo Funciona?

### Triggers (Disparadores)

El pipeline se ejecuta automáticamente cuando:

- ✅ Se hace **push** a las ramas `main`, `master` o `develop`
- ✅ Se crean **tags** con formato `v*.*.*` (ej: `v1.0.0`)
- ✅ Se abren **Pull Requests** hacia `main`, `master` o `develop`
- ✅ Se ejecuta **manualmente** desde GitHub Actions

### Stages (Etapas)

#### 1. **Build and Test** 🧪
- Descarga el código
- Configura Node.js 20
- Instala las dependencias (npm ci)
- Ejecuta el linter
- Compila la aplicación Angular en modo producción
- Ejecuta las pruebas unitarias con Karma

#### 2. **Docker Build and Push** 🐳
- Construye la imagen Docker (multi-stage con Nginx)
- Genera tags automáticos basados en:
  - Rama actual (ej: `main`, `develop`)
  - Commit SHA (ej: `main-abc1234`)
  - Versión semántica si es un tag (ej: `1.0.0`, `1.0`, `1`)
  - `latest` para la rama principal
- Sube la imagen a Docker Hub
- Utiliza caché para optimizar builds futuros
- Genera imágenes multi-arquitectura (amd64, arm64)

#### 3. **Notify** 📢
- Notifica el resultado del despliegue

## 🏷️ Sistema de Tags

### Tags Automáticos por Rama
```bash
# Push a main/master
→ sergioizqdev/ahorroland-frontend:main
→ sergioizqdev/ahorroland-frontend:latest

# Push a develop
→ sergioizqdev/ahorroland-frontend:develop

# Commit específico
→ sergioizqdev/ahorroland-frontend:main-abc1234
```

### Tags por Versión (Releases)
```bash
# Tag: v1.2.3
→ sergioizqdev/ahorroland-frontend:1.2.3
→ sergioizqdev/ahorroland-frontend:1.2
→ sergioizqdev/ahorroland-frontend:1
→ sergioizqdev/ahorroland-frontend:latest
```

## 📦 Uso de las Imágenes

### Despliegue Manual
```bash
# Última versión estable
docker pull sergioizqdev/ahorroland-frontend:latest

# Versión específica
docker pull sergioizqdev/ahorroland-frontend:1.2.3

# Rama de desarrollo
docker pull sergioizqdev/ahorroland-frontend:develop
```

### En docker-compose.prod.yml
```yaml
services:
  frontend:
    image: sergioizqdev/ahorroland-frontend:${FRONTEND_VERSION:-latest}
    # ...resto de configuración
```

Para usar una versión específica:
```bash
FRONTEND_VERSION=1.2.3 docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 Workflow de Desarrollo

### Para crear un nuevo release:

```bash
# 1. Asegúrate de estar en la rama principal
git checkout main
git pull origin main

# 2. Crea un tag con la versión
git tag -a v1.2.3 -m "Release version 1.2.3"

# 3. Sube el tag a GitHub
git push origin v1.2.3

# 4. El pipeline se ejecutará automáticamente
```

### Para desarrollo continuo:

```bash
# 1. Haz tus cambios en develop o feature branch
git checkout develop
git add .
git commit -m "feat: nueva funcionalidad"
git push origin develop

# 2. El pipeline construirá automáticamente la imagen con tag 'develop'
```

## 🐛 Troubleshooting

### Error: "authentication required"
- Verifica que los secrets `DOCKER_USERNAME` y `DOCKER_PASSWORD` estén correctamente configurados
- Asegúrate de que el token de Docker Hub tenga permisos de escritura

### Error: "repository does not exist"
- Crea el repositorio en Docker Hub antes de ejecutar el pipeline
- O cambia el nombre del repositorio en el workflow

### Error en npm install
- Puede ser por problemas de memoria
- Intenta usar `npm ci` localmente primero
- Verifica que el `package-lock.json` esté actualizado

### Error en el build de Angular
- Revisa los logs del job "Build and Test"
- Asegúrate de que el proyecto compile localmente: `npm run build -- --configuration=production`
- Verifica que todas las dependencias estén correctamente instaladas

### Error en los tests
- Los tests están configurados con `continue-on-error: true` por lo que no deberían bloquear el pipeline
- Sin embargo, es importante revisarlos y corregirlos

## 📊 Monitoreo

Puedes ver el estado de tus pipelines en:
- **GitHub**: `https://github.com/SergioIzq/GastosApp-Frontend/actions`
- **Docker Hub**: `https://hub.docker.com/r/sergioizqdev/ahorroland-frontend/tags`

## 🔒 Mejores Prácticas

1. ✅ Usa siempre tokens de acceso en lugar de contraseñas
2. ✅ Nunca comitees credenciales en el código
3. ✅ Usa versiones específicas en producción (no `latest`)
4. ✅ Prueba localmente antes de hacer push:
   ```bash
   npm install
   npm run lint
   npm run build -- --configuration=production
   npm test -- --watch=false
   ```
5. ✅ Revisa los logs del pipeline cuando falle
6. ✅ Mantén el `package-lock.json` actualizado

## 🏗️ Arquitectura del Dockerfile

El Dockerfile usa una estrategia **multi-stage**:

1. **Stage 1 (builder)**: 
   - Node 20 slim
   - Compila la aplicación Angular
   - Genera los archivos estáticos optimizados

2. **Stage 2 (production)**:
   - Nginx Alpine (imagen ligera)
   - Solo contiene los archivos compilados
   - Sirve la aplicación en el puerto 80

Esto resulta en imágenes finales muy pequeñas y optimizadas (~40-50 MB).

## 🌐 Configuración de Nginx (Opcional)

Si necesitas configurar Nginx (por ejemplo, para SPAs con routing), puedes crear un archivo `nginx.conf` y descomentarlo en el Dockerfile:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Configuración de caché para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📝 Notas

- Las imágenes están optimizadas con caché para builds más rápidos
- Se generan imágenes multi-arquitectura (AMD64 y ARM64)
- Los Pull Requests solo ejecutan build y tests, no publican imágenes
- La imagen final usa Nginx Alpine para mejor rendimiento y seguridad
