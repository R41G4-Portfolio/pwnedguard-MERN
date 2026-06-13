import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Función para SRI (Archivos externos JS/CSS)
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
  if (!fs.existsSync(indexPath)) {
    throw new Error(`No se encontró el archivo index.html en: ${indexPath}`);
  }

  let html = fs.readFileSync(indexPath, 'utf8');
  const cssHashes = [];

  console.log('\n--- 🛡️ INICIANDO POSTPROCESAMIENTO DE SEGURIDAD ---');

  // ========================================================
  // LÓGICA A1: Procesar Scripts (Soporta Autoconclusivos /> y normales)
  // ========================================================
  html = html.replace(/<script\b[^>]*?\bsrc="([^"]+)"[^>]*?>(<\/script>)?/g, (match, src) => {
    if (src.startsWith('http') || src.startsWith('//')) return match;

    const filePath = path.join(distDir, src.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Archivo JS no encontrado para integridad: ${filePath}`);
      return match;
    }

    const integrity = calculateSRI(filePath, 'sha384');
    console.log(`Adding integrity to JS: ${src}`);
    
    // Retorna una etiqueta limpia y estandarizada evitando duplicaciones de atributos
    return `<script type="module" src="${src}" integrity="${integrity}" crossorigin="anonymous"></script>`;
  });

  // ========================================================
  // LÓGICA A2: Procesar Stylesheets (Limpia crossorigin previos)
  // ========================================================
  html = html.replace(/<link\b[^>]*?\brel="stylesheet"[^>]*?\bhref="([^"]+)"[^>]*?>/g, (match, href) => {
    if (href.startsWith('http') || href.startsWith('//')) return match;

    const filePath = path.join(distDir, href.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Archivo CSS no encontrado para integridad: ${filePath}`);
      return match;
    }

    const integrity = calculateSRI(filePath, 'sha384');
    console.log(`Adding integrity to CSS: ${href}`);
    
    return `<link rel="stylesheet" href="${href}" integrity="${integrity}" crossorigin="anonymous">`;
  });

  // ========================================================
  // LÓGICA B: Limpieza e Integridad para modulepreload (si existieran)
  // ========================================================
  html = html.replace(/<link\b[^>]*?\brel="modulepreload"[^>]*?\bhref="([^"]+)"[^>]*?>/g, (match, href) => {
    if (href.startsWith('http') || href.startsWith('//')) return match;

    const filePath = path.join(distDir, href.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) return match;

    const integrity = calculateSRI(filePath, 'sha384');
    console.log(`Adding integrity to modulepreload: ${href}`);
    return `<link rel="modulepreload" href="${href}" integrity="${integrity}" crossorigin="anonymous">`;
  });

  // ========================================================
  // LÓGICA C: Capturar bloques <style> inline para generar sus hashes CSP
  // ========================================================
  const styleBlockRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
  let matchStyle;
  while ((matchStyle = styleBlockRegex.exec(html)) !== null) {
    const styleContent = matchStyle[1].trim();
    if (styleContent.length > 0) {
      const cspHash = calculateCSPHash(styleContent);
      cssHashes.push(cspHash);
    }
  }

  // Escribir el HTML blindado de forma definitiva
  fs.writeFileSync(indexPath, html);
  console.log('✅ SRI (Integrity) inyectado exitosamente en index.html.');

  // Output para la configuración de Nginx
  console.log('\n======================================================');
  console.log('🚨 HASHES DETECTADOS PARA LA CONFIGURACIÓN CSP DE NGINX (style-src):');
  if (cssHashes.length > 0) {
    console.log(`style-src 'self' ${cssHashes.join(' ')};`);
  } else {
    console.log("style-src 'self'; (No se detectaron bloques inline críticos)");
  }
  console.log('======================================================\n');

} catch (error) {
  console.error('❌ Error procesando el HTML de producción:', error);
}