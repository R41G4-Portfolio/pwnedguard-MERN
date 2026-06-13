import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Función original para SRI (Archivos externos JS/CSS)
function calculateSRI(filePath, algorithm = 'sha384') {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash(algorithm);
  hash.update(fileBuffer);
  return `${algorithm}-${hash.digest('base64')}`;
}

// 2. Nueva función para calcular el Hash CSP de bloques inline (SHA-256 base64)
function calculateCSPHash(content) {
  const hash = crypto.createHash('sha256');
  hash.update(content, 'utf8');
  return `'sha256-${hash.digest('base64')}'`;
}

const distDir = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');

try {
  let html = fs.readFileSync(indexPath, 'utf8');
  const cssHashes = [];

  console.log('\n--- 🛡️ INICIANDO POSTPROCESAMIENTO DE SEGURIDAD ---');

  // Lógica A: Inyectar SRI a las etiquetas estándar de assets (script y stylesheet)
  html = html.replace(/<(script type="module"|link rel="stylesheet")([^>]*)\shref="([^"]+)"([^>]*)>/g, (match, tagType, before, href, after) => {
    // Evitar romper enlaces externos absolutos
    if (href.startsWith('http') || href.startsWith('//')) return match;

    const filePath = path.join(distDir, href.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) return match;

    const integrity = calculateSRI(filePath, 'sha384');
    
    if (tagType.includes('script'))
      return `<script type="module"${before} href="${href}" integrity="${integrity}" crossorigin="anonymous"${after}></script>`;
    else
      return `<link rel="stylesheet"${before} href="${href}" integrity="${integrity}" crossorigin="anonymous"${after}>`;
  });

  // Lógica B: Tu lógica original adaptada para modulepreload
  html = html.replace(/<link rel="modulepreload" crossorigin href="([^"]+)">/g, (match, href) => {
    const filePath = path.join(distDir, href.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) return match;

    const integrity = calculateSRI(filePath, 'sha384');
    return `<link rel="modulepreload" crossorigin="anonymous" href="${href}" integrity="${integrity}">`;
  });

  // Lógica C: Capturar bloques <style> inline para generar sus hashes CSP
  const styleBlockRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
  let match;
  while ((match = styleBlockRegex.exec(html)) !== null)
  {
    const styleContent = match[1].trim();
    if (styleContent.length > 0)
	{
      const cspHash = calculateCSPHash(styleContent);
      cssHashes.push(cspHash);
    }
  }

  // Escribir el HTML blindado
  fs.writeFileSync(indexPath, html);
  console.log('✅ SRI (Integrity) inyectado exitosamente en index.html.');

  // 3. Output crucial para laconfiguración de Nginx
  console.log('\n======================================================');
  console.log('🚨 HASHES DETECTADOS PARA la configuración CSP DE NGINX (style-src):');
  if (cssHashes.length > 0)
    console.log(`style-src 'self' ${cssHashes.join(' ')};`);
  else
    console.log("style-src 'self'; (No se detectaron bloques inline críticos)");

  console.log('======================================================\n');

}
catch (error)
{
  console.error('❌ Error procesando el HTML de producción:', error);
}