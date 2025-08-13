const fs = require('fs');
const path = require('path');

const domain = 'https://ahorroland.sergioizq.es';
const appRoutesPath = path.join(__dirname, 'src', 'app', 'app.routes.ts');
const outputPath = path.join(__dirname, 'dist', 'sitemap.xml');

function extractLazyModules(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Eliminar caracteres HTML escapados
  const cleanContent = content.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

  const modules = [];
  const routeBlocks = cleanContent.split(/},\s*{/); // separar bloques de rutas

  routeBlocks.forEach(block => {
    const pathMatch = block.match(/path:\s*['"]([^'"]+)['"]/);
    const loadChildrenMatch = block.match(/loadChildren:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]/);

    if (pathMatch && loadChildrenMatch) {
      const basePath = pathMatch[1];
      const importPath = loadChildrenMatch[1];
      const fullPath = path.resolve(__dirname, 'src', 'app', importPath.replace('./', ''));
      const moduleDir = path.dirname(fullPath);

      modules.push({ basePath: '/' + basePath, moduleDir });
      console.log(`✅ Módulo lazy-loaded detectado: ${basePath} -> ${importPath}`);
    }
  });

  if (modules.length === 0) {
    console.warn('⚠️ No se encontraron módulos lazy-loaded en app.routes.ts');
  }

  return modules;
}

function extractChildRoutes(routingFile) {
  console.log(`📄 Leyendo archivo de rutas hijas: ${routingFile}`);
  const content = fs.readFileSync(routingFile, 'utf-8');

  // Regex para capturar todas las rutas definidas en path: 'ruta' o path: "ruta"
  const regex = /path:\s*['"]([^'"]+)['"]/g;
  const routes = new Set();
  let match;
  while ((match = regex.exec(content)) !== null) {
    const route = match[1].trim();
    if (route !== '**') { // ignorar wildcard
      routes.add(route);
    }
  }

  if (routes.size === 0) {
    console.warn(`⚠️ No se encontraron rutas hijas en ${routingFile}`);
  } else {
    console.log(`✅ Rutas hijas encontradas:`, Array.from(routes));
  }

  return routes;
}

function findRoutingFile(dir) {
  console.log(`🔎 Buscando archivo .routing.ts en: ${dir}`);
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️ El directorio no existe: ${dir}`);
    return null;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.routing.ts')) {
      console.log(`📄 Archivo routing.ts encontrado: ${file}`);
      return path.join(dir, file);
    }
  }

  console.warn(`⚠️ No se encontró archivo routing.ts en ${dir}`);
  return null;
}

function buildFullRoutes(modules) {
  const allRoutes = new Set();
  for (const { basePath, moduleDir } of modules) {
    const routingFile = findRoutingFile(moduleDir);
    if (routingFile) {
      const childRoutes = extractChildRoutes(routingFile);
      childRoutes.forEach(child => {
        let fullRoute = child === '' ? basePath : `${basePath}/${child}`;

        // Eliminar parámetros dinámicos (partes que comienzan con :)
        fullRoute = fullRoute
          .split('/')           // separar por segmentos
          .filter(segment => !segment.startsWith(':')) // quitar los dinámicos
          .join('/');

        allRoutes.add(fullRoute);
      });
    }
  }

  if (allRoutes.size === 0) {
    console.warn('⚠️ No se generaron rutas completas. Revisa los archivos routing.ts.');
  }

  return allRoutes;
}

// Ejecutar
const lazyModules = extractLazyModules(appRoutesPath);
const allRoutes = buildFullRoutes(lazyModules);

// Generar sitemap
const today = new Date().toISOString().split('T')[0];

// Convertimos todas las rutas en un array y las ordenamos
const sortedRoutes = Array.from(allRoutes).sort();

// Creamos la entrada manual para la ruta base "/"
const baseEntry = `  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

// Generamos el resto de entradas, excluyendo la ruta base si existiera
const otherEntries = sortedRoutes
  .filter(route => route !== '/') // evitar duplicar la base
  .map(route => {
    return `  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

// Unimos la entrada base con las demás
const entries = [baseEntry, ...otherEntries];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, sitemap, 'utf-8');

console.log(`✅ Sitemap generado con ${allRoutes.size + 1} rutas en ${outputPath}`);
